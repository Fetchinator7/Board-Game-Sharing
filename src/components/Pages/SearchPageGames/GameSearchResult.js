// This is a functional component that takes in the response from boardgamegeek.com and foramts
// it into the format the database is expecting.
const SearchResult = (gameObj, ownedGamesArr) => {
  return ({
    owned: ownedGamesArr.some(userGameObj => userGameObj.bgg_game_id === gameObj._attributes.id),
    title: getTitle(gameObj.name),
    bgg_game_id: gameObj._attributes.id,
    player_range: gameObj.minplayers
      ? formatRanges(gameObj.minplayers._attributes.value, gameObj.maxplayers._attributes.value, false)
      : null,
    playtime: gameObj.minplaytime
      ? formatRanges(gameObj.minplaytime._attributes.value, gameObj.maxplaytime._attributes.value, true)
      : null,
    game_img: gameObj.image && gameObj.image._text
  });
};

const getTitle = (boardgameNameObj) => {
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
};

const formatRanges = (min, max, appendMinutes) => {
  const appendMinStr = ' Min';
  let returnStr = '';
  if (appendMinutes) {
    returnStr += appendMinStr;
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
};

export default SearchResult;
