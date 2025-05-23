const express = require('express');
const router =express.Router();
const tokenCtrl = require('../controllers/token.controller');

/*---Token Balance--*/
router.route('/info').get(tokenCtrl.token_info)
router.route('/txs').get(tokenCtrl.token_tx)
router.route('/list').get(tokenCtrl.list_token)
router.route('/route').get(tokenCtrl.swap_route)
router.route('/sui_route').get(tokenCtrl.sui_route)
router.route('/search').get(tokenCtrl.search)

module.exports = router