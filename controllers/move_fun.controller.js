const axios = require('axios');
const { json } = require('express');

exports.token_info = async(req, res, next) =>{
    try {
        // Get token address from query parameters.
        const tokenAddress = req.query.token;
        if (!tokenAddress) {
            return res.status(400).json({ message: 'Missing token address in query parameter' });
        }

        // Fetch full token info from Warpgate API.
        const tokenResp = await axios.get(`https://mainnet-api.move.fun/api/v1/token-info?tokenAddress=${tokenAddress}`);
        const tokenInfo = tokenResp.data;

        // Determine mint address; prefer mintAddr or mint if available.
        const mint = tokenInfo.mintAddr || tokenInfo.mint || tokenAddress;

        // Define the intervals (in minutes) for which we want price change percentages.
        const intervals = {
            "5M": 5,
            "15M": 15,
            "1H": 60,
            "24H": 1440,
        };

        let priceChange = {};

        // For each interval, query the candlestick API and compute the percentage change.
        await Promise.all(
            Object.entries(intervals).map(async ([label, minutes]) => {
            const url = `https://api.warpgate.fun/token/query-candlestick?mint=${mint}&intervalMin=${minutes}&offset=0&limit=1000&startTime=1720569600000&endTime=1739458816000`;
            try {
                const candleResp = await axios.get(url);
                const candles = candleResp.data.data;
                if (candles && candles.length > 0) {
                const first = candles[0];
                const last = candles[candles.length - 1];
                // Avoid division by zero.
                if (first.open !== 0) {
                    const pct = ((last.close - first.open) / first.open) * 100;
                    priceChange[label] = pct;
                } else {
                    priceChange[label] = null;
                }
                } else {
                priceChange[label] = null;
                }
            } catch (err) {
                console.error(`Error fetching candlestick for interval ${label} for token ${mint}:`, err.message);
                priceChange[label] = null;
            }
            })
        );

        // Add the computed price change percentages to the token info.
        tokenInfo.price_change_percentage = priceChange;

        // Return the full token info JSON including the new field.
        res.json(tokenInfo);
    } catch (err) {
        console.error("Error in token_info:", err.message);
        res.status(500).json({ message: "Error fetching token info", details: err.message });
    }
}

exports.move_fun_list = async(req, res, next) =>{
    let limit = req.query.limit || 10;
    let offset = req.query.offset || 1;
    let type = Number(req.query.type)
    let chain = req.query.chain;

    let resp = await axios.get(`https://mainnet-api.move.fun/api/v1/tokens-list?page=${offset}&limit=${limit}&sortBy=updatedAt&sortDirection=desc&showMigrated=true&showUnmigrated=true`);   
    console.log("fun resp: ", resp.data) 
    let tokens = resp.data.tokens;
    tokens.map((token) =>{
        token.pool_url = `https://www.move.fun/token/${token.address}`
    })
    switch (type) {
        case 1:
            console.log("Token new")
            tokens = tokens.map((token) =>{
                if(Number(token.holderPercentage) <= 10){
                    return token
                }
            })
            res.json(tokens)
            break;
        case 2:
            console.log("Token trending")
            tokens = tokens.map((token) =>{
                if(10 <= Number(token.holderPercentage) <= 20){
                    return token
                }
            })
            res.json(tokens)
            break;
        case 3:
            console.log("Token completed")
            tokens = tokens.map((token) =>{
                if(Number(token.holderPercentage) >= 20){
                    return token
                }
            })
            res.json(tokens)
            break;
        default:
            res.json(tokens)
            break;
    }
}