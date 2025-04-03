const express = require('express');
const router =express.Router();
const gameCtrl = require('../controllers/game.controller');

router.route('/save').post(gameCtrl.store_user_score)
router.route('/score').get(gameCtrl.get_top_3_daily)
router.route('/reset').get(gameCtrl.reset_daily_scores)

module.exports = router
