import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, TextField } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from './SearchPageUsersTable';

class SearchPage extends Component {
  state = {
    search: ''
  }

  searchInput = () => {
    this.props.dispatch({ type: "FETCH_USERS", payload: this.state.search });
    this.setState({
      search: ''
    })
  };

  render() {
    return (
      <>
        {
          <TextField
            variant="outlined"
            value={this.state.search}
            type="text"
            maxLength={1000}
            onChange={(event) => {
              this.setState({
                search: event.target.value
            })}}
            onKeyPress={(event) => {
              if (event.key === 'Enter' && this.state.search) {
                this.searchInput()
                event.preventDefault();
              }
            }}
          />
        }
        {this.props.loading && <CircularProgress />}
        {<br />}
        {
          <Button
            variant="contained"
            color="primary"
            disabled={!this.state.search}
            onClick={this.searchInput}
          >
            Search
          </Button>
        }
        {<Table />}
      </>
    );
  }
}

const mapStateToProps = reduxState => ({
  searchUsers: reduxState.searchUsers,
  loading: reduxState.status.loading
});

export default connect(mapStateToProps)(SearchPage);
