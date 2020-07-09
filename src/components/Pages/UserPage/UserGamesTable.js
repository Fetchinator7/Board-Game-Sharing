import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchTablePresets from '../../Components/GamesTable/GamesTable';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

class UserGamesTable extends Component {
  render() {
    // this.props.tableData
    return (
      <>
        <div>
          <h1 id='welcome'>
            Welcome, {this.props.user.username} -test!
          </h1>
          <p>Your ID is: {this.props.user.id} -1</p>
        </div>
        <br />
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
}

const mapStateToProps = state => ({
  user: state.user,
  errors: state.errors
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserGamesTable);
