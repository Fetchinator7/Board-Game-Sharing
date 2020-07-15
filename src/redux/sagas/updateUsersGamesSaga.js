import axios from 'axios';
import { put, takeEvery, select } from 'redux-saga/effects';

function* updateGameOwnedStatus(action) {
  try {
    const globalState = yield select();
    const ownedStatus = action.payload.ownedStatus;
    const BGGid = action.payload.BGGid;
    const formattedGame = globalState.searchBGG.formattedGameSearchResults.filter(game => game.bgg_game_id === BGGid);

    const allDataBaseGames = yield axios.get('/api/game/management/all-database-games');
    const gameIsInDatabase = allDataBaseGames.data.rows.some(dataBaseGame => dataBaseGame.bgg_game_id === BGGid);
    if (!gameIsInDatabase) {
      if (formattedGame) {
        yield axios.post('/api/game/management/database/game', formattedGame[0]);
      } else {
        throw new Error('Error, attempted to add a game to the database but received invalid formatting.');
      }
    }

    const dataBaseGameID = yield axios.get(`/api/game/management/game-table-id/${BGGid}`);
    const bodyObj = {
      gameID: dataBaseGameID.data.rows[0].game_id
    };

    if (ownedStatus) {
      // Delete/remove this game from the database.
      yield axios.put('/api/game/management/game', bodyObj);
    } else {
      // Add this game to the user's games.
      yield axios.post('/api/game/management/game', bodyObj);
    }

    const userGames = yield axios.get('/api/user/games');
    yield put({ type: 'SET_USER_OWNED_GAMES', payload: userGames.data });
  } catch (error) {
    yield put({ type: 'SET_EDIT_GAMES_ERROR', payload: 'Error updating owned game status.' });
  }
}

function* commentUsersGame(action) {
  try {
    const bodyObj = {
      gameID: action.payload.game_id,
      comment: action.payload.comments
    };
    // Comment this game from the database.
    yield axios.post('/api/game/management/comment', bodyObj);
  } catch (error) {
    yield put({ type: 'SET_EDIT_GAMES_ERROR', payload: 'Error updating the comment for a game.' });
  } finally {
    const userGames = yield axios.get('/api/user/games');
    yield put({ type: 'SET_USER_OWNED_GAMES', payload: userGames.data });
  }
}

function* deleteUsersGame(action) {
  try {
    const bodyObj = {
      gameID: action.payload.dataBaseGameID
    };
    // Delete/remove this game from the database.
    yield axios.put('/api/game/management/game', bodyObj);
    const userGames = yield axios.get('/api/user/games');
    yield put({ type: 'SET_USER_OWNED_GAMES', payload: userGames.data });
  } catch (error) {
    yield put({ type: 'SET_EDIT_GAMES_ERROR', payload: 'Error updating owned game status.' });
  }
}

function* updateGameStatus() {
  yield takeEvery('UPDATE_USER_OWNED_GAME', updateGameOwnedStatus);
  yield takeEvery('COMMENT_USER_OWNED_GAME', commentUsersGame);
  yield takeEvery('DELETE_USER_OWNED_GAME', deleteUsersGame);
}

export default updateGameStatus;
