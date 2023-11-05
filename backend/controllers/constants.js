const SALT_ROUNDS = 10;

const CARDS_LIMIT = 30;

const MODEL_UPDATE_OPTIONS = {
  new: true,
  runValidators: true,
};

const JWT_SIGN_OPTIONS = {
  expiresIn: '7d',
};

const COOKIE_OPTIONS = {
  maxAge: 1000 * 3600 * 24 * 7,
  httpOnly: true,
  sameSite: 'None',
};

module.exports = {
  SALT_ROUNDS,
  CARDS_LIMIT,
  MODEL_UPDATE_OPTIONS,
  JWT_SIGN_OPTIONS,
  COOKIE_OPTIONS,
};
