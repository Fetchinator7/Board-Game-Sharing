import React from 'react';
import { connect } from 'react-redux';
import SearchTablePresets from '../../Components/GamesTable/GamesTable';
import MUIDataTable from 'mui-datatables';
import baseGamesDataArray from '../../Components/GamesTable/GamesTableStandardColumns';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

class RandomGamesTable extends React.Component {
  // TODO manually enter the top 50 games? Faster and better quality.

  // Get a random int in a range without any duplicates.
  randomRange = length => {
    const results = []
    const possibleValues = Array.from({ length }, (value, i) => i)

    for (let i = 0; i < length; i += 1) {
      const possibleValuesRange = length - (length - possibleValues.length)
      const randomNumber = Math.floor(Math.random() * possibleValuesRange)
      const normalizedRandomNumber = randomNumber !== possibleValuesRange ? randomNumber : possibleValuesRange
      const [nextNumber] = possibleValues.splice(normalizedRandomNumber, 1)
      results.push(nextNumber)
    }
    return results
  }

  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_A_DIFFERENT_USER', payload: 'Admin' });
  }

  // The user is leaving the home page so clear the games in case the user view a different
  // user's profile.
  componentWillUnmount() {
    this.props.dispatch({ type: 'CLEAR_A_DIFFERENT_USERS_OWNED_GAMES' });
    this.props.dispatch({ type: 'CLEAR_A_DIFFERENT_USERS_ID' });
  }

  render() {
    // Get all of the Admin user's games.
    const baseData = baseGamesDataArray(this.props.otherUsersGames);
    let randomIndexes = [];
    // If there's data in the baseData (there isn't the first time the page loads) get 
    // random integers that are in the range of the length of the Admin user's game collection.
    baseData.length && (randomIndexes = this.randomRange(baseData.length));
    // Only use the first 10 of the random indexes.
    randomIndexes.length && (randomIndexes.length = 10);
    // Make an array of the data to display by taking the game objects at the random indexes.
    const fullData = randomIndexes.map(index => baseData[index]);
    return (
      <>
        <MuiThemeProvider theme={useStyles}>
          <MUIDataTable title='Random Games' data={fullData} columns={SearchTablePresets.columns} options={SearchTablePresets.options} />
        </MuiThemeProvider>
      </>
    );
  }
}

const mapStateToProps = reduxState => ({
  otherUsersGames: reduxState.loggedOut.otherUsersGames,
  userStatus: reduxState.status,
  usersGames: reduxState.user.ownedGames
});

export default connect(mapStateToProps)(RandomGamesTable);
