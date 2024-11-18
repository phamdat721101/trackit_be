const Contract = require('web3-eth-contract');
const vault = require('../services/vault');
const axios = require('axios')
const { Profile } = require('../model/profile')

exports.share_profile = async(req, res, next) =>{
    let resp = [
        {
            id: "post_12345",
            profile_id: "pn_v1",
            userAvatar: "https://example.com/avatar.jpg",
            userName: "JohnDoe",
            postTime: "2024-07-28T14:30:00Z",
            content: "Excited to share the latest updates on DigiTrust!",
            bull: ["user_1", "user_2", "user_3"],
            bear: ["user_4", "user_5"],
            share: ["JaneSmith", "MikeJohnson"],
            listCommen: [
              {
                id: "comment_1",
                profile_id: "pn_v1",
                userAvatar: "https://example.com/commenter1.jpg",
                userName: "JaneSmith",
                postTime: "2024-07-28T15:00:00Z",
                content: "Great update, looking forward to more!",
                bull: ["user_6", "user_7"],
                bear: ["user_8"],
                share: ["JohnDoe"],
                listComment: []
              },
              {
                id: "comment_2",
                profile_id: "pn_v1",
                userAvatar: "https://example.com/commenter2.jpg",
                userName: "MikeJohnson",
                postTime: "2024-07-28T16:00:00Z",
                content: "Can't wait to see how this evolves.",
                bull: ["user_9"],
                bear: ["user_10"],
                share: ["JaneSmith"],
                listComment: [
                  {
                    id: "reply_1",
                    profile_id: "pn_v1",
                    userAvatar: "https://example.com/replier1.jpg",
                    userName: "AliceBrown",
                    postTime: "2024-07-28T16:30:00Z",
                    content: "Absolutely! This is just the beginning.",
                    bull: ["user_11"],
                    bear: ["user_12"],
                    share: ["MikeJohnson"]
                  }
                ]
              }
            ]
        }          
    ]

    res.json(resp)
}

exports.bear_id = async(req, res, next) =>{
    let resp = [
        {
            id: "post_12345",
            profile_id: "pn_v1",
            userAvatar: "https://example.com/avatar.jpg",
            userName: "JohnDoe",
            postTime: "2024-07-28T14:30:00Z",
            content: "Excited to share the latest updates on DigiTrust!",
            bull: ["user_1", "user_2", "user_3"],
            bear: ["JaneSmith", "MikeJohnson"],
            share: ["user_6", "user_7"],
            listComment: [
              {
                id: "comment_1",
                profile_id: "pn_v1",
                userAvatar: "https://example.com/commenter1.jpg",
                userName: "JaneSmith",
                postTime: "2024-07-28T15:00:00Z",
                content: "Great update, looking forward to more!",
                bull: ["user_8", "user_9"],
                bear: ["JohnDoe"],
                share: ["user_10"],
                listComment: []
              },
              {
                id: "comment_2",
                profile_id: "pn_v1",
                userAvatar: "https://example.com/commenter2.jpg",
                userName: "MikeJohnson",
                postTime: "2024-07-28T16:00:00Z",
                content: "Can't wait to see how this evolves.",
                bull: ["user_11"],
                bear: ["JaneSmith"],
                share: ["user_12"],
                listComment: [
                  {
                    id: "reply_1",
                    profile_id: "pn_v1",
                    userAvatar: "https://example.com/replier1.jpg",
                    userName: "AliceBrown",
                    postTime: "2024-07-28T16:30:00Z",
                    content: "Absolutely! This is just the beginning.",
                    bull: ["user_13"],
                    bear: ["MikeJohnson"],
                    share: ["user_14"]
                  }
                ]
              }
            ]
        }          
    ]

    res.json(resp)
}

exports.bull_id = async(req, res, next) =>{
    let resp = [
        {
            id: "post_12345",
            profile_id: "pn_v1",
            userAvatar: "https://example.com/avatar.jpg",
            userName: "JohnDoe",
            postTime: "2024-07-28T14:30:00Z",
            content: "Excited to share the latest updates on DigiTrust!",
            bull: ["JaneSmith", "MikeJohnson", "AliceBrown"],
            bear: ["DavidGreen", "EvaWhite"],
            share: ["TomBlack", "NinaBlue"],
            listComment: [
              {
                id: "comment_1",
                profile_id: "pn_v1",
                userAvatar: "https://example.com/commenter1.jpg",
                userName: "JaneSmith",
                postTime: "2024-07-28T15:00:00Z",
                content: "Great update, looking forward to more!",
                bull: ["JohnDoe", "MikeJohnson"],
                bear: [],
                share: ["AliceBrown"],
                listComment: []
              },
              {
                id: "comment_2",
                profile_id: "pn_v1",
                userAvatar: "https://example.com/commenter2.jpg",
                userName: "MikeJohnson",
                postTime: "2024-07-28T16:00:00Z",
                content: "Can't wait to see how this evolves.",
                bull: ["JaneSmith"],
                bear: [],
                share: [],
                listComment: [
                  {
                    id: "reply_1",
                    profile_id: "pn_v1",
                    userAvatar: "https://example.com/replier1.jpg",
                    userName: "AliceBrown",
                    postTime: "2024-07-28T16:30:00Z",
                    content: "Absolutely! This is just the beginning.",
                    bull: ["JohnDoe"],
                    bear: [],
                    share: []
                  }
                ]
              }
            ]
        }          
    ]

    res.json(resp)
}

