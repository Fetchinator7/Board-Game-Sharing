import React, { Component } from 'react';

class UserPage extends Component {

  // componentWillMount() {
  //   this.props.history.goBack();
  // }

  render() {
    return (
      <>
        {`This is ${this.props.match.params.userName}'s logged out page`}
      </>
    );
  }
}
export default UserPage;
