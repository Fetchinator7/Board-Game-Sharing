import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchTablePresets from './GamesTable/GamesTable';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import Fade from '@material-ui/core/Fade';

const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

class UserPage extends Component {
  render() {
    const { onCloseDispatchText, autoHideDuration, message, severity } = this.props;
    if (!onCloseDispatchText || typeof message !== 'string' || typeof severity !== 'string') {
      throw new Error('the ErrorSnack requires all these attributes but at least one is missing: open, onCloseDispatchText, autoHideDuration, message');
    }
    return (
      <MuiThemeProvider theme={useStyles}>
        <Snackbar
          TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={message ? true : false}
          autoHideDuration={autoHideDuration === null ? null : autoHideDuration}
          onClose={() => this.props.dispatch({ type: onCloseDispatchText })}
        >
          <Alert
            onClose={() => this.props.dispatch({ type: onCloseDispatchText })}
            severity={severity}
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
