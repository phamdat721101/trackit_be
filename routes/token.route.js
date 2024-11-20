const express = require('express');
const router =express.Router();
const tokenCtrl = require('../controllers/token.controller');

/*---Token Balance--*/
// router.route('/price').get(tokenCtrl.get_xau_price)
// router.route('/txs').get(tokenCtrl.get_tx_by_addr)
router.route('/info').get(tokenCtrl.token_info)

module.exports = router