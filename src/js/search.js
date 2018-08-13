import _debounce from 'lodash/debounce';
import DOMPurify from 'dompurify';
import { searchUsers, getProfile } from './githubService';


export default {

  init (options) {
    this.searchInput = document.querySelector(options.input);
    this.list = document.querySelector(options.previewContainer);
    this.searchResultContainer = document.querySelector(options.searchResultContainer);
    this.username = '';

    this.search = this.search.bind(this);
    this.showUser = this.showUser.bind(this);

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

    for (let i = 0; i < 5; i += 1) {
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

  showUser (event) {
    const target = event.target || event.srcElement;

    if (target.tagName.toLowerCase() === 'li' || target.tagName.toLowerCase() === 'p' || target.tagName.toLowerCase() === 'figure') {
      getProfile(this.username).then(([user, followers]) => {
        const userHTML = `
          <figure class="avatar avatar--big">
            <img src="${user.avatar_url}">
          </figure>
          <div>
            <h3 class="user-name">${user.login}</h3>
            <br>
            <h6>Followers:</h6>
            <ul class="user-followers">
              ${followers.map(follower => `<li><figure class="avatar avatar--small"><img src="${follower.avatar_url}"></figure></li>`).join('')}
            </ul>
          </div>
        `;

        this.searchResultContainer.innerHTML += DOMPurify.sanitize(userHTML);
        this.emptyList();
      });
    }
  }
};
