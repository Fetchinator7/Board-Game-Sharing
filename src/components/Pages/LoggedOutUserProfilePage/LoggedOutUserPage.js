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
  // Get the user's username based on the url.
  state = {
    userName: this.props.match.params.userName
  }

  // Fetch details for the current url user.
  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_A_DIFFERENT_USER', payload: this.props.match.params.userName });
  }

  // This component loads for any user tha isn't logged in, so if the user enters another
  // user in the url directly this component won't mount again, but it will receive new props
  // so check if the url username is different than the one currently displayed so this knows
  // to update the user information.
  componentDidUpdate() {
    if (this.state.userName !== this.props.match.params.userName) {
      this.props.dispatch({ type: 'CLEAR_A_DIFFERENT_USERS_OWNED_GAMES' });
      this.props.dispatch({ type: 'CLEAR_A_DIFFERENT_USERS_ID' });
      this.setState({ userName: this.props.match.params.userName })
      this.props.dispatch({ type: 'FETCH_A_DIFFERENT_USER', payload: this.props.match.params.userName });
    }
  }

  // The user is leaving the other user's page so clear the information since it can only
  // show one user at a time.
  componentWillUnmount() {
    this.props.dispatch({ type: 'CLEAR_A_DIFFERENT_USERS_OWNED_GAMES' });
    this.props.dispatch({ type: 'CLEAR_A_DIFFERENT_USERS_ID' });
  }

  render() {
    // Get the standard formatted information.
    const baseData = baseGamesDataArray(this.props.otherUsersGames);
    
    // Show a user's comments for any games they have.
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

    // If the user is singed in and they're friends with this user display the date picker expandable row.
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
                  gameTitle={this.props.otherUsersGames[rowMeta.rowIndex].title}
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
        <h1 className='profileText'>
          {`This is ${this.props.match.params.userName}'s profile page`}
        </h1>
        {/* Render the table. */}
        <MuiThemeProvider theme={useStyles}>
          <MUIDataTable title={`Search ${this.props.match.params.userName}'s Games`} data={fullData} columns={columns} options={options} />
        </MuiThemeProvider>
        {/* Status snacks. */}
        <Snack
          onCloseDispatchText='CLEAR_ERROR_GETTING_A_DIFFERENT_USERS_GAMES'
          autoHideDurationSeconds={null}
          message={this.props.otherUserGetErrorMessage}
          severity='error'
        />
        <Snack
          onCloseDispatchText='CLEAR_GAME_LOAN_CREATION_SUCCESS_FOR_A_DIFFERENT_USER'
          autoHideDurationSeconds={10}
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
