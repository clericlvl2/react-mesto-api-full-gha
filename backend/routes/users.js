const router = require('express').Router();

const {
  validateUserInfo,
  validateUserAvatar,
  validateUserId,
} = require('../utils/validators/users');

const {
  getUsers,
  getUserById,
  updateUserAvatar,
  updateUserInfo,
  getOwnUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.route('/me')
  .get(getOwnUser)
  .patch(validateUserInfo, updateUserInfo);
router.patch('/me/avatar', validateUserAvatar, updateUserAvatar);
router.get('/:id', validateUserId, getUserById);

module.exports = router;
