import _debounce from 'lodash/debounce';
import DOMPurify from 'dompurify';
import { searchUsers, getProfile, getFollowers } from './githubService';


export default {

  init (options) {
    this.searchInput = document.querySelector(options.input);
    this.list = document.querySelector(options.previewContainer);
    this.searchResultContainer = document.querySelector(options.searchResultContainer);
    this.username = '';
    this.followersPage = 1;

    this.search = this.search.bind(this);
    this.showUser = this.showUser.bind(this);
    this.loadMoreFollowers = this.loadMoreFollowers.bind(this);

    this.bindEvents();
  },

  bindEvents () {
    this.searchInput.addEventListener('keyup', _debounce(this.search, 250), false);
    this.list.addEventListener('click', this.showUser, false);
  },

  emptyList () {
    this.list.innerHTML = '';
  },

  noUserFound () {
    this.list.innerHTML = '<li class="list-group-item">No user found</li>';
  },

  showPreview (users) {
    let items = '';
    let usersToPreview = users.length > 5 ? 5 : users.length;

    for (let i = 0; i < usersToPreview; i += 1) {
      items += `
        <li class="list-group-item">
          <figure class="avatar avatar--mid"><img src="${users[i].avatar_url}" /></figure>
          <p>${users[i].login}</p>
        </li>
      `;
    }

    this.list.innerHTML = DOMPurify.sanitize(items);
  },

  search (event) {
    const inputText = event.target.value;
    
    if (inputText === '') {
      this.emptyList();
      return;
    }

    this.username = inputText;
    searchUsers(inputText)
      .then(users => {
        this.showPreview(users.data.items);
      })
      .catch(err => {
        this.noUserFound();
      }); 
  },

  loadMoreFollowers () {
    if (this.followersPage < this.followersLimitPage) {
      this.followersPage += 1;
      
      getFollowers(this.username, this.followersPage)
        .then(followers => {
          const userFollowersContainer = document.querySelector('.user-followers');

          if (userFollowersContainer) {
            userFollowersContainer.innerHTML += DOMPurify.sanitize(followers.data.map(follower => `<li><figure class="avatar avatar--small"><img src="${follower.avatar_url}"></figure></li>`).join(''));
          }

          if (this.followersPage === this.followersLimitPage) {
            this.loadMoreBtn.style.display = 'none';
          }
        });
    }
  },

  loadMoreButton (followers) {
    const headersLink = followers.headers.link;
    this.followersLimitPage = headersLink ? +headersLink.split(',')[1].match(/\?page=(\d+)/)[1] : 1;

    const button = '<button class="btn btn-primary">Load more followers</button>';

    if (headersLink) {
      this.searchResultContainer.querySelector('div').innerHTML += button;
      this.loadMoreBtn = this.searchResultContainer.querySelector('button');
      if (this.loadMoreBtn) {
        this.loadMoreBtn.removeEventListener('click', this.loadMoreFollowers);
      }
      this.loadMoreBtn.addEventListener('click', this.loadMoreFollowers, false);
    }
  },

  showUser (event) {
    const target = event.target || event.srcElement;

    if (target.tagName.toLowerCase() === 'p') {
      this.username = target.innerText;
    } else {
      this.username = target.querySelector('p').innerText;
    }

    if (target.tagName.toLowerCase() === 'li' || target.tagName.toLowerCase() === 'p' || target.tagName.toLowerCase() === 'figure') {
      getProfile(this.username).then(([user, followers]) => {
        const userHTML = `
          <figure class="avatar avatar--big">
            <img src="${user.data.avatar_url}">
          </figure>
          <div>
            <h3 class="user-name">${user.data.login}</h3>
            <br>
            <h6>Followers (${user.data.followers}):</h6>
            <ul class="user-followers">
              ${followers.data.map(follower => `<li><figure class="avatar avatar--small"><img src="${follower.avatar_url}"></figure></li>`).join('')}
            </ul>
          </div>
        `;

        this.searchResultContainer.innerHTML = DOMPurify.sanitize(userHTML);
        this.loadMoreButton(followers);
        this.emptyList();
      });
    }
  }
};