exports.add_comment = async(req, res, next) =>{
    let resp = [
        {
            id: "post_12345",
            profile_id: "pn_v1",
            userAvatar: "https://example.com/avatar.jpg",
            userName: "JohnDoe",
            postTime: "2024-07-28T14:30:00Z",
            content: "Excited to share the latest updates on DigiTrust!",
            bull: ["user_1", "user_2", "user_3"],
            bear: ["user_4", "user_5"],
            share: ["user_6", "user_7"],
            listComment: [
                {
                    idComment: "comment_1",
                    mainComment: "Great update, looking forward to more!",
                    userName: "JaneSmith",
                },
                {
                    idComment: "comment_2",
                    mainComment: "Can't wait to see how this evolves.",
                    userName: "MikeJohnson",
                }
            ]
        }        
    ]

    res.json(resp)
}

exports.add_post = async(req, res, next) =>{
    let resp = [
        {
            id:"1",
            profile_id:"pn_v1",
            userAvatar: "https://placehold.co/40x40",
            userName: "@alvinichi",
            postTime: "6h",
            content: "Bitcoin start invest time",
            bull: ["nhatlapross@gmail.com","nhatlapross1@gmail.com","nhatlapross2@gmail.com"],
            bear: ["nhatlapross@gmail.com"],
            share:["nhatlapross@gmail.com","nhatlapross1@gmail.com","nhatlapross2@gmail.com"],
            listComment:[
                {
                    idComment:"1",
                    mainComment:"Hello world",
		    userName:"nhatlapross",
                    listReply:[
                        {
                            idReply:"1",
		            userName:"nhatlapross2",
                            mainReply:"Hi World"
                        }
                    ]
                },
                {
                    idComment:"2",
		    userName:"nhatlapross2",
                    mainComment:"I'm here",
                    listReply:[
                    ]
                }
            ]
        },
        {
            id:"2",
            profile_id:"pn_v1",
            userAvatar: "https://placehold.co/40x40",
            userName: "@marsivi",
            postTime: "2h",
            content: "Bitcoin ETH awsome",
            bull: ["nhatlapross@gmail.com","nhatlapross1@gmail.com","nhatlapross2@gmail.com"],
            bear: ["nhatlapross@gmail.com"],
            share:["nhatlapross@gmail.com","nhatlapross1@gmail.com","nhatlapross2@gmail.com"],
            listComment:[
                {
                    idComment:"1",
		    userName:"nhatlapross2",
                    mainComment:"Great",
                    listReply:[
                        {
                            idReply:"1",
		            userName:"nhatlapross2",
                            mainReply:"Good Job!"
                        },
                        {
                            idReply:"2",
		            userName:"nhatlapross3",
                            mainReply:"That's good!"
                        },
                    ]
                }
            ]
        },
    ]

    res.json(resp)
}

exports.update_asset_structure = async(req, res, next) =>{
    // const { profileId } = req.params;
    const { profile_id, asset_id, amount, asset_type } = req.body;

    // res.status(200).send(
    //     { 
    //         message: 'Asset structure updated successfully',
    //         profile_id: profileId 
    //     }
    // );

    try {
        // Find the user profile by user_id
        const userProfile = await Profile.findOne({ profile_id: profile_id });
        if (!userProfile) {
            return res.status(404).send({ message: 'User profile not found' });
        }

        // Find the asset in the user's asset portfolio
        const asset = userProfile.asset_portfolio.find(a => a.asset_id === asset_id);

        if (asset) {
            // Update existing asset
            asset.amount = amount;
            asset.asset_type = asset_type;
        } else {
            // Add new asset
            userProfile.asset_portfolio.push({ asset_id, amount, asset_type });
        }

        // Save the updated user profile
        await userProfile.save();

        res.status(200).send({ message: 'Asset structure updated successfully', profile: userProfile });
    } catch (error) {
        console.error("Error updating asset structure:", error);
        res.status(500).send({ message: 'Error updating asset structure', error });
    }
}

exports.list_vault = async(req, res, next) =>{
    const vaults = await vault.list_vault()

    res.json(vaults)
}

exports.information = async (req, res, next) => {
    try {
        let profile_id = req.query.profile_id
        const profile = await Profile.findOne({ profile_id: profile_id });
        
        const vault_detail = await vault.portfolio_structure()

        res.json(vault_detail);
    } catch (error) {
        console.log("Error to get user profile: ", error)
        next(error);
    }
};

