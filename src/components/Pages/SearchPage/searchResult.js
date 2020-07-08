import { Component } from 'react';
import './searchPage.css';
import { connect } from 'react-redux';

class SearchResult extends Component {
  state = {
    title: '',
    BGGid: '',
    playerRange: '',
    playTime: '',
    artwork: ''
  }

  componentDidMount() {
    const { gameObj } = this.props
    this.setState({
      title: this.getTitle(gameObj.name),
      BGGid: gameObj._attributes.id,
      playerRange: gameObj.minplayers
        ? this.formatRanges(gameObj.minplayers._attributes.value, gameObj.maxplayers._attributes.value, false)
        : null,
      playTime: gameObj.minplaytime
        ? this.formatRanges(gameObj.minplaytime._attributes.value, gameObj.maxplaytime._attributes.value, true)
        : null,
      artwork: gameObj.image && gameObj.image._text
    })
    const userOwnsGame = true;
    this.props.status.userIsSignedIn && this.setState({ owned: userOwnsGame })
    // TODO const userOwnsGame = this.props.dispatch({ type: "CHECK_IF_OWNED", payload: gameObj._attributes.id });;
    // const userOwnsGame = this.props.gamesGlobalState.games.ownedGames.some(userGameObj => userGameObj.bgg_game_id === gameObj._attributes.id)
  }

  getTitle = (boardgameNameObj) => {
    // debugger;
    if (boardgameNameObj.length) {
      for (const nameObj of boardgameNameObj) {
        if (nameObj._attributes.type === 'primary') {
          return nameObj._attributes.value;
        }
      }
      return 'Error, unable to find title';
    } else {
      // It only has one name/object so return that.
      return boardgameNameObj._attributes.value;
    }
  }

  formatRanges = (min, max, appendMinutes) => {
    const appendMinStr = ' Min';
    let returnStr = '';
    if (appendMinutes) {
      returnStr += appendMinStr
    }
    // 0-0 ---> Unknown.
    if (min === '0' && max === '0') {
      return 'Unknown';
      // 0-180 --> 180.
    } else if (min === '0' && max !== '0') {
      return `${max}${returnStr}`;
      // 180-0 --> 180.
    } else if (min !== '0' && max === '0') {
      return `${min}${returnStr}`;
      // 180-180 --> 180.
    } else if (min === max) {
      return `${min}${returnStr}`;
      // 30-180 --> return without formatting.
    } else {
      return `${min}-${max}${returnStr}`;
    }
  }

  render() {
    this.props.dispatch({ type: 'SET_FORMATTED_SEARCH_GAMES', payload: this.state });
    return null;
  }
}

const mapStateToProps = reduxState => ({
  gamesGlobalState: reduxState.games,
  status: reduxState.status
});

export default connect(mapStateToProps)(SearchResult);
