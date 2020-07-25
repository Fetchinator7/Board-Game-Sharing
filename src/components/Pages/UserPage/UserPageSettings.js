import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
import Snack from '../../Components/Snack';

class UserSettings extends Component {
  changeVisibility(newVisibilityInt) {
    this.props.dispatch({
      type: 'CHANGE_USERS_PROFILE_VISIBILITY',
      payload: {
        newVisibility: newVisibilityInt
      }
    });
  }

  render() {
    return (
      // TODO put this in a paper component.
      <div className='profileText'>
        Profile Visibility
        {/* Show radio buttons which allow the user to change their profile visibility. */}
        <FormControl component='fieldset'>
          {/* <FormLabel component='legend' className='profileText'>Profile Visibility</FormLabel> */}
          <RadioGroup aria-label='settings' name='settings1' value={this.props.user.userAttributes.visibility} onChange={event => this.changeVisibility(event.target.value)}>
            <FormControlLabel value={1} control={<Radio />} label='Public' />
            <FormControlLabel value={2} control={<Radio />} label='Only Those With The Profile Link' />
            {/* <FormControlLabel value={3} control={<Radio />} label='Friends Only' /> */}
            <FormControlLabel value={4} control={<Radio />} label='Private' />
          </RadioGroup>
        </FormControl>
        <Snack
          onCloseDispatchText='CLEAR_EDIT_GAMES_ERROR'
          autoHideDurationSeconds={null}
          message={this.props.errors.editGamesMessage}
          severity='error'
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  errors: state.errors
});

export default connect(mapStateToProps)(UserSettings);
