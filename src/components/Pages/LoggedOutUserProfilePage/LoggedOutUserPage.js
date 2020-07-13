import React, { Component } from 'react';
import { connect } from 'react-redux';
import baseGamesDataArray from '../../Components/GamesTable/GamesTableStandardColumns';
import SearchTablePresets from '../../Components/GamesTable/GamesTable';
import Snack from '../../Components/Snack';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import DatePicker from '../../Components/DatePicker/DatePicker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';

const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

class UserPage extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_A_DIFFERENT_USER', payload: this.props.match.params.userName });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'CLEAR_A_DIFFERENT_USERS_OWNED_GAMES' });
    this.props.dispatch({ type: 'CLEAR_A_DIFFERENT_USERS_ID' });
  }

  render() {
    const baseData = baseGamesDataArray(this.props.otherUsersGames);
    let fullData = baseData;
    fullData = this.props.otherUsersGames.map((gameObj, index) => {
      return [...baseData[index], gameObj.comments];
    });
    const columns = [...SearchTablePresets.columns];
    let options = SearchTablePresets.options;
    columns.push(
      {
        name: 'Comments',
        options: {
          filter: true,
          sort: true
        }
      }
    );
    if (this.props.userStatus.userIsSignedIn &&
        this.props.usersFriends.some(friendObj => friendObj.friend_id === this.props.otherUsersID)) {
      options = {
        ...options,
        isRowExpandable: () => true,
        filter: true,
        filterType: 'dropdown',
        responsive: 'standard',
        expandableRows: true,
        expandableRowsHeader: false,
        expandableRowsOnClick: true,
        renderExpandableRow: (rowData, rowMeta) => {
          const colSpan = rowData.length + 1;
          return (
            <TableRow>
              <TableCell colSpan={colSpan}>
                <DatePicker
                  mode='request'
                  loanDaysArray={this.props.otherUsersGames[rowMeta.rowIndex].loans}
                  gameID={this.props.otherUsersGames[rowMeta.rowIndex].game_id}
                  ownerID={this.props.otherUsersID}
                />
              </TableCell>
            </TableRow>
          );
        }
      };
    }
    return (
      <>
        {`This is ${this.props.match.params.userName}'s logged out page`}
        <MuiThemeProvider theme={useStyles}>
          <MUIDataTable title='Search Page' data={fullData} columns={columns} options={options} />
        </MuiThemeProvider>
        <Snack
          onCloseDispatchText='CLEAR_ERROR_GETTING_A_DIFFERENT_USERS_GAMES'
          autoHideDuration={null}
          message={this.props.otherUserGetErrorMessage}
          severity='error'
        />
        <Snack
          onCloseDispatchText='CLEAR_GAME_LOAN_CREATION_SUCCESS_FOR_A_DIFFERENT_USER'
          autoHideDuration={10000}
          message={this.props.otherUsersGamesSuccessMessage}
          severity='success'
        />
      </>
    );
  }
}

const mapStateToProps = reduxState => ({
  otherUsersGames: reduxState.loggedOut.otherUsersGames,
  otherUserGetErrorMessage: reduxState.loggedOut.otherUsersGamesServerErrorMessage,
  otherUsersGamesSuccessMessage: reduxState.loggedOut.otherUsersGamesSuccessMessage,
  otherUsersID: reduxState.loggedOut.otherUsersID,
  userStatus: reduxState.status,
  usersFriends: reduxState.user.friends
});

export default connect(mapStateToProps)(UserPage);
