const axios = require('axios');
const { json } = require('express');

exports.token_info = async(req, res, next) =>{
    let resp = await axios.get('https://aptos.hatchy.fun/token/get-token-list?page=1&perPage=9');    
    res.json(resp.data.paginatedResult.results)
}

exports.token_tx = async(req, res, next) =>{
    // let token = '0xe8272500f90ca42e49a95111619b0d1e9cf6983d80b05836cc18cde237f4531c::ZAD::ZAD'
    let token = req.query.token
    let resp = await axios.get(`https://aptos.hatchy.fun/transaction/query-txn/${token}`)
    res.json(resp.data.data)
}

exports.list_token = async(req, res, next) =>{
    let limit = req.query.limit;
    let offset = req.query.offset;
    let type = Number(req.query.type)
    /*
        1: new
        2: trending
        3: completed
    */
    
    let resp = await axios.get(`https://aptos.hatchy.fun/token/get-token-list?page=${limit}&perPage=${offset}`);    
    let tokens = resp.data.paginatedResult.results;
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