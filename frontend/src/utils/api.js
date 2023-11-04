import {API_ERROR_CONFIG, BASE_URL} from './constants';

class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _handleResponse(res, errorMessage = API_ERROR_CONFIG.defaultError) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка ${res.status}: ${errorMessage}.`);
  }

  getUserData() {
    return fetch(`${this._baseUrl}/users/me`, {
      credentials: 'include',
      headers: this._headers,
    }).then(res => {
      return this._handleResponse(res, API_ERROR_CONFIG.getUserError);
    });
  }

  updateUserInfo(data) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(res => {
      return this._handleResponse(res, API_ERROR_CONFIG.updateUserError);
    });
  }

  updateUserAvatar(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(res => {
      return this._handleResponse(res, API_ERROR_CONFIG.updateUserError);
    });
  }

  getAllCards() {
    return fetch(`${this._baseUrl}/cards`, {
      credentials: 'include',
      headers: this._headers,
    }).then(res => {
      return this._handleResponse(res, API_ERROR_CONFIG.getCardsError);
    });
  }

  addNewCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(res => {
      return this._handleResponse(res, API_ERROR_CONFIG.addCardError);
    });
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this._headers,
    }).then(res => {
      return this._handleResponse(res, API_ERROR_CONFIG.deleteCardError);
    });
  }

  setCardLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
      credentials: 'include',
      headers: this._headers,
    }).then(res => {
      return this._handleResponse(res, API_ERROR_CONFIG.likeCardError);
    });
  }

  unsetCardLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this._headers,
    }).then(res => {
      return this._handleResponse(res, API_ERROR_CONFIG.likeCardError);
    });
  }

  initializeAppData() {
    return Promise.all([this.getUserData(), this.getAllCards()]);
  }
}

const api = new Api({
  baseUrl: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
