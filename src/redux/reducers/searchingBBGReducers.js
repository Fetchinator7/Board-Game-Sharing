import { combineReducers } from 'redux';

// Get the results from BGG before they're formatted for displaying in search results.
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

// The formatted games from the search results.
const formattedGamesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_FORMATTED_SEARCH_GAMES':
      return [...state, ...action.payload];
    case 'RESET_FORMATTED_SEARCH_GAMES':
      return [];
    default:
      return state;
  }
};

// An array to show just the titles fo games for game search results.
const titlesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_SEARCH_TITLES':
      return action.payload;
    case 'RESET_SEARCH_TITLES':
      return [];
    default:
      return state;
  }
};

// String of the current game to search for.
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

// Error if no game was found.
const noGameFoundError = (state = '', action) => {
  switch (action.type) {
    case 'SET_GAME_SEARCH__GAME_NOT_FOUND':
      return action.payload;
    case 'RESET_GAME_SEARCH__GAME_NOT_FOUND':
      return '';
    default:
      return state;
  }
};

export default combineReducers({
  rawGameSearchResults: gamesReducer,
  formattedGameSearchResults: formattedGamesReducer,
  searchTitles: titlesReducer,
  searchText: searchForGame,
  noResultsErrorText: noGameFoundError
});
