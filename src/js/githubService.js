import axios from 'axios';


const basePath = 'https://api.github.com/';

export const getUser = (username) => {
  return axios.get(`${basePath}users/${username}`);
};

export const getFollowers = (username, page) => {
  page = page ? `?page=${page}` : '';
  return axios.get(`${basePath}users/${username}/followers${page}`);
};

export const searchUsers = (users) => {
  return axios.get(`${basePath}search/users?q=${users}+in:%3Elogin`);
};

export const getProfile = (username) => {
  return Promise.all([getUser(username), getFollowers(username)]);
};
