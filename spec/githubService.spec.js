import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getUser, getFollowers, getProfile, searchUsers } from '../src/js/githubService';

const basePath = 'https://api.github.com/';

describe('github service calls', () => {
  
  it('should return a user', (done) => {
    const mockAdapter = new MockAdapter(axios);
    const response = {
      login: 'octocat',
      followers: 2334,
      name: 'The Octocat',
      followers_url: 'https://api.github.com/users/octocat/followers',
      avatar_url: 'https://avatars3.githubusercontent.com/u/583231?v=4'
    };

    mockAdapter.onGet(`${basePath}users/octocat`).reply(200, response);

    getUser('octocat').then((user) => {
      expect(user).toEqual(response);
      done();
    });
  });

  it('should return a user\'s followers', (done) => {
    const mockAdapter = new MockAdapter(axios);
    const response = [
      {
        'login': 'myhduck',
        'avatar_url': 'https://avatars2.githubusercontent.com/u/1555350?v=4',
      },
      {
        'login': 'trevor',
        'avatar_url': 'https://avatars0.githubusercontent.com/u/5945?v=4',
      }
    ];
    const headers = {
      Link: '<https://api.github.com/resource?page=2>; rel="next", <https://api.github.com/resource?page=5>; rel="last"'
    };

    mockAdapter.onGet(`${basePath}users/octocat/followers`).reply(200, response, headers);

    getFollowers('octocat').then((followers) => {
      expect(followers).toEqual(response);
      done();
    });
  });
});
