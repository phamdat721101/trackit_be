const axios = require('axios');
const { json } = require('express');

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