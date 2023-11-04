const router = require('express').Router();

const { validateUser } = require('../utils/validators/users');
const { validateLogin } = require('../utils/validators/auth');
const { login, logout } = require('../controllers/login');
const { createUser } = require('../controllers/users');

router.post('/signup', validateUser, createUser);
router.post('/signin', validateLogin, login);
router.delete('/signout', logout);

module.exports = router;
