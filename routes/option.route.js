const express = require('express');
const router =express.Router();
const optionCtrl = require('../controllers/option.controller');

/*---Token Balance--*/
router.route('/').get(optionCtrl.getSidebarOptions)

module.exports = router