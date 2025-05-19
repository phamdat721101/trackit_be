const axios = require('axios');
const { AmmPoolManager } = require('@flowx-finance/sdk');

/**
 * Format a raw pool from FlowX SDK into your valid pool structure
 */
function formatRawPool(raw) {
  const [c0, c1] = raw.coins;
  const [r0str, r1str] = raw.reserves;
  // Derive symbol & name from coinType suffix
  const suffix0 = c0.coinType.split('::').pop();
  const suffix1 = c1.coinType.split('::').pop();
  const token0 = {
    id: c0.coinType,
    name: suffix0.charAt(0) + suffix0.slice(1).toLowerCase(),
    symbol: suffix0,
    decimals: c0.decimals,
    logoURI: ''
  };
  const token1 = {
    id: c1.coinType,
    name: suffix1.charAt(0) + suffix1.slice(1).toLowerCase(),
    symbol: suffix1,
    decimals: c1.decimals,
    logoURI: ''
  };
  // Convert reserves from string to decimal values
  const reserve0 = parseFloat((Number(r0str) / Math.pow(10, c0.decimals)).toFixed(c0.decimals));
  const reserve1 = parseFloat((Number(r1str) / Math.pow(10, c1.decimals)).toFixed(c1.decimals));
  const tvl = parseFloat(Number(raw.stats.totalLiquidityInUSD).toFixed(2));
  const now = new Date().toISOString();

  return {
    pool: {
      _id: raw.id,
      name: `${token0.symbol} ↔ ${token1.symbol}`,
      symbol: `${token0.symbol}/${token1.symbol}`,
      address: raw.id,
      apr: parseFloat(
        (
          Number(raw.stats.combinedApr.lpRewardsApr) +
          Number(raw.stats.combinedApr.farmApr)
        ).toFixed(2)
      ),
      stable: false,
      tvl,
      totalSupply: parseFloat(raw.liquiditySupply),
      reserve0,
      reserve1,
      token0Address: token0.id,
      wrapToken0Address: token0.id,
      token0,
      token1Address: token1.id,
      wrapToken1Address: token1.id,
      token1,
      createdAt: now,
      updatedAt: now,
      __v: 0
    },
    staked0: reserve0,
    staked1: reserve1
  };
}

/**
 * GET /list_pool
 * Returns pools formatted to the valid structure
 */
exports.list_pool = async (req, res, next) => {
  try {
    const chain = req.query.chain || 'aptos';
    const dex = req.query.dex || 'cellana';
    const offset = parseInt(req.query.offset, 10) || 1;
    const limit  = parseInt(req.query.limit, 10)  || 3;

    // fetch from external API instead of SDK
    const apiUrl = process.env.POOL_API_URL
      || 'https://api.flowx.finance/flowx-be/api/explore-stats/top-pools';

    const response = await axios.get(apiUrl);
    // Handle both top‐level arrays and nested .data arrays
    const rawPools = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.data)
            ? response.data.data
            : [];
    
    // hydrate from coinX / coinY. reserves default to ["0","0"] since API no longer returns them
    const normalized = rawPools.map(p => ({
      ...p,
      coins: [
        { coinType: p.coinX.coinType, decimals: p.coinX.decimals },
        { coinType: p.coinY.coinType, decimals: p.coinY.decimals }
      ],
      reserves: ['0', '0']
    }));        

    // slice pagination
    const sliceStart = (offset - 1) * limit;
    const sliceEnd   = sliceStart + limit;
    const selected   = normalized.slice(sliceStart, sliceEnd);

    // transform each raw pool
    const formatted = selected
      .map(raw => {
        return formatRawPool(raw);
      })
      .filter(p => p !== null);

    res.json(formatted);
  } catch (err) {
    console.error('Error listing pools:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.yield_info = async (req, res, next) => {
  res.json('PQD');
};
