const Web3 = require('web3');
const Contract = require('web3-eth-contract');
const link_abi = require('../config/abi/link_abi.json')

const axios = require('axios');
const HDWalletProvider = require("@truffle/hdwallet-provider");

const link_provider = new HDWalletProvider({ 
    privateKeys: ['eedddc0cdc167430de9383d213a9b53c67aefd61bf3c277e3dbe01ee206f9230'], 
    providerOrUrl: "https://arbitrum.llamarpc.com",
    pollingInterval: 8000
});

// Set up the Web3 instance
const providerUrl = "https://sepolia.metisdevops.link";
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

Contract.setProvider(link_provider)

exports.claim_token = async(req, res, next) =>{
    const scriptURLGet = "https://script.google.com/macros/s/AKfycbwpKywlfgvuc_P_6ZYtAArtiKW9pgEmGuuKpmWOsqcAqQbG2C1My2kaV3eQkUdMicTK/exec"
    const url = `${scriptURLGet}?email=${req.body.email}`;
    const user_info = await axios.get(url);
    let to_adr = user_info.data.wallet
    let amount =  100
    let user = req.body.email
    let contract_params = {
        from: '0x90de83fd2cd4d01660cd6909692568a14661cdf1',
        gasPrice: 25000000000,
        gasLimit: 8500000,
    }
    let receipt = await contract.methods.vault_transfer(to_adr, amount, user).send(Object.assign(contract_params));
    console.log("Transaction receipt: ", receipt)
    res.json(receipt)
}

exports.get_xau_price = async(req, res, next) =>{
    let link_contract = new Contract(link_abi, "0x1F954Dc24a49708C26E0C1777f16750B5C6d5a2c")

    let latestRoundId = await link_contract.methods.latestRound().call();
    let contract_resp = await link_contract.methods.getRoundData(latestRoundId).call();

    res.json({
        roundId: contract_resp.roundId,
        price: contract_resp.answer / 1e18, // Convert from wei to ether (assuming answer is in wei)
        startedAt: contract_resp.startedAt,
        updatedAt: contract_resp.updatedAt,
        answeredInRound: contract_resp.answeredInRound
    });
}

exports.get_tx_by_addr = async(req, res, next) =>{
    let addr = req.query.addr
    let contract = "0x01368f47E2DA0F8259E6d9D23dA18e3CCec02a39"
    const url = `https://sepolia-explorer-api.metisdevops.link/api/v2/addresses/${addr}/transactions?filter=${contract}`;

    const response = await axios.get(url, {
        headers: {
            'accept': 'application/json'
        }
    });

    let resp = response.data.items.map((item) =>{        
        return {
            tx_hash: item.hash,
            from: addr,
            to: contract,
            timestamp: item.timestamp
        }
    })

    for(let i = 0; i < resp.length; i++){
        let tx_url = `https://sepolia-explorer-api.metisdevops.link/api/v2/transactions/${resp[i].tx_hash}`
        let tx_info = await axios.get(tx_url, {
            headers: {
                'accept': 'application/json'
            }
        });
        if(tx_info.data.value > 0){
            resp[i].type = "buy"
        }else{
            resp[i].type = "sell"
        }
    }

    res.json(resp)
}