exports.public_signal = async(req, res, next) =>{
    const public_signal = {
        "name":"FinX",
        "amount":2411,
        "type": "Holding",
        "timestamp":2424,
        "chain":"EVM"
    }

    res.json({
        code: 0,
        data: public_signal
    })
}

exports.members = async(req, res, next) =>{
    const members = [{
        "name":"PQD",
        "lp_amount":2411,
        "created_at":2024,
        "risk_guard":6
    }]

    res.json({
        code: 0, 
        data: members
    })
}

exports.signal_fee = async(req, res, next) =>{
    const signal_fee = {
        "amount":2411,
        "leverage":6,
        "start_at":24,
        "end_at":2411
    }

    res.json({
        code: 0,
        data: signal_fee
    })
}

exports.signal_provider = async(req,res, next) =>{
    const signal_provider = {
        "provider_adr": "0x123msdf",
        "amount":2411,
    }

    res.json({
        code: 0,
        data: signal_provider
    })
}

exports.vault_allocation = async(req, res, next)=>{
    let vault_req = {
        chain: req.query.chain, 
        pool: req.query.pool  
    }
    const vault_allocation = await vault.portfolio_structure(vault_req)
    console.log("Allocation: ", vault_allocation)

    res.json(vault_allocation)
}

exports.list_token = async(req, res, next) =>{
    let resp = await  axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
        headers: {
          'X-CMC_PRO_API_KEY': 'c7bdec82-4291-460b-b7f1-b3dfacffc5ca',
        },
    });

    let list_token = resp.data.data
    let tokens = []
    for(let i = 0; i < list_token.length; i++){
        let token_id = list_token[i].id
        let token_info = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id='+token_id, {
            headers: {
              'X-CMC_PRO_API_KEY': 'c7bdec82-4291-460b-b7f1-b3dfacffc5ca',
            },
        });
        // console.log("Token info: ", token_info.data)
        let token = {
            "id": list_token[i].id,
            "name": list_token[i].name,
            "symbol": list_token[i].symbol,
            "price": list_token[i].quote.USD.price,
            "logo_url":token_info.data.data[token_id].logo
        }
        tokens.push(token)
        if( i > 9){
            break
        }
    }

    res.json(tokens)
}

exports.create_vault = async(req, res, next) =>{
    const profile_req = {
        profile_id: req.body.profile_id || "unique_profile_id_here",
        username: req.body.username || "user_username_here",
        management_fee: req.body.management_fee || "0.3",
        email: req.body.email || "user_email_here",
        bio: req.body.bio || "user_bio_here",
        profile_picture_url: req.body.profile_picture_url || "profile_picture_url_here",
        wallet_address: req.body.wallet_address || "wallet_address_here",
        asset_portfolio: req.body.asset_portfolio || [
          {
            asset_id: "asset_id_here",
            amount: 0,
            asset_type: "asset_type_here"
          }
          // Additional assets can be added in the same format
        ],
        transaction_history: req.body.transaction_history || [
          {
            transaction_id: "transaction_id_here",
            date: "transaction_date_here",
            transaction_type: "transaction_type_here",
            status: "transaction_status_here"
          }
          // Additional transactions can be added in the same format
        ],
        followers: req.body.followers || [
          {
            name: "follower_name_here"
          }
          // Additional followers can be added in the same format
        ],
        following: req.body.following || [
          {
            name: "following_name_here"
          }
          // Additional following can be added in the same format
        ],
        created_at: req.body.created_at || "timestamp_created_here",
        updated_at: req.body.updated_at || "timestamp_updated_here"
    };

    let profile = new Profile(profile_req)

    let resp = profile.save((err, doc) =>{
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            success: true,
            profile: doc
        });
    })

//     res.json({
//         profile_id: req.body.profile_id || "unique_profile_id_here",
//         username: req.body.username || "user_username_here",
//         success: true
//     })
}

exports.top_holders = async(req, res, next) =>{
    const chain = req.query.chain

    if(chain == "ICP"){
        res.json(
            {
                "topHolders": [
                  {
                    "address": "0xa1b2c3d4e5f678901234567890abcdef12345678",
                    "amount": 4500,
                    "percentage": 45
                  },
                  {
                    "address": "0xabcdef1234567890fedcba098765432112345678",
                    "amount": 3000,
                    "percentage": 30
                  },
                  {
                    "address": "0x1234567890abcdef1234567890abcdef98765432",
                    "amount": 2500,
                    "percentage": 25
                  }
                ],
                "token": "ICP"
              }              
        )
    }else{
        res.json(
            {
                "topHolders": [
                  {
                    "address": "0xfeed1234deadbeef5678abcd1234ef5678abcd90",
                    "amount": 5000,
                    "percentage": 50
                  },
                  {
                    "address": "0xdeadbeef56781234feedabcd5678ef1234abcd90",
                    "amount": 3000,
                    "percentage": 30
                  },
                  {
                    "address": "0xabcd1234ef5678abcd5678feed1234deadbeef90",
                    "amount": 2000,
                    "percentage": 20
                  }
                ],
                "token": "SUI"
            }          
        )
    }
}