const axios = require("axios")
const sui_monitor = require('../chains/monitor/sui_monitor')
const evm_adr = require('../chains/address/evm.address')
const apt_adr = require('../chains/address/apt.address')
const algo_adr = require('../chains/address/algo.address')

const { Wallet } = require('ethers')
const wallet = Wallet.createRandom()
const vaults = require('../services/vault')
const { User } = require('../model/user')
const { Profile } = require('../model/profile')

exports.get_list_follower = async(req, res, next) =>{
    const { profileId } = req.params;

    try {
        // Find the user profile by user_id
        const userProfile = await Profile.findOne({ profile_id: profileId });
        if (!userProfile) {
        return res.status(404).send({ message: 'User profile not found' });
        }

        // Return the list of followers
        res.status(200).send(userProfile.followers);
    } catch (error) {
        console.error("Error getting followers:", error);
        res.status(500).send({ message: 'Error getting followers', error });
    }
}

exports.follow_profile = async(req, res, next) =>{
    const { profileId } = req.params;
    const { followerName } = req.body;

    try {
        // Find the user profile to follow
        const userProfile = await Profile.findOne({ profile_id: profileId });
        if (!userProfile) {
        return res.status(404).send({ message: 'User profile not found' });
        }

        // Add the follower to the user's followers list
        userProfile.followers.push({ name: followerName });

        // Save the updated user profile
        await userProfile.save();

        res.status(200).send({ message: 'Successfully followed the user', profile: userProfile });
    } catch (error) {
        console.error("Error following user:", error);
        res.status(500).send({ message: 'Error following user', error });
    }
}

exports.register = async(req, res, next) =>{
    const user = new User(req.body)
    console.log("PQD go there: ", user)

    if(!user || user == undefined){
        res.json({
            "Error":"DB connection error"
        })
        return 
    }

    let resp = user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            success: true,
            user: doc
        });
    })
}

exports.subscribe = async(req, res, next) =>{
    let user_info = {
        "chain": req.body.chain, 
        "wallet": req.body.wallet, 
    }
    let resp = await subscribe_signal(user_info)
    if(resp.length <= 0){
        return "Error subscrtiption"
    }
    res.json({
        "dgt_id": resp[0].objectId,
        "digest": resp[0].digest
    })
}
exports.vault_balance = async(req, res, next) =>{
    let vault_id = req.query.vault_id
    const vault_balance = [
        {
            "vault_id":"dgt_v1",
            "balance":24111306, 
            "staked": 20051998
        }
    ]

    res.json(vault_balance)
}

exports.profile = async (req, res, next) => {
    try {
        const wallet = req.query.wallet

        // const userProfile = await User.findOne({ email: user_email });

        // if(!userProfile || userProfile == undefined){
        //     res.json("Error: invalid user")
        // }

        const user_resp = {
            "wallet": "0x1234567890abcdef1234567890abcdef12345678",
            "assetHoldings": [
              {
                "name": "Bitcoin",
                "symbol": "BTC",
                "quantity": 1.2,
                "price": 30000.0,
                "change24h": -2.1
              },
              {
                "name": "Ethereum",
                "symbol": "ETH",
                "quantity": 15.0,
                "price": 2000.0,
                "change24h": 4.3
              },
              {
                "name": "Solana",
                "symbol": "SOL",
                "quantity": 100.0,
                "price": 25.0,
                "change24h": 1.8
              }
            ],
            "nftHoldings": [
              {
                "name": "CryptoPunk #3100",
                "quantity": 1,
                "creator": "Larva Labs"
              },
              {
                "name": "Art Blocks #204",
                "quantity": 2,
                "creator": "Art Blocks"
              }
            ],
            "topHolders": [
              {
                "address": "0x1234567890abcdef1234567890abcdef12345678",
                "amount": 2300.0,
                "percentage": 23.0
              },
              {
                "address": "0x9876543210fedcba9876543210fedcba98765432",
                "amount": 1800.0,
                "percentage": 18.0
              }
            ],
            "transactions": [
              {
                "block": 1050000,
                "hash": "0xabc123def4567890abc123def4567890abc123def4567890abc123def4567890",
                "timestamp": 1694256712,
                "from": "0xabcdef1234567890abcdef1234567890abcdef12",
                "to": "0x1234567890abcdef1234567890abcdef12345678",
                "amount": 1.0,
                "fee": 0.0001,
                "function": "deposit"
              },
              {
                "block": 1050001,
                "hash": "0xdef456abc1237890def456abc1237890def456abc1237890def456abc1237890",
                "timestamp": 1694256812,
                "from": "0x1234567890abcdef1234567890abcdef12345678",
                "to": "0xabcdef1234567890abcdef1234567890abcdef12",
                "amount": 0.5,
                "fee": 0.0002,
                "function": "withdraw"
              },
              {
                "block": 1050002,
                "hash": "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
                "timestamp": 1694256912,
                "from": "0x1234567890abcdef1234567890abcdef12345678",
                "to": "0x876543210fedcba9876543210fedcba987654321",
                "amount": 2.0,
                "fee": 0.0003,
                "function": "swap"
              }
            ]
        }
          
        res.json(user_resp);
    } catch (error) {
        console.log("Error to get user profile: ", error)
        next(error);
    }
};

