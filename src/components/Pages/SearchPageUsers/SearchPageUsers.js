import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, TextField } from "@material-ui/core";
import Snack from '../../Components/Snack';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '../../Components/UserTable/UserResultsTable';

class SearchPage extends Component {
  state = {
    search: '',
  }

  searchInput = () => {
    this.props.dispatch({ type: "FETCH_USERS", payload: this.state.search })
    this.setState({
      search: '',
    })
  }

  render() {
    return (
      <>
        <TextField
          variant="outlined"
          autoFocus
          value={this.state.search}
          type="text"
          maxLength={1000}
          onChange={(event) => {
            this.setState({
              search: event.target.value
            })
          }}
          onKeyPress={(event) => {
            if (event.key === 'Enter' && this.state.search) {
              this.searchInput()
              event.preventDefault();
            }
          }}
        />
        {this.props.loading && <CircularProgress />}
        <br />
        <Button
          variant="contained"
          color="primary"
          disabled={!this.state.search}
          onClick={this.searchInput}
        >
          Search
        </Button>
        {/* Don't show the current user in the search results. */}
        <Table tableData={this.props.searchUsers.usersSearchResults.filter(searchResultUser => searchResultUser.user_id !== this.props.userID)} />
        <Snack
          onCloseDispatchText='RESET_USER_SEARCH__USER_NOT_FOUND'
          autoHideDuration={10000}
          message={this.props.searchUsers.noResultsErrorText}
          severity={'error'}
        />
      </>
    );
  }
}

const mapStateToProps = reduxState => ({
  searchUsers: reduxState.searchUsers,
  loading: reduxState.status.loading,
  userID: reduxState.user.userAttributes.user_id
});

export default connect(mapStateToProps)(SearchPage);
