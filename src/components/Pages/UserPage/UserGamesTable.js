import React from 'react';
import { connect } from 'react-redux';
import baseGamesDataArray from '../../Components/GamesTable/GamesTableStandardColumns';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SearchTablePresets from '../../Components/GamesTable/GamesTable';
import MUIDataTable from 'mui-datatables';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { MuiThemeProvider, createMuiTheme, TableRow, TextField } from '@material-ui/core';
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
    showDialogue: false,
    inEditingMode: false,
    edited: false,
    allGames: []
  }

  confirmBeforeDeleting = (proceedBool, message) => {
    console.log(message);
    this.updateGamesComments();
    this.setState({ showDialogue: false })
    if (proceedBool) {
      this.props.dispatch({ type: 'DELETE_USER_OWNED_GAME', payload: this.state.bodyObj });
    }
    this.setState({
      // The game was deleted from the server, but not yet so delete it from local state to match the server.
      allGames: this.props.usersGames.filter(game => game.game_id !== this.state.bodyObj.dataBaseGameID),
      bodyObj: {},
      gameTitle: '',
      showDialogue: false
    })
  }

  updateGamesComments = () => {
    if (this.state.edited) {
      const editedGames = this.state.allGames.map((game, index) => {
        return Object.is(game, this.props.usersGames[index]) && game !== {} ? false : this.state.allGames[index]
      });
      editedGames.map(editedGameObj =>
        editedGameObj && this.props.dispatch({ type: 'COMMENT_USER_OWNED_GAME', payload: editedGameObj })
      )
    }
  }

  componentDidMount() {
    this.setState({ allGames: this.props.usersGames })
  }

  componentWillUnmount() {
    this.updateGamesComments();
  }

  render() {
    const baseData = baseGamesDataArray(this.state.allGames);
    let fullData = baseData;
    const columns = [...SearchTablePresets.columns];
    let options = SearchTablePresets.options;
    columns.push(
      this.state.inEditingMode
        ? {
          name: 'Comments',
          options: {
            filter: true,
            sort: true,
            customBodyRender: (value, tableMeta) => {
              return (
                <FormControlLabel
                  onBlur={event => {
                    const text = event.target.value
                    this.setState({
                      allGames: this.state.allGames.map((gameObj, index) => tableMeta.rowIndex === index ? { ...gameObj, comments: text } : gameObj),
                      edited: true
                    }, () => {
                      this.updateGamesComments();
                    })}
                  }
                  control={
                    <TextField color='primary' defaultValue={value} />
                  }
                />
              );
            }
          }
        }
      : {
        name: 'Comments',
        options: {
          filter: true,
          sort: true,
        }
      },
      {
        name: 'Edit',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value = false) => {
            return (
              <FormControlLabel
                control={
                  <EditIcon color='primary' />
                }
                onClick={() => {
                  this.setState({ inEditingMode: !this.state.inEditingMode });
                }}
              />
            );
          }
        }
      },
      {
        name: 'Delete',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value = false) => {
            return (
              <FormControlLabel
                control={
                  <DeleteIcon color='secondary' />
                }
                onClick={() => {
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
        expandableRowsOnClick: false,
        renderExpandableRow: (rowData, rowMeta) => {
          const colSpan = rowData.length + 0;
          return (
            <TableRow>
              <TableCell colSpan={colSpan}>
                <DatePicker
                  mode='request'
                  loanDaysArray={this.state.allGames[rowMeta.rowIndex].loans}
                  gameID={this.state.allGames[rowMeta.rowIndex].game_id}
                  gameTitle={this.state.allGames[rowMeta.rowIndex].title}
                  ownerID={this.props.userID}
                />
              </TableCell>
            </TableRow>
          );
        }
      };
      fullData = this.state.allGames.map((gameObj, index) => {
        return (
          [...baseData[index],
          gameObj.comments,
            <DeleteIcon
              game_id={gameObj.game_id}
              title={gameObj.title}
              color='secondary'
              key={`game-search-table-row-${index}`}
            />,
            <EditIcon
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
          <MUIDataTable title='Your Games!' data={fullData} columns={columns} options={options} />
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
