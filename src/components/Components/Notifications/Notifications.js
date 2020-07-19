import React from 'react';
import { connect } from 'react-redux';
import SearchTablePresets from '../GamesTable/GamesTable';
import Snack from '../../Components/Snack';
import { Button, MuiThemeProvider, createMuiTheme, Badge, Link } from "@material-ui/core";
import NotificationsIcon from '@material-ui/icons/Notifications';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import '../../App/Nav/Nav.css';

// Use styles from parent preset.
const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

// This component will show a drop down where users can manage their notifications.
class Notifications extends React.Component {
  state = {
    drawIsOpen: false
  }

  toggleDrawer = () => {
    this.setState({ drawIsOpen: !this.state.drawIsOpen })
  }

  // The user is responding to a loan request so dispatch the action to update that loan request.
  loan = (agreedBool, alertID, loanedGameID) => {
    this.props.dispatch({
      type: 'SET_LOAN_REQUEST_UPDATED_STATE',
      payload: {
        alertID: alertID,
        agreed: agreedBool,
        loanedGameID: loanedGameID
    }})
  }

  // The user is responding to a friend request so dispatch the action to update that friend request.
  friend = (agreedBool, alertID, friendRequestID) => {
    this.props.dispatch({
      type: 'SET_FRIEND_REQUEST_UPDATED_STATE',
      payload: {
        alertID: alertID,
        agreed: agreedBool,
        friendRequestID: friendRequestID
      }
    })
  }

  // Display a list inside of this component with a couple different categories.
  list = () => {
    return (
      <>      
        <List>
          {this.props.alerts.map((loanNotificationObj, index) => (
            loanNotificationObj.loaned_game_id &&
            <ListItem button key={`notification-loan-request-${index}`}>
            <ListItemIcon>{<CheckCircleIcon />}</ListItemIcon>
              <ListItemText primary={loanNotificationObj.alert_text} />
            <Button
              variant="contained"
              color="primary"
                onClick={() => this.loan(true, loanNotificationObj.alert_id, loanNotificationObj.loaned_game_id)}
            >
              Accept
              </Button>
            {<br />}
            <Button
              variant="contained"
              color="secondary"
                onClick={() => this.loan(false, loanNotificationObj.alert_id, loanNotificationObj.loaned_game_id)}
            >
              Decline
              </Button>
          </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {this.props.alerts.map((friendNotificationObj, index) => (
            friendNotificationObj.friend_request_id &&
            <ListItem button key={`notification-friend-request-${index}`}>
              <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
              <ListItemText primary={friendNotificationObj.alert_text} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.friend(true, friendNotificationObj.alert_id, friendNotificationObj.friend_request_id)}
              >
                Accept
              </Button>
              {<br />}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.friend(false, friendNotificationObj.alert_id, friendNotificationObj.friend_request_id)}
              >
                Decline
              </Button>
            </ListItem>
          ))}
        </List>
      </>
    )
  }

  render() {
    // Display from the top-down.
    const anchor = 'top';
    return (
      <>
        {
          [<Badge badgeContent={this.props.alerts.length} color='primary'><NotificationsIcon style={{ paddingTop: 15, paddingBottom: 15, color: 'white' }} /></Badge>].map((buttonText) => (
            <React.Fragment key={anchor}>
              <MuiThemeProvider theme={useStyles}>
                <Button className='nav-link' onClick={() => this.toggleDrawer(anchor, true)}>{buttonText}</Button>
                <Drawer anchor={anchor} open={this.state.drawIsOpen} onClose={() => this.toggleDrawer(anchor, false)}>
                  {this.list(anchor)}
                </Drawer>
                {/* My preset snack to display a success message. */}
                <Snack
                  onCloseDispatchText='CLEAR_FRIEND_REQUEST_SENT_SUCCESSFULLY'
                  autoHideDuration={5000}
                  message={this.props.searchUsers.sentFriendRequestSuccessMessage}
                  severity={'success'}
                />
                <Snack
                  onCloseDispatchText='CLEAR_ERROR_UPDATING_FRIEND_REQUEST_STATUS'
                  autoHideDuration={5000}
                  message={this.props.errors.editFriendRequestStatusServerErrorMessage}
                  severity={'error'}
                />
              </MuiThemeProvider>
            </React.Fragment>
          ))
        }
      </>
    )
  }
}

const mapStateToProps = reduxState => ({
  alerts: reduxState.user.alerts,
  errors: reduxState.errors,
  searchUsers: reduxState.searchUsers,
});

export default connect(mapStateToProps)(Notifications);
