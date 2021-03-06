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

const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

// This component will display the input user object results.
class Table extends React.Component {
  state = {
    confirmationWindowIsOpen: false,
    // This component has multiple purposes so change the confirm button text based on
    // which mode is running.
    trueButtonAction: '',
    prompt: '',
    // The text the user entered in the text input.
    message: '',
    showTextField: true,
    otherUsersID: '',
    // 
    selectedSearchResultUserName: '',
    selectedSearchResultUsersAreFriends: ''
  }

  changeFriendStatus = () => {
    if (!this.state.selectedSearchResultUsersAreFriends) {
      // TODO this.props.dispatch() remove and block.
    } else {
      this.props.dispatch({
        type: 'CREATE_FRIEND_REQUEST',
        payload: {
          otherUserID: this.state.otherUsersID,
          message: this.state.message
        }
      })
    }
    this.setState({
      confirmationWindowIsOpen: false,
      prompt: '',
      message: '',
      otherUsersID: '',
      selectedSearchResultUserName: '',
      selectedSearchResultUsersAreFriends: ''
    })
  }

  showConfirmationDialogue = (userName, usersAreFriends, otherUsersID) => {
    this.setState({
      confirmationWindowIsOpen: true,
      showTextField: true,
      prompt: `"${userName}" is more likely to accept your friend request if you send a message!`,
      otherUsersID: otherUsersID,
      selectedSearchResultUserName: userName,
      selectedSearchResultUsersAreFriends: usersAreFriends
    })
    if (usersAreFriends) {
      this.setState({
        trueButtonAction: 'SEND',
        showTextField: true,
        prompt: `"${userName}" is more likely to accept your friend request if you send a message!`,
      })
    } else {
      this.setState({
        trueButtonAction: 'YES',
        showTextField: false,
        prompt: `Are you sure you want to remove your friend "${userName}"?`,
      })
    }
    
  }

  // See if these users are friend by checking if the other user's id appears in the array
  // of all the friends the current user has.
  getFriendStatus = (userSearchResultID) => {
    return !this.props.userFriends.some(userObj => userObj.friend_id === userSearchResultID)
  }

  render() {
    // This array controls which columns appear in the table. Always show the users column,
    // but only show the send friend request if the user is signed in.
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
        label: 'Friend Request',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value = false, tableMeta) => {
            return (
              <FormControlLabel
                control={
                  <Button
                    color='primary'
                    variant="contained"
                    value={value}
                    startIcon={value.props.isFriend ? <SendIcon /> : <DeleteIcon />}
                  >{value.props.isFriend ? 'Send Friend Request' : 'Remove This Friend'}
                  </Button>
                }
                onClick={() => {
                  this.showConfirmationDialogue(tableMeta.rowData[0].props.children, value.props.isFriend, value.props.otherUsersID );
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
      // Make this button open a different user's profile when clicked.
      <Button
        variant="contained"
        color="primary"
        href={`/#/user/${user.user_name}`}
      >{user.user_name}</Button>,
      this.props.userStatus.userIsSignedIn &&
      <Button
        // These are arbitrary keys I made up so the table can access this information.
        // If this table is used for search results user user_id,
        // but if it's displaying a user's friends use friend_id.
        isFriend={this.getFriendStatus(user.user_id ? user.user_id : user.friend_id)}
        otherUsersID={user.user_id}
      />
    ])
    // Use the default table options, except don't let the user search inside this table 
    // because there's no point in this case.
    const options = {
      ...SearchTablePresets.options,
      search: false
    }
    return (
      <>
        <MuiThemeProvider theme={SearchTablePresets.theme}>
          {/* Render the table */}
          <MUIDataTable title='Users' data={data} columns={columns} options={options} />
        </MuiThemeProvider>
        <MuiThemeProvider theme={useStyles}>
        <Dialog open={this.state.confirmationWindowIsOpen} onClose={() => this.setState({ confirmationWindowIsOpen: false })} aria-labelledby="form-dialog-title">
          {/* <DialogTitle id="form-dialog-title">Subscribe</DialogTitle> */}
          <DialogContent>
            <DialogContentText>
              {this.state.prompt}
          </DialogContentText>
          {/* Dialogue that prompts the user to send a message for a new user request. */}
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
                // Set maximum number of message characters to 1000.
                event => event.target.value.length <= 1000 && this.setState({ message: event.target.value })
              }
            />
          }
          </DialogContent>
          {/* Confirm or cancel buttons. */}
          <DialogActions>
              <Button
                onClick={() => this.setState({ confirmationWindowIsOpen: false })}
                color="secondary"
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
  userFriends: reduxState.user.friends,
});

export default connect(mapStateToProps)(Table);
