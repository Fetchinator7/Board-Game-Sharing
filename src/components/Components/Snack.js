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

// This snack shows up at the top of the screen to give the user status updates.
class UserPage extends Component {
  render() {
    const { onCloseDispatchText, autoHideDurationSeconds, message, severity } = this.props;
    if (!onCloseDispatchText || typeof message !== 'string' || typeof severity !== 'string') {
      throw new Error('the ErrorSnack requires all these attributes but at least one is missing: onCloseDispatchText, autoHideDurationSeconds, message, severity');
    }
    return (
      <MuiThemeProvider theme={useStyles}>
        <Snackbar
          TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={message ? true : false}
          // Multiply the input seconds by 1000 to get the right seconds format for material ui.
          autoHideDuration={autoHideDurationSeconds === null ? null : autoHideDurationSeconds * 1000}
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

export default connect()(UserPage);
