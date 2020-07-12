import React from 'react';

const Table = baseDataArray => {
  const baseData = baseDataArray.map((gameObj, index) => [
    <img src={gameObj.game_img} alt={gameObj.title} key={`game-result-artwork-${index}`} />,
    gameObj.title,
    <a key={`game-table-row-${index}`} id={gameObj.bgg_game_id} href={`https://boardgamegeek.com/boardgame/${gameObj.bgg_game_id}`}>More Info</a>,
    gameObj.player_range,
    gameObj.playtime
  ]);
  return (
    baseData
  );
};

export default Table;
