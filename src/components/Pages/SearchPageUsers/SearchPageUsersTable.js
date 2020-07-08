import React from 'react';
import { connect } from 'react-redux';
import SearchTablePresets from '../../Components/GamesTable/GamesTable';
import MUIDataTable from 'mui-datatables';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Button, MuiThemeProvider } from '@material-ui/core';

class Table extends React.Component {

  changeFriendStatus = (userName, usersAreFriends) => {
    console.log('Change friend status pop-up', userName, usersAreFriends);
  }

  getFriendStatus = (userName) => {
    console.log('Get friend status username', userName);
    return true;
    // this.props.dispatch()
    // TODO get actual relationship.
  }

  render() {
    const columns = [
      {
        name: 'Users',
        options: {
          filter: false,
          sort: false
        }
      }
    ];
    this.props.userStatus.userIsSignedIn && columns.push(
      {
        name: 'Friend Request',
        label: 'Send Friend Request',
        options: {
          filter: true,
          customBodyRender: (value = false, tableMeta) => {
            return (
              <FormControlLabel
                control={
                  <Button color={value.props.isFriend ? 'primary' : 'secondary'} variant="contained" value={value}>{value.props.buttonTitle}</Button>
                }
                onClick={() => {
                  this.changeFriendStatus(tableMeta.rowData[0].props.children, value.props.isFriend);
                }}
              />
            );
          }
        }
      }
    )
    const data = this.props.searchUsers.usersSearchResults.map(user => [
      <Button
        variant="contained"
        color="primary"
        href={`/user/${user.user_name}`}
      >{user.user_name}</Button>,
      this.props.userStatus.userIsSignedIn &&
      <Button
        variant="contained"
        color="primary"
        // These are arbitrary keys I made up so the table can access this information.
        isFriend={this.getFriendStatus(user.user_name)}
        buttonTitle={this.getFriendStatus(user.user_name) ? 'Send Friend Request' : 'Remove This Friend'}
      />
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
