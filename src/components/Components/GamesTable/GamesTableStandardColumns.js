import React from 'react';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import { Button } from '@material-ui/core';

const Table = baseDataArray => {
  const baseData = baseDataArray.map((gameObj, index) => [
    <img src={gameObj.game_img} alt={gameObj.title} key={`game-result-artwork-${index}`} />,
    gameObj.title,
    <Button
      key={`game-table-row-${index}`}
      href={`https://boardgamegeek.com/boardgame/${gameObj.bgg_game_id}`}
      color='primary'
      variant='contained'
      startIcon={<OpenInBrowserIcon />}
    > More Info
    </Button>,
    gameObj.player_range,
    gameObj.playtime
  ]);
  return (
    baseData
  );
};

export default Table;
