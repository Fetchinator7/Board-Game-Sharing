import React from 'react';
import { connect } from 'react-redux';
import baseGamesDataArray from '../../Components/GamesTable/GamesTableStandardColumns';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SearchTablePresets from '../../Components/GamesTable/GamesTable';
import MUIDataTable from 'mui-datatables';
import DeleteIcon from '@material-ui/icons/Delete';
import { MuiThemeProvider, createMuiTheme, TableRow } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import ConfirmationDialogue from '../../Components/Notifications/ConfirmationDialogue';
import DatePicker from '../../Components/DatePicker/DatePicker';

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
    let options = SearchTablePresets.options;
    columns.push(
      {
        name: 'Comments',
        options: {
          filter: true,
          sort: true
        }
      },
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

    if (this.props.userIsSignedIn) {
      options = {
        ...options,
        isRowExpandable: () => true,
        filter: true,
        filterType: 'dropdown',
        responsive: 'standard',
        expandableRows: true,
        expandableRowsHeader: false,
        expandableRowsOnClick: true,
        renderExpandableRow: (rowData, rowMeta) => {
          const colSpan = rowData.length + 1;
          return (
            <TableRow>
              <TableCell colSpan={colSpan}>
                <DatePicker
                  mode='request'
                  loanDaysArray={this.props.usersGames[rowMeta.rowIndex].loans}
                  gameID={this.props.usersGames[rowMeta.rowIndex].game_id}
                  ownerID={this.props.userID}
                />
              </TableCell>
            </TableRow>
          );
        }
      };
      fullData = this.props.usersGames.map((gameObj, index) => {
        return (
          [...baseData[index],
            gameObj.comments,
          <DeleteIcon
            game_id={gameObj.game_id}
            title={gameObj.title}
            color='secondary'
            key={`game-search-table-row-${index}`}
          />]
        )
      });
    }


    return (
      <>
        <MuiThemeProvider theme={useStyles}>
          <MUIDataTable title='Search Page' data={fullData} columns={columns} options={options} />
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
  usersGames: reduxState.user.ownedGames,
  userIsSignedIn: reduxState.status.userIsSignedIn,
  userID: reduxState.user.userAttributes.user_id
});

export default connect(mapStateToProps)(Table);
