import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Snack from '../../Components/Snack';

class UserPage extends Component {
  changeVisibility(newVisibilityInt) {
    console.log('change profile visibility to:', newVisibilityInt);
    this.props.dispatch({
      type: 'CHANGE_USERS_PROFILE_VISIBILITY',
      payload: {
        userID: this.props.user.userAttributes.user_id,
        newVisibility: newVisibilityInt
      }
    });
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
        <Snack
          onCloseDispatchText='CLEAR_EDIT_GAMES_ERROR'
          autoHideDuration={null}
          message={this.props.errors.editGamesMessage}
          severity='error'
        />
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
