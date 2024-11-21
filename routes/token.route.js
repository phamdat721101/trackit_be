const express = require('express');
const router =express.Router();
const tokenCtrl = require('../controllers/token.controller');

/*---Token Balance--*/
router.route('/info').get(tokenCtrl.token_info)
router.route('/txs').get(tokenCtrl.token_tx)

module.exports = router