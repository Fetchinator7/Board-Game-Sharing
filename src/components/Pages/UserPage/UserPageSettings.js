import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchTablePresets from '../../Components/GamesTable/GamesTable';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
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

  changeVisibility(newVisibilityInt) {
    console.log('change profile visibility to:', newVisibilityInt);
    // this.props.dispatch({ type: 'SET_USER_PROFILE_VISIBILITY', payload: newVisibilityInt });
  }

  render() {
    return (
      <>
        <FormControl component='fieldset'>
          <FormLabel component='legend'>Profile Visibility</FormLabel>
          <RadioGroup aria-label='settings' name='settings1' value={this.props.user.userAttributes.visibility} onChange={event => this.changeVisibility(event.target.value)}>
            <FormControlLabel value={1} control={<Radio />} label='Public' />
            <FormControlLabel value={2} control={<Radio />} label='Only Those With The Profile Link' />
            <FormControlLabel value={3} control={<Radio />} label='Friends Only' />
            <FormControlLabel value={4} control={<Radio />} label='Private' />
          </RadioGroup>
        </FormControl>
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
export default connect(mapStateToProps)(UserPage);
