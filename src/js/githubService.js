import axios from 'axios';


const basePath = 'https://api.github.com/';

export const getUser = (username) => {
  return axios.get(`${basePath}users/${username}`).then(user => user.data);
};

export const getFollowers = (username) => {
  return axios.get(`${basePath}users/${username}/followers`).then(user => user.data);
};

export const searchUsers = (users) => {
  return axios.get(`${basePath}search/users?q=${users}+in:%3Elogin`);
};

export const getProfile = (username) => {
  return Promise.all([getUser(username), getFollowers(username)]);
};
