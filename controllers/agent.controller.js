const axios = require('axios');
const { json } = require('express');

exports.chat = async(req, res, next) =>{
    // const YOUR_API_KEY = process.env.ATOMA_API_KEY;
    // const MODEL_NAME = process.env.MODEL_NAME;
    // const content = req.body.content;

    // axios.post('https://api.atoma.network/v1/chat/completions', {
    //     stream: false,
    //     model: MODEL_NAME,
    //     messages: [{
    //         role: 'assistant',
    //         content: content
    //     }],
    //     max_tokens: 124
    // }, {
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${YOUR_API_KEY}`
    //     }
    // })
    // .then(response => {
    //     console.log(response.data);
    //     res.json(response.data.choices[0].message.content)
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });

    if(req.body.content == "sui profit token"){
        const dummyTokens = [
            { tokenName: "SUI Profit Alpha", profitPercentage: "10%", strategy: "Staking" },
            { tokenName: "SUI Profit Beta", profitPercentage: "12%", strategy: "Yield Farming" },
            { tokenName: "SUI Profit Gamma", profitPercentage: "15%", strategy: "Liquid Staking" },
            { tokenName: "SUI Profit Delta", profitPercentage: "8%", strategy: "Automated Optimization" }
        ];
        return res.json(JSON.stringify(dummyTokens));
    }

    res.json("Optimizing yield on Aptos involves several strategies that leverage the blockchain's staking and DeFi ecosystem. Here are some key methods to consider:\n\n1. **Staking**:\n   - **Direct Staking**: You can earn yield by staking your APT tokens directly with a validator. This supports the Aptos blockchain's consensus process, and in return, you accrue rewards as compound interest on your staked amount. The reward rate can vary, but it typically starts around 7% annually and decreases over time [1,11].\n   - **Liquid Staking**: Platforms like Tortuga offer liquid staking, where you stake APT and receive tAPT tokens in return. These tAPT tokens can be used in various DeFi activities while still earning staking rewards. This approach allows you to maintain liquidity while earning yield [2,12].\n\n2. **Yield Farming and DeFi Strategies**:\n   - **Leveraged Yield Farming**: By using platforms like Aries Markets, you can lend tAPT tokens, borrow APT, and then restake the borrowed APT. This loop can be repeated to amplify your staking yield, potentially reaching up to 19-20% APY. However, this strategy comes with risks, including liquidation risk if the value of your collateral drops significantly [2,12].\n   - **Yield Aggregators**: Platforms like Satay Finance offer curated vault strategies that optimize yields by interacting with multiple DeFi protocols. These aggregators use algorithms to move funds across different pools to maximize returns [6].\n\n3. **Automated Yield Optimization**:\n   - **Automated Bots**: Some protocols, like Eternal Finance, provide automated bots that optimize yield farming strategies on Aptos. These bots can help manage and optimize your yield farming experience by automatically adjusting strategies based on market conditions [0].\n\n4. **Risk Management**:\n   - **Diversification**: Diversify your staking and yield farming activities across multiple platforms and strategies to mitigate risks.\n   - **Monitoring**: Regularly monitor your staking pools and DeFi positions to ensure they remain active and profitable.\n\nBy combining these strategies, you can optimize your yield on Aptos while managing risks effectively. Always conduct thorough research and consider the potential risks before engaging in any yield optimization strategies.")
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