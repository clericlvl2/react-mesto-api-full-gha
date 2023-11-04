const Card = require('../models/card');
const { ERROR_MESSAGE } = require('../utils/constants');
const { MODEL_UPDATE_OPTIONS, CARDS_LIMIT } = require('./constants');
const { ForbiddenError } = require('../utils/errors');
const {
  responseHandler,
  errorHandler,
  checkDataForNull,
} = require('../utils/helpers');

const {
  notFoundById,
  invalidDataOnToggleLike,
  invalidIdOnToggleLike,
  invalidDataOnCreateCard,
  accessToCardIsForbidden,
} = ERROR_MESSAGE.cards;

const getCards = (req, res, next) => {
  Card.find({}).sort({ createdAt: -1 }).limit(CARDS_LIMIT)
    .populate(['owner', 'likes'])
    .then(responseHandler(res))
    .catch(errorHandler(next));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(card => Card.populate(card, 'owner'))
    .then(responseHandler(res))
    .catch(errorHandler(next, invalidDataOnCreateCard));
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then(checkDataForNull(notFoundById))
    .then(card => {
      const cardOwnerId = card.owner.toString();
      const userId = req.user._id;

      if (cardOwnerId !== userId) {
        return Promise.reject(new ForbiddenError(accessToCardIsForbidden));
      }

      return Card.deleteById(cardId);
    })
    .then(() => res.send({}))
    .catch(errorHandler(next, notFoundById));
};

const findCardByIdAndUpdate = ({
  res, next, id, newData,
}) => {
  Card.findByIdAndUpdate(id, newData, MODEL_UPDATE_OPTIONS)
    .populate(['owner', 'likes'])
    .then(checkDataForNull(invalidIdOnToggleLike))
    .then(responseHandler(res))
    .catch(errorHandler(next, invalidDataOnToggleLike));
};

const likeCard = (req, res, next) => findCardByIdAndUpdate({
  res,
  next,
  id: req.params.cardId,
  newData: { $addToSet: { likes: req.user._id } },
});

const dislikeCard = (req, res, next) => findCardByIdAndUpdate({
  res,
  next,
  id: req.params.cardId,
  newData: { $pull: { likes: req.user._id } },
});

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
