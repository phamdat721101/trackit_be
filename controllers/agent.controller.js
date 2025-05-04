const axios = require('axios');
const { json } = require('express');
const OpenAI = require('openai')
const { Ed25519Keypair } = require("@mysten/sui/keypairs/ed25519");
const { getFullnodeUrl, SuiClient } = require('@mysten/sui/client');
const { Transaction } = require('@mysten/sui/transactions');
require('dotenv').config();

// Replace with your actual private key in base64 format
const mnemonic = process.env.NEXT_PUBLIC_MNM || '';

const keypair = Ed25519Keypair.deriveKeypair(mnemonic);

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

exports.chat = async(req, res, next) =>{    
    if(req.body.content == "invest for me"){
        const tx = new Transaction();
        const package = "0x5dda419f3a10a6d0f8add4008e0445210a35fcdfafb2fff99793a1790d83651a"
        const address = keypair.getPublicKey().toSuiAddress();
        tx.setSender(address);

        // 1. Split your gas coin into smaller coins
        const gasCoin = tx.gas;
        const splitCoin = tx.splitCoins(gasCoin, [10000000]);

        // Example: calling a contract function
        tx.moveCall({
        target: `${package}::fundx::contribute`, // package ID, module, function
        arguments: [
            tx.object("0xb9ccb3ec2acb0629fbb5a0dc32e4d8c3b3ccc6e444901960640564e2d9376977"),
            splitCoin,
            tx.pure.u64(100000),
            tx.object('0x6')
        ],
        typeArguments: [], // if your Move function needs type arguments, add here
        });
    
        const { bytes, signature } = await tx.sign({ client, signer: keypair });
    
        const result = await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
            showEffects: true,
        },
        requestType: 'WaitForLocalExecution',
        });
    
        console.log('Move Contract Call Result:', result);
        return res.json(
            `✅ Investment Successful!\n\n🔗 View your transaction: https://suiscan.xyz/testnet/tx/${result.digest}\n\nThank you for investing with us! 🚀`
        );
    }

    if(req.body.content == "sui profit token"){
        console.log("Sui profit")
        const dummyTokens = [
            { tokenName: "SUI Profit Alpha", profitPercentage: "10%", strategy: "Staking" },
            { tokenName: "SUI Profit Beta", profitPercentage: "12%", strategy: "Yield Farming" },
            { tokenName: "SUI Profit Gamma", profitPercentage: "15%", strategy: "Liquid Staking" },
            { tokenName: "SUI Profit Delta", profitPercentage: "8%", strategy: "Automated Optimization" }
        ];
        return res.json(JSON.stringify(dummyTokens));
    }else if(req.body.content == "yield info"){
        return res.json("Optimizing yield on Aptos involves several strategies that leverage the blockchain's staking and DeFi ecosystem. Here are some key methods to consider:\n\n1. **Staking**:\n   - **Direct Staking**: You can earn yield by staking your APT tokens directly with a validator. This supports the Aptos blockchain's consensus process, and in return, you accrue rewards as compound interest on your staked amount. The reward rate can vary, but it typically starts around 7% annually and decreases over time [1,11].\n   - **Liquid Staking**: Platforms like Tortuga offer liquid staking, where you stake APT and receive tAPT tokens in return. These tAPT tokens can be used in various DeFi activities while still earning staking rewards. This approach allows you to maintain liquidity while earning yield [2,12].\n\n2. **Yield Farming and DeFi Strategies**:\n   - **Leveraged Yield Farming**: By using platforms like Aries Markets, you can lend tAPT tokens, borrow APT, and then restake the borrowed APT. This loop can be repeated to amplify your staking yield, potentially reaching up to 19-20% APY. However, this strategy comes with risks, including liquidation risk if the value of your collateral drops significantly [2,12].\n   - **Yield Aggregators**: Platforms like Satay Finance offer curated vault strategies that optimize yields by interacting with multiple DeFi protocols. These aggregators use algorithms to move funds across different pools to maximize returns [6].\n\n3. **Automated Yield Optimization**:\n   - **Automated Bots**: Some protocols, like Eternal Finance, provide automated bots that optimize yield farming strategies on Aptos. These bots can help manage and optimize your yield farming experience by automatically adjusting strategies based on market conditions [0].\n\n4. **Risk Management**:\n   - **Diversification**: Diversify your staking and yield farming activities across multiple platforms and strategies to mitigate risks.\n   - **Monitoring**: Regularly monitor your staking pools and DeFi positions to ensure they remain active and profitable.\n\nBy combining these strategies, you can optimize your yield on Aptos while managing risks effectively. Always conduct thorough research and consider the potential risks before engaging in any yield optimization strategies.")
    }else if(req.body.content.includes("sui market news")){
        return res.json("🚀 **SUI Market Update – May 4, 2025** 🚀\n \n📈 **Live Price:** $3.29 - $3.35 (24h -1.86% to -4.63%)\n \n💧 **TVL:** Not directly available in provided data, but Sui DeFi ecosystem continues to develop.\n \n🔄 **DEX Volume:** $958M - $1.42B (24h - likely decreased based on overall volume trend)\n \n📊 **Technical Outlook:** Price has seen a recent decrease after previous gains. Monitoring for support levels.\n \n🌐 **Key Developments:** Integration with sBTC and Stacks for BTC DeFi, 21Shares files for spot Sui ETF.\n \n💡 **Near-Term Focus:** Market reaction to new integrations and ETF news.\n \n⏳ **Derivatives OI:** $1.51B (as of previous update, current data not specified in provided info)\n \n💬 Stay tuned for more updates!");
    }else if (req.body.content === "how to invest 10 sui") {
       // 10 SUI split across FlowX pools
        const portfolio = [
            { name: "COIN/EGG",    amount: 5, apr: 0.30, pct: 50 },
            { name: "FUD/BLUB",    amount: 3, apr: 0.30, pct: 30 },
            { name: "SUI/TURBO",   amount: 2, apr: 0.30, pct: 20 },
        ];

        // Build the details lines
        const details = portfolio
            .map(
            (p) =>
                `• ${p.name}: ${p.amount} SUI  (APR: ${(p.apr * 100).toFixed(2)}%)`
            )
            .join("\n");

        // Build ASCII bar chart (10 chars wide)
        const chart = portfolio
            .map(
            (p) =>
                `${p.name.padEnd(16)} | ${"▇".repeat(p.pct / 10).padEnd(10)} | ${p.pct}%`
            )
            .join("\n");

        // Compute total expected monthly yield
        const monthlyYield = portfolio
            .reduce((sum, p) => sum + (p.amount * p.apr) / 12, 0)
            .toFixed(3);

        // Return the complete string
        const output = [
            "📊 *Simulated Portfolio Allocation for 10 SUI on FlowX* 📊",
            "",
            details,
            "",
            "```",
            chart,
            "```",
            "",
            `💡 *Est. Monthly Yield:* ${monthlyYield} SUI`,
            "",
            "Thank you for investing with us! 🚀",
        ].join("\n");

        return res.json(output);
    }else{
        return res.json("Hi, how can I help you?")
    }    
}

