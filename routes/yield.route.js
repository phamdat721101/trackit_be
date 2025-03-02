const express = require('express');
const router =express.Router();
const yieldCtrl = require('../controllers/yield.contronller');

/*---Token Balance--*/
router.route('/info').get(yieldCtrl.yield_info)
router.route('/pools').get(yieldCtrl.list_pool)

module.exports = router