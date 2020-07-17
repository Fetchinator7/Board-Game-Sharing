const allDataBaseGames = (state = [], action) => {
  switch (action.type) {
    case 'SET_ALL_DATABASE_GAMES':
      return action.payload;
    default:
      return state;
  }
};

export default allDataBaseGames;
