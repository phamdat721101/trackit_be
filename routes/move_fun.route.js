const express = require('express');
const router =express.Router();
const moveFunCtrl = require('../controllers/move_fun.controller');

/*---Token Balance--*/
router.route('/list').get(moveFunCtrl.move_fun_list)
router.route('/info').get(moveFunCtrl.token_info)

module.exports = router