import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchTablePresets from '../../Components/GamesTable/GamesTable';
import LogOutButton from '../../App/LogOutButton/LogOutButton';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
// import Table from '../../Components/UserTable/UserResultsTable';

const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

class UserPage extends Component {
  render() {
    return (
      <>
        <div>
          <h1 id='welcome'>
            Welcome, {this.props.user.username} -test!
          </h1>
          <p>Your ID is: {this.props.user.id} -1</p>
          <LogOutButton className='log-in' />
        </div>
        <br />
        {/* <Table /> */}
        <MuiThemeProvider theme={useStyles}>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={this.props.errors.editGamesMessage}
            autoHideDuration={10000}
            onClose={() => this.props.dispatch({ type: 'CLEAR_EDIT_GAMES_ERROR' })}
          >
            <Alert
              onClose={() => this.props.dispatch({ type: 'CLEAR_EDIT_GAMES_ERROR' })}
              severity='error'
            >
              {this.props.errors.editGamesMessage}
            </Alert>
          </Snackbar>
        </MuiThemeProvider>
      </>
    );
  }
};

// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
  errors: state.errors
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserPage);
