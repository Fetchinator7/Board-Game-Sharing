import { put, takeLatest, takeEvery, cancelled } from 'redux-saga/effects';
import Axios from 'axios';

function* searchGames(action) {
  try {
    if (action.searchType === 'games') {
      // Cap board game results at 100
      // (101 because 5 % 1 so it gos in increments of 5 after that: 6, 11, 16, ...101)
      const maxResults = 101;
      const qtyGamesPerQuery = 50;
      try {
        yield put({ type: 'SHOW_LOADING' });
        yield put({ type: 'RESET_RAW_SEARCH_GAMES' });
        yield put({ type: 'RESET_FORMATTED_SEARCH_GAMES' });
        yield put({ type: 'RESET_SEARCH_TITLES' });
        yield put({ type: 'RESET_GAME_SEARCH__GAME_NOT_FOUND' });
        yield put({ type: 'CURRENT_SEARCH', payload: action.payload });
        const response = yield Axios.get(`/api/search/keyword/${action.payload}`);
        // If there's only one result it will come in as an object, but if there's more than
        // one result it will come in as an object which automatically converts to an array.
        let boardGamesArr = response.data;
        if (boardGamesArr.length === undefined) {
          boardGamesArr = [boardGamesArr];
        }
        let idStr = '';
        for (let index = 0; index < boardGamesArr.length; index++) {
          const boardGameObj = boardGamesArr[index];
          idStr += `${boardGameObj._attributes.id},`;
          // index !== 0: Skip the first game to get a batch of 50.
          // index + 1 === boardGamesArr.length
          // if there's fewer than qtyGamesPerQuery games in the results then check to see
          // if this is the last game in that short list.
          // boardGamesArr.length === index means we hit the maximum number of results to
          // display so cut the loop off.
          // index % qtyGamesPerQuery === 0 means it's ready to query another batch of qtyGamesPerQuery.
          if (index !== 0) {
            if (index % qtyGamesPerQuery === 0 || boardGamesArr.length === index || index + 1 === boardGamesArr.length) {
              const result = yield Axios.get(`/api/search/game-id/${idStr}`);
              yield put({ type: 'SET_RAW_SEARCH_GAMES', payload: result.data });
              idStr = '';
            } else if (index % maxResults === 0) {
              index = boardGamesArr.length;
            } else if (index % boardGamesArr.length + 1 === 0) {
              const result = yield Axios.get(`/api/search/game-id/${idStr}`);
              yield put({ type: 'SET_RAW_SEARCH_GAMES', payload: result.data });
              idStr = '';
            }
          }
        }
      } catch (error) {
        yield put({ type: 'SET_GAME_SEARCH__GAME_NOT_FOUND', payload: `Error, game: "${action.payload}" not found.` });
      }
    } else if (action.searchType === 'titles') {
      const minCharactersBeforeSearching = 4;
      const maxQtyOfTitleSearchResultsToDisplay = 20;
      if (action.payload.length >= minCharactersBeforeSearching) {
        try {
          yield put({ type: 'SHOW_LOADING' });
          const response = yield Axios.get(`/api/search/keyword/${action.payload}`);

          // If there's only one result it will come in as an object, but if there's more than
          // one result it will come in as an object which automatically converts to an array.
          let boardGamesArr = response.data;
          if (boardGamesArr.length === undefined) {
            boardGamesArr = [boardGamesArr];
          }
          // There could be hundreds of search results, but only store/display a hand full.
          if (boardGamesArr.length >= maxQtyOfTitleSearchResultsToDisplay) {
            boardGamesArr.length = maxQtyOfTitleSearchResultsToDisplay;
          }
          yield put({ type: 'SET_SEARCH_TITLES', payload: boardGamesArr });
        } catch (error) {
          yield put({ type: 'RESET_SEARCH_TITLES' });
          yield put({ type: 'SET_GAME_SEARCH__GAME_NOT_FOUND', payload: 'Error, fetching game titles.' });
        } finally {
          if (yield cancelled()) {
            console.log('canceled search for', action.payload);
          }
        }
      } else {
        yield put({ type: 'RESET_SEARCH_TITLES' });
      }
    }
  } finally {
    yield put({ type: 'HIDE_LOADING' });
  }
}

function* getGameByID(action) {
  try {
    yield put({ type: 'SHOW_LOADING' });
    yield put({ type: 'RESET_RAW_SEARCH_GAMES' });
    yield put({ type: 'RESET_FORMATTED_SEARCH_GAMES' });
    yield put({ type: 'RESET_GAME_SEARCH__GAME_NOT_FOUND' });
    yield put({ type: 'RESET_SEARCH_TITLES' });
    const result = yield Axios.get(`/api/search/game-id/${action.payload}`);
    yield put({ type: 'SET_RAW_SEARCH_GAMES', payload: [result.data] });
  } finally {
    yield put({ type: 'HIDE_LOADING' });
  }
}

function* getRandomGameByID(action) {
  try {
    const qtyBGGGames = 314425;
    const qty = action.payload.qty;
    const randomGamesArr = Array.from({ length: qty }, () => Math.floor(Math.random() * qtyBGGGames));
    yield put({ type: 'SHOW_LOADING' });
    const result = yield Axios.get(`/api/search/game-id/${randomGamesArr.toString()}`);
    yield put({ type: 'SET_RAW_RANDOM_SEARCH_GAMES', payload: result.data });
  } finally {
    yield put({ type: 'HIDE_LOADING' });
  }
}

function* searchingBBGSaga() {
  yield takeLatest('FETCH_GAMES', searchGames);
  yield takeEvery('FETCH_GAME_DETAILS', getGameByID);
  yield takeEvery('FETCH_RANDOM_GAME_DETAILS', getRandomGameByID);
}

export default searchingBBGSaga;
