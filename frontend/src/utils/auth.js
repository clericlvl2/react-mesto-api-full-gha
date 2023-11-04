import {request} from './helpers';

export const register = (email, password) =>
  request('/signup', {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password}),
  });

export const login = (email, password) =>
  request('/signin', {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password}),
  });

export const logout = () =>
  request('/signout', {
    method: 'DELETE',
    credentials: 'include',
  });