exports.token_predict = async(req, res, next) =>{
    let name = req.body.name;
    let symbol = req.body.symbol;
    
    let resp = {
        "_id": "6761c34ca466311725866a18",
        "coin": `0xf22da9a24ad027cccb5f2d496cbe91de953d363513db08a3a734d361c7c17503::${name}::${symbol}`,
        "lastUpdated": 1738601929608,
        "buyTrades": 600,
        "sellTrades": 600,
        "firstTradeTime": 1738591735027,
        "lastTradeTime": 1738601918708,
        "currentVolumeWeightedAveragePrice": 0.0784016,
        "currentShortTermMovingAveragePrice": 0.0707715,
        "currentLongTermMovingAveragePrice": 0.0668587,
        "currentMovingAveragePriceAnalysis": `The current price of ${name} is significantly above both short-term and long-term moving averages, indicating a strong upward momentum.`,
        "currentPriceLow": 0.05125,
        "currentPriceHigh": 0.080978,
        "expectedPriceHighInNext24Hours": 0.0815,
        "expectedPriceLowInNext24Hours": 0.077,
        "expectedPriceTrends": [
            "Bullish sentiment likely to continue given recent buying activity and price increases.",
            "If buying volume increases sharply, we could see prices spike potentially hitting above $0.081000 with a probability of 75%.",
            "If selling volume surges unexpectedly, we might see a retracement back to $0.0770 with a probability of 20%.",
            "If buying pressure stabilizes but at lower volumes, we might see price hover around the $0.0780 mark with a probability of 5%."
        ],
        "likelyAveragePriceInNext24Hours": 0.07875,
        "totalUniqueUsers": 327,
        "coinMetadata": {
            "_id": "67410fd8a4d7aaf4df9b46ec",
            "coinType": `0xf22da9a24ad027cccb5f2d496cbe91de953d363513db08a3a734d361c7c17503::${name}::${symbol}`,
            "decimals": 9,
            "description": "Lofi is everyone's favorite Yeti on Sui",
            "iconUrl": "https://i.ibb.co/fM8QZXh/LOFI-PFP.png",
            "id": "0x57a2bf5e6887eca522fe6c3ff0d9d8dc116d072998a477c6c24fe6603107ebb8",
            "name": name,
            "symbol": symbol
        },
        "coinPrice": 0.09200514799855197
    }
    res.json(resp)
}