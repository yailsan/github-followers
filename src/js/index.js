import search from './search';

import 'bootstrap/dist/css/bootstrap.css';
import '../css/styles.css';


search.init({
  input: '#search',
  previewContainer: '.search-preview',
  searchResultContainer: '.search-results'
});
