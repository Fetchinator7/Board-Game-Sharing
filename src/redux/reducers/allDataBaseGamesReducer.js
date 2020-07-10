const allDataBaseGames = (state = [], action) => {
  switch (action.type) {
    case 'SET_ALL_DATABASE_GAMES':
      return action.payload;
    default:
      return state;
  }
};

// loginMode will be on the redux state at:
// state.loginMode
export default allDataBaseGames;
