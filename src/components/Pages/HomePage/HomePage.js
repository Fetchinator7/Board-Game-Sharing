import React from 'react';
import { connect } from 'react-redux';
import SearchTablePresets from '../../Components/GamesTable/GamesTable';
import MUIDataTable from 'mui-datatables';
import SearchResult from '../SearchPageGames/GameSearchResult';
import baseGamesDataArray from '../../Components/GamesTable/GamesTableStandardColumns';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

class RandomGamesTable extends React.Component {
  // TODO manually enter the top 50 games? Faster and better quality.
  getRandomGames = (qty) => {
    this.props.dispatch({ type: "FETCH_RANDOM_GAME_DETAILS", payload: { qty } });
  }

  componentDidMount() {
    this.getRandomGames(10);
  }

  render() {
    const data = this.props.searchBGG.randomRawGameResults;
    const result = [];
    data && data.map(gameObj => {
      result.push(SearchResult(gameObj, this.props.usersGames));
    });
    result.length !== 0 && this.props.dispatch({ type: 'CLEAR_RAW_RANDOM_SEARCH_GAMES' });
    console.log(data);
    result.length !== 0 && this.props.dispatch({ type: 'SET_RANDOM_FORMATTED_SEARCH_GAMES', payload: result });

    const baseData = baseGamesDataArray(this.props.searchBGG.formattedRandomGameResults);
    let fullData = baseData;
    const columns = [...SearchTablePresets.columns];
    return (
      <>
        <MuiThemeProvider theme={useStyles}>
          <MUIDataTable title='Random Games' data={fullData} columns={columns} options={SearchTablePresets.options} />
        </MuiThemeProvider>
      </>
    );
  }
}

const mapStateToProps = reduxState => ({
  searchBGG: reduxState.searchBGG,
  userStatus: reduxState.status,
  usersGames: reduxState.user.ownedGames
});

export default connect(mapStateToProps)(RandomGamesTable);
