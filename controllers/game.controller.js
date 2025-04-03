const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * POST /store_user_score
 * Body: { email, move_wallet, score, nft_metadata }
 */
exports.store_user_score = async (req, res) => {
    console.log("PQD store game");
    try {
        const { email, move_wallet, score, nft_metadata } = req.body;

        // Basic validation
        if (!move_wallet) {
        return res.json({ error: 'move_wallet is required.' });
        }
        if (typeof score === 'undefined') {
        return res.json({ error: 'score is required.' });
        }

        // Upsert user data in game_trackit table
        // If a record with the same move_wallet doesn't exist, insert a new one.
        // If it exists, update it.
        const { data, error } = await supabase
        .from('game_trackit')
        .upsert([
            {
            email,
            move_wallet,
            score,
            nft_metadata,
            updated_at: new Date().toISOString(),
            },
        ], {
            onConflict: 'move_wallet', // upsert based on move_wallet
        })
        .select();

        if (error) {
        throw error;
        }

        res.json({ message: 'Score stored/updated successfully', data });
    } catch (error) {
        console.error('Error storing/updating user score:', error);
        res.json({ error: 'Internal server error' });
    }
};

/**
 * GET /get_top_3_daily
 * Returns the top 3 daily scores by descending order.
 */
exports.get_top_3_daily = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('game_trackit')
      .select('*')
      .order('score', { ascending: false })
      .limit(3);

    if (error) {
      throw error;
    }

    res.json(data)
  } catch (error) {
    console.error('Error fetching top 3 daily scores:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /reset_daily_scores
 * Resets all users' scores to 0.
 */
exports.reset_daily_scores = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('game_trackit')
      .update({ 
        score: 0,
        updated_at: new Date().toISOString(),
      })
      .neq('score', 0)  // Optional: only update those who don't already have a 0 score
      .select();

    if (error) {
      throw error;
    }

    res.status(200).json({
      message: 'All scores have been reset to 0',
      data,
    });
  } catch (error) {
    console.error('Error resetting daily scores:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
