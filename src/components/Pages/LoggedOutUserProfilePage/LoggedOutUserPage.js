import React, { Component } from 'react';
import { connect } from 'react-redux';
import baseGamesDataArray from '../../Components/GamesTable/GamesTableStandardColumns';
import SearchTablePresets from '../../Components/GamesTable/GamesTable';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

class UserPage extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_A_DIFFERENT_USER', payload: this.props.match.params.userName });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'CLEAR_A_DIFFERENT_USERS_OWNED_GAMES' });
  }

  render() {
    const baseData = baseGamesDataArray(this.props.otherUsersGames);
    let fullData = baseData;
    fullData = this.props.otherUsersGames.map((gameObj, index) => {
      return [...baseData[index], gameObj.comments];
    });
    const columns = [...SearchTablePresets.columns];
    columns.push(
      {
        name: 'Comments',
        options: {
          filter: true,
          sort: true
        }
      }
    );
    if (this.props.userStatus.userIsSignedIn) {
      columns.unshift(
        {
          name: 'Request',
          options: {
            filter: false,
            sort: false,
            customBodyRender: (value = false, tableMeta) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox color='primary' checked={value.props.checked} value={value.props.checked} />
                  }
                  onClick={() => {
                    const bodyObj = {
                      ownedStatus: value.props.checked,
                      BGGid: tableMeta.rowData[SearchTablePresets.moreInfoColumnIndex].props.id
                    };
                    this.props.dispatch({ type: 'UPDATE_USER_OWNED_GAME', payload: bodyObj });
                  }}
                />
              );
            }
          }
        }
      );
      fullData = this.props.otherUsersGames.map((gameObj, index) => {
        return [<Checkbox color='primary' checked={gameObj.owned} key={`game-search-table-row-${index}`} />, ...fullData[index]];
      });
    }
    return (
      <>
        {`This is ${this.props.match.params.userName}'s logged out page`}
        <MuiThemeProvider theme={useStyles}>
          <MUIDataTable title='Search Page' data={fullData} columns={columns} options={SearchTablePresets.options} />
        </MuiThemeProvider>
      </>
    );
  }
}

const mapStateToProps = reduxState => ({
  otherUsersGames: reduxState.loggedOut.otherUsersGames,
  userStatus: reduxState.status
});

export default connect(mapStateToProps)(UserPage);
