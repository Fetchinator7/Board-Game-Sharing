import { combineReducers } from 'redux';

const gamesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_RAW_SEARCH_GAMES':
      return [].concat(...state, action.payload);
    case 'RESET_RAW_SEARCH_GAMES':
      return [];
    default:
      return state;
  }
};

const formattedGamesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_FORMATTED_SEARCH_GAMES':
      return [].concat(...state, action.payload);
    case 'RESET_FORMATTED_SEARCH_GAMES':
      return [];
    default:
      return state;
  }
};

const titlesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_SEARCH_TITLES':
      console.log('new search titles:', action.payload);
      return action.payload;
    case 'RESET_SEARCH_TITLES':
      return [];
    default:
      return state;
  }
};

const searchForGame = (state = '', action) => {
  switch (action.type) {
    case 'CURRENT_SEARCH':
      return action.payload;
    case 'RESET_CURRENT_SEARCH':
      return '';
    default:
      return state;
  }
};

export default combineReducers({
  rawGameSearchResults: gamesReducer,
  formattedGameSearchResults: formattedGamesReducer,
  searchText: searchForGame,
  searchTitles: titlesReducer
});