import React from 'react';
import { connect } from 'react-redux';
import SearchTablePresets from '../GamesTable/GamesTable';
import { Button, MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
// import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

class Table extends React.Component {
  state = {
    drawIsOpen: false
  }

  toggleDrawer = () => {
    this.setState({ drawIsOpen: !this.state.drawIsOpen })
  }

  loan = (type) => {
    console.log(type);
  }

  friend = (type) => {
    console.log(type);
  }

  list = (anchor) => {
    return (
      <>      
        <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{<CheckCircleIcon />}</ListItemIcon>
            <ListItemText primary={'X user wants to be your friend!'} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.loan('Accept')}
            >
              Accept
              </Button>
            {<br />}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.loan('Decline')}
            >
              Decline
              </Button>
          </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
              <ListItemText primary={'X user wants to be your friend!  '} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.loan('Accept')}
              >
                Accept
              </Button>
              {<br />}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.loan('Decline')}
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
    return (
      <>
        {
          ['Notifications'].map((anchor) => (
            <React.Fragment key={anchor}>
              <MuiThemeProvider theme={useStyles}>
                <Button onClick={() => this.toggleDrawer(anchor, true)}>{anchor}</Button>
                <Drawer anchor={anchor} open={this.state.drawIsOpen} onClose={() => this.toggleDrawer(anchor, false)}>
                  {this.list(anchor)}
                </Drawer>
              </MuiThemeProvider>
            </React.Fragment>
          ))
        }
      </>
    )
  }
}

const mapStateToProps = reduxState => ({
  alerts: reduxState.user.alerts
});

export default connect(mapStateToProps)(Table);
