import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchTablePresets from '../GamesTable/GamesTable';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

class UserPage extends Component {
  render() {
    const { openIfText, onCloseDispatchText, autoHideDuration, message } = this.props;
    console.log(openIfText, onCloseDispatchText, autoHideDuration, message);
    if (typeof openIfText !== 'string' || !onCloseDispatchText || typeof message !== 'string') {
      throw new Error('the ErrorSnack requires all these attributes but at least one is missing: open, onCloseDispatchText, autoHideDuration, message');
    }
    return (
      <MuiThemeProvider theme={useStyles}>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openIfText ? true : false}
          autoHideDuration={autoHideDuration === null ? null : autoHideDuration}
          onClose={() => this.props.dispatch({ type: onCloseDispatchText })}
        >
          <Alert
            onClose={() => this.props.dispatch({ type: onCloseDispatchText })}
            severity='error'
          >
            {message}
          </Alert>
        </Snackbar>
      </MuiThemeProvider>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect()(UserPage);
