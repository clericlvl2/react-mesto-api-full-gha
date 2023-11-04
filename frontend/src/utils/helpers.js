import {BASE_URL} from './constants';

export const handleResponse = res => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка ${res.status}`);
};

export const request = (endpoint, options) =>
  fetch(BASE_URL + endpoint, options).then(handleResponse);
