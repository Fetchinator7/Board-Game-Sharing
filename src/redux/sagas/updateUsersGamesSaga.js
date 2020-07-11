import axios from 'axios';
import { put, takeEvery, select } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* updateGameOwnedStatus(action) {
  try {
    const globalState = yield select();
    const ownedStatus = action.payload.ownedStatus;
    const BGGid = action.payload.BGGid;
    const formattedGame = globalState.searchBGG.formattedGameSearchResults.filter(game => game.BGGid === BGGid);

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
      userID: globalState.user.userAttributes.user_id,
      gameID: dataBaseGameID.data.rows[0].game_id
    };

    if (ownedStatus) {
      // Delete/remove this game from the database.
      yield axios.put('/api/game/management/game', bodyObj);
    } else {
      // Add this game to the user's games.
      yield axios.post('/api/game/management/game', bodyObj);
    }

    const userGames = yield axios.get(`/api/user/games/${globalState.user.userAttributes.user_id}`);
    yield put({ type: 'SET_USER_OWNED_GAMES', payload: userGames.data.rows });
    
  } catch (error) {
    console.log('Error updating owned game status:', error);
    yield put({ type: 'SET_EDIT_GAMES_ERROR', payload: 'Error updating owned game status.' });
  }
}

function* updateGameStatus() {
  yield takeEvery('UPDATE_USER_OWNED_GAME', updateGameOwnedStatus);
}

export default updateGameStatus;
