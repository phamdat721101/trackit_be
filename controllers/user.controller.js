const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client using environment variables for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// New controller to store user information to Supabase DB
exports.store_user = async (req, res, next) => {
    try {
        // Expecting a JSON body with 'email' and 'move_wallet'
        const { email, move_wallet } = req.body;

        // Basic validation
        if (!email || !move_wallet) {
            return res.status(400).json({ error: "Email and move_wallet are required." });
        }

        // Insert the user data into the 'users' table
        const { data, error } = await supabase
            .from('user_trackit')
            .insert([{ email, move_wallet }]);

        if (error) {
            throw error;
        }

        res.status(201).json({ message: "User information stored successfully", data });
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
