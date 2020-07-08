import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchTablePresets from '../../Components/GamesTable/GamesTable';
import { Button, TextField, MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from './SearchPageUsersTable';

const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class SearchPage extends Component {
  state = {
    search: '',
    showErrorMessage: false,
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
        <Table />
        <MuiThemeProvider theme={useStyles}>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={this.props.searchUsers.noResultsErrorText}
            autoHideDuration={10000}
            onClose={() => this.props.dispatch({ type: "RESET_USER_SEARCH__USER_NOT_FOUND" })}
          >
            <Alert
              onClose={() => this.props.dispatch({ type: "RESET_USER_SEARCH__USER_NOT_FOUND" })}
              severity="error"
            >
              {this.props.searchUsers.noResultsErrorText}
              {this.state.noResultsText}
            </Alert>
          </Snackbar>
        </MuiThemeProvider>
      </>
    );
  }
}

const mapStateToProps = reduxState => ({
  searchUsers: reduxState.searchUsers,
  loading: reduxState.status.loading
});

export default connect(mapStateToProps)(SearchPage);
