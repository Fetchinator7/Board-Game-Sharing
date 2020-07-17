import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, TextField,  } from "@material-ui/core";
import Snack from '../../Components/Snack';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import CircularProgress from '@material-ui/core/CircularProgress'
import Table from './SearchPageGamesTable';
import './SearchPageGames.css';

class SearchPage extends Component {
  state = {
    search: ''
  }

  searchInput = () => {
    this.props.dispatch({ type: "FETCH_GAMES", payload: this.state.search, searchType: 'games' });
    this.setState({
      search: ''
    })
  };

  render() {
    return (
      <>
          {/* When a user inputs text into the search bar and it's >= 4 characters search BGG
          to return the titles of all the games that match the input even though the user hasn't
          clicked search yet. */}
          <TextField
            variant="outlined"
            value={this.state.search}
            type="text"
            autoFocus
            maxLength={1000}
            onChange={(event) => {
              event.persist()
              this.setState({
                search: event.target.value
              }, () => {
                this.props.dispatch({ type: "FETCH_GAMES", payload: event.target.value, searchType: 'titles' });
              })
            }
            }
            // If there's text to search for and the user pressed enter search BGG.
            onKeyPress={(event) => {
              if (event.key === 'Enter' && this.state.search) {
                this.searchInput()
                event.preventDefault();
              }
            }}
          />
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
        <Paper className={'paper'}>
          {/* Show all the results of BGG game titles that match what's in the search field. */}
          <MenuList>
            {this.props.searchBGG.searchTitles.map((titleResultObj, index) =>
              <MenuItem
                key={`title-search-result-${index}`}
                onClick={() =>
                  this.setState({
                    search: ''
                  }, () => {
                    this.props.dispatch({ type: "FETCH_GAME_DETAILS", payload: [titleResultObj._attributes.id] });
                  }
                  )
                }>{titleResultObj.name._attributes.value}</MenuItem>
            )}
          </MenuList>
        </Paper>
        <Table />
        {/* Status snacks. */}
        <Snack
          onCloseDispatchText='RESET_GAME_SEARCH__GAME_NOT_FOUND'
          autoHideDuration={10000}
          message={this.props.searchBGG.noResultsErrorText}
          severity={'error'}
        />
        <Snack
          onCloseDispatchText='CLEAR_EDIT_GAMES_ERROR'
          autoHideDuration={10000}
          message={this.props.errors.editGamesMessage}
          severity={'error'}
        />
      </>
    );
  }
}

const mapStateToProps = reduxState => ({
  searchBGG: reduxState.searchBGG,
  loading: reduxState.status.loading,
  errors: reduxState.errors
});

export default connect(mapStateToProps)(SearchPage);