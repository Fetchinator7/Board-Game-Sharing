import React from 'react';

const Table = baseDataArray => {
  console.log('baseDataArray', baseDataArray);
  const baseData = baseDataArray.map((gameObj, index) => [
    <img src={gameObj.artwork} alt={gameObj.title} key={`game-result-artwork-${index}`} />,
    gameObj.title,
    <a key={`game-table-row-${index}`} id={gameObj.BGGid} href={`https://boardgamegeek.com/boardgame/${gameObj.BGGid}`}>More Info</a>,
    gameObj.playerRange,
    gameObj.playTime
  ]);
  console.log('baseData:', baseData);
  return (
    baseData
  );
};

export default Table;
