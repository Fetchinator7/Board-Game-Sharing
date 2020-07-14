import React from 'react';
import { connect } from 'react-redux';
import baseGamesDataArray from '../../Components/GamesTable/GamesTableStandardColumns';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SearchTablePresets from '../../Components/GamesTable/GamesTable';
import MUIDataTable from 'mui-datatables';
import DeleteIcon from '@material-ui/icons/Delete';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import ConfirmationDialogue from '../../Components/Notifications/ConfirmationDialogue';

const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

class Table extends React.Component {
  state = {
    gameTitle: '',
    bodyObj: {},
    showDialogue: false
  }

  confirmBeforeDeleting = (proceedBool, message) => {
    console.log(message);
    this.setState({ showDialogue: false })
    console.log('proceedBool', proceedBool);
  }

  render() {
    const baseData = baseGamesDataArray(this.props.usersGames);
    let fullData = baseData;
    const columns = [...SearchTablePresets.columns];
    columns.push(
      {
        name: 'Edit',
        options: {
          filter: true,
          customBodyRender: (value = false) => {
            return (
              <FormControlLabel
                control={
                  <DeleteIcon color='secondary' />
                }
                onClick={() => {
                  console.log(value);
                  const bodyObj = {
                    dataBaseGameID: value.props.game_id
                  };
                  this.setState({ gameTitle: value.props.title, showDialogue: true, bodyObj: bodyObj });
                }}
              />
            );
          }
        }
      }
    );
    fullData = this.props.usersGames.map((gameObj, index) => {
      return (
      [...baseData[index],
      <DeleteIcon
        game_id={gameObj.game_id}
        title={gameObj.title}
        color='secondary'
        key={`game-search-table-row-${index}`}
      />]
   )});

    return (
      <>
        <MuiThemeProvider theme={useStyles}>
          <MUIDataTable title='Search Page' data={fullData} columns={columns} options={SearchTablePresets.options} />
        </MuiThemeProvider>
        <ConfirmationDialogue
          parentCallBackFunc={this.confirmBeforeDeleting}
          visible={this.state.showDialogue}
          title={`Are you sure you want to delete your game "${this.state.gameTitle}"?`}
          trueButtonAction={'Proceed'}
          showTextField={false}
        />
      </>
    );
  }
}

const mapStateToProps = reduxState => ({
  usersGames: reduxState.user.ownedGames
});

export default connect(mapStateToProps)(Table);
