import React from 'react';
import { connect } from 'react-redux';
import SearchTablePresets from '../GamesTable/GamesTable';
import MUIDataTable from 'mui-datatables';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Button, TextField, MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

class Table extends React.Component {
  state = {
    confirmationWindowIsOpen: false,
    trueButtonAction: '',
    prompt: '',
    message: '',
    showTextField: true,
    selectedSearchResultUserName: '',
    selectedSearchResultUsersAreFriends: ''
  }

  changeFriendStatus = () => {
    console.log('Send request', this.state);
    if (this.state.selectedSearchResultUsersAreFriends) {
      // this.props.dispatch() remove and block.
    } else {
      // this.props.dispatch() request
    }
    // this.props.dispatch()
    // this.state.message
    // TODO send the actual request.
    this.setState({
      confirmationWindowIsOpen: false,
      prompt: '',
      message: '',
      selectedSearchResultUserName: '',
      selectedSearchResultUsersAreFriends: ''
    })
  }

  showConfirmationDialogue = (userName, usersAreFriends) => {
    console.log('Change friend status pop-up', userName, usersAreFriends);
    if (usersAreFriends) {
      this.setState({
        confirmationWindowIsOpen: true,
        trueButtonAction: 'SEND',
        showTextField: true,
        prompt: `"${userName}" is more likely to accept your friend request if you send a message!`,
        selectedSearchResultUserName: userName,
        selectedSearchResultUsersAreFriends: usersAreFriends
      })
    } else {
      this.setState({
        confirmationWindowIsOpen: true,
        trueButtonAction: 'YES',
        showTextField: false,
        prompt: `Are you sure you want to remove your friend "${userName}"?`,
        selectedSearchResultUserName: userName,
        selectedSearchResultUsersAreFriends: usersAreFriends
      })
    }
    
  }

  getFriendStatus = (userSearchResultID) => {
    return !this.props.userFriends.some(userObj => userObj.friend_id === userSearchResultID)
  }

  render() {
    const columns = [
      {
        name: 'Users',
        options: {
          filter: false,
          sort: true
        }
      }
    ];
    this.props.userStatus.userIsSignedIn && columns.push(
      {
        name: 'Friend Request',
        label: 'Send Friend Request',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value = false, tableMeta) => {
            return (
              <FormControlLabel
                control={
                  <Button
                    color={value.props.isFriend ? 'primary' : 'secondary'}
                    variant="contained"
                    value={value}
                    startIcon={value.props.isFriend ? <SendIcon /> : <DeleteIcon />}
                  >{value.props.isFriend ? 'Send Friend Request' : 'Remove This Friend'}
                  </Button>
                }
                onClick={() => {
                  this.showConfirmationDialogue(tableMeta.rowData[0].props.children, value.props.isFriend);
                }}
              />
            );
          }
        }
      }
    )
    // tableData comes from the parent so this table can be used for display all users or
    // only one user's friends.
    const data = this.props.tableData.map(user => [
      <Button
        variant="contained"
        color="primary"
        href={`/user/${user.user_name}`}
      >{user.user_name}</Button>,
      this.props.userStatus.userIsSignedIn &&
      <Button
        // This is an are arbitrary key I made up so the table can access this information.
        isFriend={this.getFriendStatus(user.user_id)}
      />
    ])
    const options = {
      ...SearchTablePresets.options,
      search: false
    }
    return (
      <>
        <MuiThemeProvider theme={SearchTablePresets.theme}>
          <MUIDataTable title='Search Users' data={data} columns={columns} options={options} />
        </MuiThemeProvider>
        <MuiThemeProvider theme={useStyles}>
        <Dialog open={this.state.confirmationWindowIsOpen} onClose={() => this.setState({ confirmationWindowIsOpen: false })} aria-labelledby="form-dialog-title">
          {/* <DialogTitle id="form-dialog-title">Subscribe</DialogTitle> */}
          <DialogContent>
            <DialogContentText>
              {this.state.prompt}
          </DialogContentText>
              {this.state.showTextField &&
            <TextField
              autoFocus
              margin="dense"
              label="Message"
              type="text"
              fullWidth
              maxLength='10'
              value={this.state.message}
              onChange={
                // Set maximum number of message characters to 50.
                event => event.target.value.length <= 50 && this.setState({ message: event.target.value })
              }
            />
          }
          </DialogContent>
          <DialogActions>
              <Button
                onClick={() => this.setState({ confirmationWindowIsOpen: false })}
                color="primary"
                variant="contained">
              Cancel
          </Button>
            <Button
              onClick={() => this.changeFriendStatus()}
              color="primary"
              variant="contained">
              {this.state.trueButtonAction}
          </Button>
          </DialogActions>
        </Dialog>
        </MuiThemeProvider>
      </>
    )
  }
}

const mapStateToProps = reduxState => ({
  searchUsers: reduxState.searchUsers,
  userStatus: reduxState.status,
  userFriends: reduxState.user.friends
});

export default connect(mapStateToProps)(Table);
