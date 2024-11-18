const express = require('express');
const router =express.Router();
const vaultCtrl = require('../controllers/vault.controller');

router.route('/vaults').get(vaultCtrl.list_vault)
router.route('/vault_detail').get(vaultCtrl.information)
router.route('/vault_signal').get(vaultCtrl.public_signal)
router.route('/vault_allocation').get(vaultCtrl.vault_allocation)
router.route('/members').get(vaultCtrl.members)

router.route('/list_token').get(vaultCtrl.list_token)
router.route('/create_vault').post(vaultCtrl.create_vault)
router.route('/profile/assets').post(vaultCtrl.update_asset_structure)
router.route('/profile/post').post(vaultCtrl.add_post)
router.route('/profile/comment').post(vaultCtrl.add_comment)
router.route('/profile/share').post(vaultCtrl.share_profile)
router.route('/profile/bear').post(vaultCtrl.bear_id)
router.route('/profile/bull').post(vaultCtrl.bull_id)

router.route('/top_holders').get(vaultCtrl.top_holders)

module.exports = router