const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');

/*--- Store User Information ---*/
router.route('/store').post(userCtrl.store_user);

/*--- Get All Users ---*/
router.route('/all').get(userCtrl.get_all_users);

/*--- Get User by Email or Wallet ---*/
router.route('/search').get(userCtrl.get_user_by_email_or_wallet);

router.route('/auth/login').post(userCtrl.login_user);
router.route('/auth/store').post(userCtrl.store_auth);

module.exports = router;
