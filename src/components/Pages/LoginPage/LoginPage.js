import React, { Component } from 'react';
import { connect } from 'react-redux';
import Snack from '../../Components/Snack';
import TablePresets from '../../Components/GamesTable/GamesTable';
import { TextField, createMuiTheme, MuiThemeProvider, Button } from '@material-ui/core';

const useStyles = createMuiTheme(
  TablePresets.theme
);

class LoginPage extends Component {
  state = {
    username: '',
    password: '',
  };

  login = (event) => {
    event.preventDefault();

    if (this.state.username && this.state.password) {
      this.props.dispatch({
        type: 'LOGIN',
        payload: {
          username: this.state.username,
          password: this.state.password,
        },
      });
    } else {
      this.props.dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  }

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  render() {
    return (
      <>
        <Snack
          onCloseDispatchText='CLEAR_LOGIN_ERROR'
          autoHideDuration={null}
          message={this.props.errors.loginMessage}
          severity='error'
        />
        <MuiThemeProvider theme={useStyles}>
          <form autoComplete="off" onSubmit={this.login}>
            <>
              <TextField
                label="username"
                fullWidth
                required
                maxLength='10'
                value={this.state.username}
                onChange={this.handleInputChangeFor('username')}
              />
              <TextField
                label="password"
                fullWidth
                required
                maxLength='10'
                type="password"
                autoComplete="current-password"
                value={this.state.password}
                onChange={this.handleInputChangeFor('password')}
              />
              <Button
                className="register"
                type="submit"
                color="primary"
                variant='contained'
              > Log In
              </Button>
              <Button
                type="button"
                className="link-button"
                variant='contained'
                onClick={() => { this.props.dispatch({ type: 'SET_TO_REGISTER_MODE' }) }}
              > Register
              </Button>
            </>
          </form>
        </MuiThemeProvider>
      </>
    );
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
});

export default connect(mapStateToProps)(LoginPage);
