const axios = require('axios');
const { json } = require('express');
const { AmmPoolManager, AggregatorQuoter, AggregatorQuoterQueryParams } = require('@flowx-finance/sdk');

exports.token_info = async(req, res, next) =>{
    try {
        // Get token address from query parameters.
        const tokenAddress = req.query.token;
        if (!tokenAddress) {
            return res.status(400).json({ message: 'Missing token address in query parameter' });
        }

        // Fetch full token info from Warpgate API.
        const tokenResp = await axios.get(`https://api.warpgate.fun/token/get-token/${tokenAddress}`);
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

exports.token_tx = async(req, res, next) =>{
    // // let token = '0xe8272500f90ca42e49a95111619b0d1e9cf6983d80b05836cc18cde237f4531c::ZAD::ZAD'
    // let token = req.query.token
    // let resp = await axios.get(`https://api.warpgate.fun/transaction/query-txn/${token}`)
    // res.json(resp.data.data)
    res.json([
        {
          tokenMint: "0x1a2b3c4d5e6f7g8h9i0j",
          txnHash: "0xabc123def456ghi789jkl012mno345pq",
          side: "buy",
          username: "suiTrader01",
          userWalletAddr: "0x01aB23Cd45Ef678GhIj9KL0MnPqRStU2vW",
          userAvatar: "https://example.com/avatars/user1.png",
          xAmt: "1500.00",
          yAmt: "0.0432",
          gas: null,
          timestamp: "1745850920000000",
          status: "success",
        },
        {
          tokenMint: "0x9z8y7x6w5v4u3t2s1r0q",
          txnHash: "0xdef789ghi012jkl345mno678pqr901stu",
          side: "sell",
          username: "DeFiAlice",
          userWalletAddr: "0xAaBbCcDdEeFf00112233445566778899",
          userAvatar: null,
          xAmt: "0.750",
          yAmt: "2625.00",
          gas: null,
          timestamp: "1745852567000000",
          status: "pending",
        },
        {
          tokenMint: "0xAaBbCcDdEeFfGgHhIiJj",
          txnHash: "0xghi345jkl678mno901pqr234stu567vwx",
          side: "buy",
          username: "SuiWhale",
          userWalletAddr: "0x1234abcd5678efgh9012ijkl3456mnop",
          userAvatar: "https://example.com/avatars/user3.jpg",
          xAmt: "5000.00",
          yAmt: "0.1408",
          gas: null,
          timestamp: "1745857205000000",
          status: "success",
        }        
      ]
    )
}

exports.list_token = async(req, res, next) =>{
    let limit = req.query.limit || 10;
    let offset = req.query.offset || 1;
    let type = Number(req.query.type)
    let chain = req.query.chain;
    if(chain == "sui"){
        let resp = await axios.get(`https://api.turbos.finance/fun/pools?search=&sort=created_at&completed=false&page=${offset}&pageSize=${limit}&direction=desc`);    
        let tokens = resp.data.data;
        res.json(tokens)
        return
    }
    /*
        1: new
        2: trending
        3: completed
    */
    
    let resp = await axios.get(`https://api.warpgate.fun/token/get-token-list?page=${offset}&perPage=${limit}`);    
    let tokens = resp.data.paginatedResult.results;
    tokens.map((token) =>{
        token.exchange = 'warpgate'
        token.pool_url = `https://warpgate.fun/trading-view/${token.mintAddr}`
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

exports.swap_route = async(req, res, next) =>{
    let srcAddr = req.query.src_adr || ''
    let dstAddr = req.query.dst_adr || ''
    let amount = 100; // Consider making this dynamic based on user input if needed
    let api_key = process.env.API_KEY;

    // Log the parameters being sent
    console.log("Request Parameters:", { srcAddr, dstAddr, amount });

    try {
        const response = await axios({
            method: "GET",
            url: "https://testnet.mosaic.ag/porto/v1/quote",
            params: {
                srcAsset: srcAddr,
                dstAsset: dstAddr,
                amount,
                // sender: user.accountAddress.toString(), // Uncomment if needed
                // slippage: 100, // Uncomment if needed
            },
            headers: {
                "X-API-KEY": api_key,
            },
        });

        console.log("PQD Data: ", response.data);
        res.json(response.data.data);
    } catch (error) {
        // Check if the error response exists
        if (error.response) {
            // Log the error details
            console.error("Error Response:", error.response.data);
            console.error("Error Status:", error.response.status);
            console.error("Error Headers:", error.response.headers);

            // Send a structured error response to the client
            res.status(error.response.status).json({
                message: 'Error occurred while processing the request',
                details: error.response.data,
            });
        } else {
            // Handle other types of errors (e.g., network errors)
            console.error("Error Message:", error.message);
            res.status(500).json({
                message: 'An unexpected error occurred',
                details: error.message,
            });
        }
    }
}

exports.sui_route = async(req, res, next) =>{
    const quoter = new AggregatorQuoter('mainnet');
    const params = {
        tokenIn: '0x2::sui::SUI',
        tokenOut: '0x6dae8ca14311574fdfe555524ea48558e3d1360d1607d1c7f98af867e3b7976c::flx::FLX',
        amountIn: '10000000000',
        includeSources: null, //optional
        excludeSources: null, //optional
        commission: null, //optional, and will be explain later
    };

    const routes = await quoter.getRoutes(params);
    res.json(routes)
}

exports.search = async(req, res, next) =>{
    try {
        // 1. URL-encode the token query parameter  
        const token = encodeURIComponent(req.query.token);
        const url = `https://gmgn.ai/vas/api/v1/search?q=${token}`;
    
        // 2. Send headers a browser would send (User-Agent, Referer, Origin)
        const resp = await axios.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
              'AppleWebKit/537.36 (KHTML, like Gecko) ' +
              'Chrome/114.0.0.0 Safari/537.36',  
            'Referer': 'https://gmgn.ai/',  
            'Origin': 'https://gmgn.ai',  
            'Accept': 'application/json, text/javascript, */*; q=0.01',  
          },
          // 3. If GMGN ever requires cookies / credentials:
          // withCredentials: true  
        });
    
        // 4. Proxy the JSON right back to your client
        res.json(resp.data);
      } catch (err) {
        console.error('GMGN search error:', err.response?.status, err.message);
        // Render a friendly error if it’s still a 403
        if (err.response?.status === 403) {
          return res
            .status(403)
            .json({ error: 'Access forbidden. Have you whitelisted your server IP?' });
        }
        next(err);
    }
}