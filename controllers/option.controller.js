exports.asset = async (req, res, next) => {
    try {
        const asset = {
            "asset_id":"dgt_1",
            "name":"meme coin",
            "symbol":"dgt_ass_1",
            "decimal":2411,
            "price":24111998,
            "owner":"pqd_dgt_adr"
        }
        res.json({
            code: 0,
            data: asset
        });
    } catch (error) {
        console.log("Error to get user profile: ", error)
        next(error);
    }
};

// New function returning the sidebar items with "content" instead of "route"
exports.getSidebarOptions = async (req, res, next) => {
    try {
        const sidebarItems = [
            { 
                name: "New Pair", 
                content: "Add and track a newly created token pair on the platform." 
            },
            { 
                name: "Trending", 
                content: "View top-trending tokens based on volume and social mentions." 
            },
            { 
                name: "Holding", 
                content: "Monitor your current holdings and portfolio performance." 
            },
            { 
                name: "Follow", 
                content: "Follow specific tokens or wallets for real-time updates." 
            },
            { 
                name: "Token Analytics", 
                content: "Access detailed analytics for any token, including price charts and on-chain data." 
            },
            { 
                name: "Wallet Analyzer", 
                content: "Analyze wallet addresses, track transactions, and review portfolio allocations." 
            },
            { 
                name: "Whales Tracker", 
                content: "Identify and monitor large wallet (whale) activities and trades." 
            },
            { 
                name: "Telegram Bot", 
                content: "Configure the Telegram bot for real-time token price alerts and notifications." 
            },
            { 
                name: "News Aggregator", 
                content: "Stay updated with curated crypto news and market insights." 
            },

            // Premium Tools Section
            { 
                name: "PREMIUM TOOLS", 
                content: "Unlock advanced trading and analysis features with our premium subscription." 
            },
            { 
                name: "Top Traders", 
                content: "Track the best-performing traders and learn from their strategies." 
            },
            { 
                name: "InsightsGPT", 
                content: "Leverage AI-driven insights for market trends and token research." 
            },
            { 
                name: "Smart Traders", 
                content: "Gain access to exclusive tools used by professional traders." 
            }
        ];

        res.json(sidebarItems);
    } catch (error) {
        console.log("Error to get sidebar options: ", error);
        next(error);
    }
};