import React, { Component } from 'react';
import { connect } from 'react-redux';
import Snack from '../../Components/Snack';
import TablePresets from '../../Components/GamesTable/GamesTable';
import { TextField, createMuiTheme, MuiThemeProvider, Input } from '@material-ui/core';

const useStyles = createMuiTheme(
  TablePresets.theme
);

class RegisterPage extends Component {
  state = {
    username: '',
    password: '',
    email: ''
  };

  registerUser = (event) => {
    event.preventDefault();

    if (this.state.username && this.state.password && this.state.email) {
      this.props.dispatch({
        type: 'REGISTER',
        payload: {
          username: this.state.username,
          password: this.state.password,
          email: this.state.email
        },
      });
    } else {
      this.props.dispatch({ type: 'REGISTRATION_INPUT_ERROR' });
    }
  }

  render() {
    return (
      <>
        <Snack
          onCloseDispatchText='CLEAR_REGISTRATION_ERROR'
          autoHideDurationSeconds={20}
          message={this.props.errors.registrationMessage}
          severity='error'
        />
        <MuiThemeProvider theme={useStyles}>
          <form autoComplete="off" onSubmit={this.registerUser}>
            <>
              <TextField
                label="username"
                fullWidth
                required
                maxLength='10'
                value={this.state.username}
                onChange={
                  // Set maximum number of message characters to 100.
                  event => event.target.value.length <= 100 && this.setState({ username: event.target.value })
                }
              />
              <TextField
                label="email"
                fullWidth
                required
                maxLength='10'
                value={this.state.email}
                onChange={
                  // Set maximum number of message characters to 100.
                  event => event.target.value.length <= 100 && this.setState({ email: event.target.value })
                }
              />
              <TextField
                label="password"
                fullWidth
                required
                maxLength='10'
                type="password"
                autoComplete="current-password"
                value={this.state.password}
                onChange={
                  // Set maximum number of message characters to 100.
                  event => event.target.value.length <= 100 && this.setState({ password: event.target.value })
                }
              />
              <Input
                // type='submit'
                className="register"
                type="submit"
                name="submit"
                value="Register"
                variant="contained"
                color="primary"
              >
              </Input>
            </>
          </form>
        </MuiThemeProvider>
      </>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapStateToProps = state => ({
  errors: state.errors,
});

export default connect(mapStateToProps)(RegisterPage);

