import React from 'react';
import { connect } from 'react-redux';
import SearchTablePresets from '../../Components/GamesTable/GamesTable';
import MUIDataTable from 'mui-datatables';
import { Button } from '@material-ui/core';

class Table extends React.Component {

  changeFriendStatus = (userObj, usersAreFriends) => {
    console.log('Request friend pop-up', userObj, usersAreFriends);
  }

  getFriendStatus = (userObj) => {
    console.log('Get friend status', userObj);
    // this.props.dispatch()
  }

  render() {
    const data = this.props.searchUsers.usersSearchResults.map((userObj, index) => [
      <a key={`game-table-row-${index}`} href={`/user/${userObj.user_name}`}>{userObj.user_name}</a>,
      this.props.userStatus.userIsSignedIn &&
      this.getFriendStatus()
        ? <Button
          variant="contained"
          color="primary"
          onClick={() => this.changeFriendStatus(userObj, false)}
        >Send Friend Request
          </Button>
        : <Button
          variant="contained"
          color="primary"
          onClick={() => this.changeFriendStatus(userObj, true)}
        >Remove This Friend
          </Button>
    ])

    return (
      <MuiThemeProvider theme={SearchTablePresets.theme}>
        <MUIDataTable title='Search Users' data={data} columns={columns} options={SearchTablePresets.options} />
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = reduxState => ({
  searchUsers: reduxState.searchUsers,
  userStatus: reduxState.status
});

export default connect(mapStateToProps)(Table);
