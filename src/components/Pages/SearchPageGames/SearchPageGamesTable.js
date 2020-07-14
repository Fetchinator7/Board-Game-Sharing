import React from 'react';
import { connect } from 'react-redux';
import ConfirmationDialogue from '../../Components/Notifications/ConfirmationDialogue';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import SearchTablePresets from '../../Components/GamesTable/GamesTable';
import MUIDataTable from 'mui-datatables';
import SearchResult from './GameSearchResult';
import baseGamesDataArray from '../../Components/GamesTable/GamesTableStandardColumns';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

class Table extends React.Component {
  state = {
    bodyObj: {},
    gameTitle: '',
    showDialogue: false
  }

  confirmBeforeDeleting = (proceedBool) => {
    if (proceedBool) {
      this.props.dispatch({ type: 'UPDATE_USER_OWNED_GAME', payload: this.state.bodyObj });
    }
    this.setState({
      bodyObj: {},
      gameTitle: '',
      showDialogue: false
    })
  }

  render() {
    const data = this.props.searchBGG.rawGameSearchResults;
    const result = [];
    data && data.map(gameObj => {
      result.push(SearchResult(gameObj, this.props.usersGames));
    });
    result.length !== 0 && this.props.dispatch({ type: 'RESET_RAW_SEARCH_GAMES' });
    result.length !== 0 && this.props.dispatch({ type: 'SET_FORMATTED_SEARCH_GAMES', payload: result });

    const baseData = baseGamesDataArray(this.props.searchBGG.formattedGameSearchResults);
    let fullData = baseData;
    const columns = [...SearchTablePresets.columns];
    if (this.props.userStatus.userIsSignedIn) {
      columns.unshift(
        {
          name: 'Owned',
          options: {
            filter: true,
            customBodyRender: (value = false, tableMeta) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox color='primary' checked={value.props.checked} value={value.props.checked} />
                  }
                  onClick={() => {
                    const BGGid = tableMeta.rowData[SearchTablePresets.moreInfoColumnIndex].props.id
                    const bodyObj = {
                      ownedStatus: value.props.checked,
                      BGGid: BGGid,
                      gameTitle: tableMeta.rowData[SearchTablePresets.moreInfoColumnIndex].props.id
                    };
                    if (value.props.checked) {
                      this.setState({
                        bodyObj: bodyObj,
                        gameTitle: tableMeta.rowData[2],
                        showDialogue: true
                      })
                    } else {
                      this.props.dispatch({ type: 'UPDATE_USER_OWNED_GAME', payload: bodyObj });
                    }
                  }}
                />
              );
            }
          }
        }
      );
      fullData = this.props.searchBGG.formattedGameSearchResults.map((gameObj, index) => {
        const owned = this.props.usersGames.some(userGameObj => userGameObj.bgg_game_id === gameObj.bgg_game_id);
        return [<Checkbox color='primary' checked={owned} key={`game-search-table-row-${index}`} />, ...baseData[index]];
      });
    }

    return (
      <>
      <MuiThemeProvider theme={useStyles}>
        <MUIDataTable title='Search Page' data={fullData} columns={columns} options={SearchTablePresets.options} />
      </MuiThemeProvider>
      <ConfirmationDialogue
        parentCallBackFunc={this.confirmBeforeDeleting}
        visible={this.state.showDialogue}
        title={`Are you sure you want to delete your game "${this.state.gameTitle}"?`}
        trueButtonAction={'Proceed'}
        showTextField={false}
      />
      </>
    );
  }
}

const mapStateToProps = reduxState => ({
  searchBGG: reduxState.searchBGG,
  userStatus: reduxState.status,
  usersGames: reduxState.user.ownedGames
});

export default connect(mapStateToProps)(Table);
