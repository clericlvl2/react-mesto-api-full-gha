const DEFAULT_USER = {
  name: 'Жак-Ив Кусто',
  about: 'Исследователь',
  avatar: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
};

const HTTP_ERROR = {
  VALIDATION: {
    name: 'ValidationError',
    status: 400,
  },
  UNAUTHORIZED: {
    name: 'UnauthorizedError',
    status: 401,
  },
  FORBIDDEN: {
    name: 'ForbiddenError',
    status: 403,
  },
  NOT_FOUND: {
    name: 'NotFoundError',
    status: 404,
  },
  CONFLICT: {
    name: 'ConflictError',
    status: 409,
  },
  SERVER: {
    name: 'HttpError',
    status: 500,
  },
};

const MONGOOSE_ERROR = {
  VALIDATION: {
    name: 'ValidationError',
  },
  CAST: {
    name: 'CastError',
  },
};

const ERROR_MESSAGE = {
  users: {
    notFoundById: 'Пользователь по указанному ID не найден.',
    invalidDataOnCreateUser:
      'Переданы некорректные данные при создании пользователя.',
    invalidDataOnUpdateInfo:
      'Переданы некорректные данные при обновлении профиля.',
    invalidDataOnUpdateAvatar:
      'Переданы некорректные данные при обновлении аватара.',
    invalidEmailOrPassword: 'Неправильные почта или пароль.',
    invalidEmailOnSignUp: 'Пользователь с такой почтой уже существует',
    invalidAvatarUrl: 'Ссылка на аватар указана не верно',
    invalidEmail: 'Почта указана не верно',
  },
  cards: {
    notFoundById: 'Карточка с указанным ID не найдена.',
    invalidDataOnCreateCard:
      'Переданы некорректные данные при создании карточки.',
    invalidDataOnToggleLike:
      'Переданы некорректные данные при постановке/снятии лайка.',
    invalidIdOnToggleLike: 'Передан несуществующий ID карточки.',
    accessToCardIsForbidden: 'Попытка удалить чужую карточку',

  },
  invalidPasswordOrLogin: 'Неправильные почта или пароль',
  rejectUnauthorized: 'Необходима авторизация',
  unmatchedRoute: 'Адрес запроса указан неверно.',
  default: 'На сервере произошла ошибка.',
};

module.exports = {
  DEFAULT_USER,
  HTTP_ERROR,
  MONGOOSE_ERROR,
  ERROR_MESSAGE,
};
