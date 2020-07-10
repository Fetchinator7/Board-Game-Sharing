import axios from 'axios';
import { connect } from 'react-redux';
import { put, takeEvery } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* updateGameOwnedStatus(action) {
  try {
    const ownedStatus = action.payload.ownedStatus;
    const BGGid = action.payload.BGGid;

    // const allDataBaseGames = yield axios.get('/api/game/management/all-database-games');
    // const gameIsInDatabase = allDataBaseGames.some(dataBaseGame => dataBaseGame.bgg_game_id === BGGid);
    // const formattedGame = this.props.formattedGames.filter(game => game.BGGid === BGGid);
    // const serverSecret = process.env.SERVER_SESSION_SECRET;
    // if (!gameIsInDatabase) {
    //   if (formattedGame) {
    //     yield axios.post('/api/game/management/database/game', { ...formattedGame, serverSecret });
    //   } else {
    //     throw new Error('Error, attempted to add a game to the database but received invalid formatting.');
    //   }
    // }

    // const bodyObj = {
    //   userID: this.props.userID,
    //   gameID: BGGid
    // };
    // console.log(ownedStatus, BGGid, action);
    // if (!ownedStatus) {
    //   yield axios.delete('/api/user/game', bodyObj);
    // } else {
    //   yield axios.post('/api/user/game', bodyObj);
    // }

    // const userGames = yield axios.get(`/api/user/games/${this.props.userID}`);
    // yield put({ type: 'SET_USER_OWNED_GAMES', payload: userGames.data.rows });

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    // yield put({ type: 'SET_USER', payload: response.data });
    // const userGames = yield axios.get(`/api/user/games/${response.data.user_id}`);
    // yield put({ type: 'SET_USER_OWNED_GAMES', payload: userGames.data.rows });
    // yield put({ type: 'SET_SIGNED_IN' });
    // const allDataBaseBGGGameIDs = yield axios.get('/api/game/management/all-database-games');
    // yield put({ type: 'SET_ALL_DATABASE_GAMES', payload: allDataBaseBGGGameIDs.data.rows });
  } catch (error) {
    console.log('Error updating owned game status:', error);
  }
}

function* updateGameStatus() {
  yield takeEvery('UPDATE_USER_OWNED_GAME', updateGameOwnedStatus);
}

const mapStateToProps = reduxState => ({
  userID: reduxState.user.userAttributes.user_id,
  formattedGames: reduxState.searchBGG.formattedGameSearchResults
});

export default connect(mapStateToProps)(updateGameStatus);
