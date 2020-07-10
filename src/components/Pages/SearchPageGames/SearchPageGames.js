import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, TextField } from "@material-ui/core";
import ErrorSnack from '../../Components/Errors/ErrorSnack';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchResult from './GameSearchResult';
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
        {
          <TextField
            variant="outlined"
            value={this.state.search}
            type="text"
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
            onKeyPress={(event) => {
              // If there's text to search for and the user pressed enter search BBG.
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
        <Paper className={'paper'}>
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
          {this.props.searchBGG.rawGameSearchResults.map((gameObj, index) =>
            <SearchResult gameObj={gameObj} key={`search-result-row-${index}`}/>
            )}
        <Table />
        <ErrorSnack
          openIfText={this.props.searchBGG.noResultsErrorText}
          onCloseDispatchText='RESET_GAME_SEARCH__GAME_NOT_FOUND'
          autoHideDuration={10000}
          message={this.props.searchBGG.noResultsErrorText}
        />
      </>
    );
  }
}

const mapStateToProps = reduxState => ({
  searchBGG: reduxState.searchBGG,
  loading: reduxState.status.loading
});

export default connect(mapStateToProps)(SearchPage);
