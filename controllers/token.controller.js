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
    
    let resp = await axios.get(`https://aptos.hatchy.fun/token/get-token-list?page=${offset}&perPage=${limit}`);    
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

exports.swap_route = async(req, res, next) =>{
    let data = {
        "srcAsset": "0x1::aptos_coin::AptosCoin",
        "dstAsset": "0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDC",
        "srcAmount": 100000,
        "dstAmount": 2056477,
        "feeAmount": 100000,
        "isFeeIn": true,
        "paths": [
          {
            "source": "razor_swap",
            "srcAsset": "0x1::aptos_coin::AptosCoin",
            "dstAsset": "0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDC",
            "srcAmount": 100000,
            "dstAmount": 2056477
          }
        ],
        "tx": {
          "function": "0xede23ef215f0594e658b148c2a391b1523335ab01495d8637e076ec510c6ec3c::router::swap",
          "typeArguments": [
            "0x1::aptos_coin::AptosCoin",
            "0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDC",
            "0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDT",
            "0xede23ef215f0594e658b148c2a391b1523335ab01495d8637e076ec510c6ec3c::router::Null",
            "0xede23ef215f0594e658b148c2a391b1523335ab01495d8637e076ec510c6ec3c::router::Null",
            "0xede23ef215f0594e658b148c2a391b1523335ab01495d8637e076ec510c6ec3c::router::Null",
            "0xede23ef215f0594e658b148c2a391b1523335ab01495d8637e076ec510c6ec3c::router::Null",
            "0xede23ef215f0594e658b148c2a391b1523335ab01495d8637e076ec510c6ec3c::router::Null",
            "0xede23ef215f0594e658b148c2a391b1523335ab01495d8637e076ec510c6ec3c::router::Null",
            "0xede23ef215f0594e658b148c2a391b1523335ab01495d8637e076ec510c6ec3c::router::Null",
            "0xede23ef215f0594e658b148c2a391b1523335ab01495d8637e076ec510c6ec3c::router::Null",
            "0xede23ef215f0594e658b148c2a391b1523335ab01495d8637e076ec510c6ec3c::router::Null",
            "0xede23ef215f0594e658b148c2a391b1523335ab01495d8637e076ec510c6ec3c::router::Null",
            "0xede23ef215f0594e658b148c2a391b1523335ab01495d8637e076ec510c6ec3c::router::Null",
            "0xede23ef215f0594e658b148c2a391b1523335ab01495d8637e076ec510c6ec3c::router::Null"
          ],
          "functionArguments": [
            "0x47652bd91e7cf0ca0476eaff712f360addc1edeadd86352f37586183d0278d08",
            [
              "1000000000000"
            ],
            [
              "0",
              "2",
              "1",
              "3",
              "18446744073709551614",
              "0",
              "2",
              "3",
              "4"
            ],
            [
              "0xa"
            ],
            [
              "0x234f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f"
            ],
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0",
            false,
            "2000000000000",
            "10",
            "pid",
            "{}"
          ]
        }
    }

    res.json(data)
}