const axios = require('axios');

exports.token_info = async(req, res, next) =>{
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://aptos.hatchy.fun/token/get-token-list?page=1&perPage=9',
        headers: { 
          'Accept': 'application/json, text/plain, */*', 
          'Accept-Language': 'en-US,en;q=0.9', 
          'Connection': 'keep-alive', 
          'DNT': '1', 
          'If-None-Match': 'W/"1df9-tq/rZtM0RrJG+LVbPFwmaEjb4X8"', 
          'Origin': 'https://warpgate.fun', 
          'Referer': 'https://warpgate.fun/', 
          'Sec-Fetch-Dest': 'empty', 
          'Sec-Fetch-Mode': 'cors', 
          'Sec-Fetch-Site': 'cross-site', 
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 
          'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"', 
          'sec-ch-ua-mobile': '?0', 
          'sec-ch-ua-platform': '"macOS"'
        }
    };

    let resp = await axios.request(config);    
    res.json(resp.data.paginatedResult.results)
}

exports.token_tx = async(req, res, next) =>{
    // let token = '0xe8272500f90ca42e49a95111619b0d1e9cf6983d80b05836cc18cde237f4531c::ZAD::ZAD'
    let token = req.query.token
    let resp = await axios.get(`https://aptos.hatchy.fun/transaction/query-txn/${token}`)
    res.json(resp.data.data)
}