import React, { Component } from 'react';
import { connect } from 'react-redux';

class UserPage extends Component {

  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_A_DIFFERENT_USER', payload: this.props.match.params.userName });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'CLEAR_A_DIFFERENT_USERS_OWNED_GAMES' });
  }

  render() {
    return (
      <>
        {`This is ${this.props.match.params.userName}'s logged out page`}
      </>
    );
  }
}
export default connect()(UserPage);