exports.user_portfolio = async(req, res, next)=>{
    const pool_adr = "0xbd85f61a1b755b6034c62f16938d6da7c85941705d9d10aa1843b809b0e35582"
    const chain = "sui"
    let signal_info = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chain}/${pool_adr}`)
    // console.log("Signal info: ", signal_info.data.pairs)

    const portfolio = signal_info.data.pairs

    res.json(portfolio)
}

exports.user_history = async(req, res, next)=>{
    let adr = req.query.wallet
    console.log("User address: ", adr)
    const user_tracker = {
        "wallet": "0x1234567890abcdef1234567890abcdef12345678",
        "assetHoldings": [
          {
            "name": "Bitcoin",
            "symbol": "BTC",
            "quantity": 1.2,
            "price": 30000.0,
            "change24h": -2.1
          },
          {
            "name": "Ethereum",
            "symbol": "ETH",
            "quantity": 15.0,
            "price": 2000.0,
            "change24h": 4.3
          },
          {
            "name": "Solana",
            "symbol": "SOL",
            "quantity": 100.0,
            "price": 25.0,
            "change24h": 1.8
          }
        ],
        "nftHoldings": [
          {
            "name": "CryptoPunk #3100",
            "quantity": 1,
            "creator": "Larva Labs"
          },
          {
            "name": "Art Blocks #204",
            "quantity": 2,
            "creator": "Art Blocks"
          }
        ],
        "topHolders": [
          {
            "address": "0x1234567890abcdef1234567890abcdef12345678",
            "amount": 2300.0,
            "percentage": 23.0
          },
          {
            "address": "0x9876543210fedcba9876543210fedcba98765432",
            "amount": 1800.0,
            "percentage": 18.0
          }
        ],
        "transactions": [
          {
            "block": 1050000,
            "hash": "0xabc123def4567890abc123def4567890abc123def4567890abc123def4567890",
            "timestamp": 1694256712,
            "from": "0xabcdef1234567890abcdef1234567890abcdef12",
            "to": "0x1234567890abcdef1234567890abcdef12345678",
            "amount": 1.0,
            "fee": 0.0001,
            "function": "deposit"
          },
          {
            "block": 1050001,
            "hash": "0xdef456abc1237890def456abc1237890def456abc1237890def456abc1237890",
            "timestamp": 1694256812,
            "from": "0x1234567890abcdef1234567890abcdef12345678",
            "to": "0xabcdef1234567890abcdef1234567890abcdef12",
            "amount": 0.5,
            "fee": 0.0002,
            "function": "withdraw"
          },
          {
            "block": 1050002,
            "hash": "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
            "timestamp": 1694256912,
            "from": "0x1234567890abcdef1234567890abcdef12345678",
            "to": "0x876543210fedcba9876543210fedcba987654321",
            "amount": 2.0,
            "fee": 0.0003,
            "function": "swap"
          }
        ]
    }
      
    res.json(user_tracker)
}

exports.sub_deposit_event = async(req, res, next) =>{
    //making connection + 
    const event_resp = await sui_monitor.emit_investor_deposit()
    res.json(event_resp)
}

exports.get_evm_address = async(req, res, next) =>{
    let account_id = req.query.account_id
    let address_id = req.query.address_id

    let adr_resp = await evm_adr.generate(account_id, address_id)

    res.json(adr_resp)
}

exports.get_apt_address = async(req, res, next) =>{
    let account_id = req.query.account_id

    let adr_resp = await apt_adr.aptos_address(wallet.mnemonic.phrase, account_id)

    res.json(adr_resp)
}

exports.get_algo_address = async(req, res, next) =>{
    let account_id = req.query.account_id

    let adr_resp = await algo_adr.createAddress()

    res.json(adr_resp)
}