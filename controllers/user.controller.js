const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { jwtToAddress } = require('@mysten/sui/zklogin');
require('dotenv').config();

// Initialize Supabase client using environment variables for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Google OAuth2 client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Secret for signing your app’s JWTs
const APP_JWT_SECRET = process.env.APP_JWT_SECRET;

// ————————————————————————————————
// 1️⃣ Exchange Google ID Token → App JWT
// POST /auth/login
// Body: { id_token }
exports.login_user = async (req, res, next) => {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      return res.status(400).json({ error: "id_token is required." });
    }

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, nonce } = payload;

    // Issue your own JWT (expires in 1h)
    const appToken = jwt.sign(
      { sub, email, nonce },
      APP_JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ jwt_token: appToken });
  } catch (error) {
    console.error("Error in login_user:", error);
    return res.status(401).json({ error: "Invalid Google ID token." });
  }
};

// ————————————————————————————————
// 2️⃣ Take App JWT → Derive Sui address → Store & Return
// POST /auth/store
// Header: Authorization: Bearer <jwt>
exports.store_auth = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || '';
      const sessionToken = authHeader.split(' ')[1];
      const { id_token, } = req.body;
  
      if (!sessionToken) {
        return res.status(401).json({ error: "Authorization token missing." });
      }
    //   if (!id_token) {
    //     return res.status(400).json({ error: "id_token is required in body." });
    //   }
  
      // Verify session JWT
      const decoded = jwt.verify(sessionToken, APP_JWT_SECRET);
      const { email } = decoded;
  
      // Derive Sui address from the OAuth id_token
      const move_wallet = jwtToAddress(id_token, 721101);

      // Reuse your existing store_user logic
      // (we pass through email & move_wallet)
      req.body = { email, move_wallet };
      return exports.store_user(req, res, next);
  
    } catch (error) {
      console.error("Error in store_auth:", error);
      return res.status(401).json({ error: "Invalid or expired token." });
    }
};  

// ————————————————————————————————
// Existing controllers below — unchanged:

// New controller to store user information to Supabase DB
exports.store_user = async (req, res, next) => {
    try {
        // Expecting a JSON body with 'email' and 'move_wallet'
        const {email, move_wallet} = req.body
        // // Basic validation
        // if (!email || !move_wallet) {
        //     return res.status(400).json({ error: "Email and move_wallet are required." });
        // }

        // Insert the user data into the 'users' table
        const { data, error } = await supabase
            .from('user_trackit')
            .insert([{ email, move_wallet }]);

        if (error) {
            throw error;
        }

        res.status(200).json({"wallet":move_wallet});
    } catch (error) {
        console.error("Error storing user information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// New controller to get all users from the 'users' table
exports.get_all_users = async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('user_trackit')
            .select('*');

        if (error) {
            throw error;
        }

        res.json({ data });
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// New controller to get user(s) by email or move_wallet
exports.get_user_by_email_or_wallet = async (req, res, next) => {
    try {
        // Expect query parameters 'email' and/or 'move_wallet'
        const { email, move_wallet } = req.query;

        if (!email && !move_wallet) {
            return res.status(400).json({ error: "Please provide an email or move_wallet query parameter." });
        }

        // Construct the filter condition for Supabase OR query
        let filterCondition = "";
        if (email && move_wallet) {
            filterCondition = `email.eq.${email},move_wallet.eq.${move_wallet}`;
        } else if (email) {
            filterCondition = `email.eq.${email}`;
        } else if (move_wallet) {
            filterCondition = `move_wallet.eq.${move_wallet}`;
        }

        const { data, error } = await supabase
            .from('user_trackit')
            .select('*')
            .or(filterCondition);

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ data });
    } catch (error) {
        console.error("Error fetching user by email or move_wallet:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
