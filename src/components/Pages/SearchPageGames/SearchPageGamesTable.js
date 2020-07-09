import React from 'react';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { updateOwnedStatus } from '../../Components/GamesTable/GamesTableOperations';
import SearchTablePresets from '../../Components/GamesTable/GamesTable';
import MUIDataTable from 'mui-datatables';
import { MuiThemeProvider } from '@material-ui/core';

class Table extends React.Component {
  render() {
    const baseData = this.props.searchBGG.formattedGameSearchResults.map((gameObj, index) => [
      <img src={gameObj.artwork} alt={gameObj.title} key={`game-result-artwork-${index}`} />,
      gameObj.title,
      <a key={`game-table-row-${index}`} id={gameObj.BGGid} href={`https://boardgamegeek.com/boardgame/${gameObj.BGGid}`}>More Info</a>,
      gameObj.playerRange,
      gameObj.playTime
      ]);
    let fullData = baseData;
    const columns = [...SearchTablePresets.columns];
    if (this.props.userStatus.userIsSignedIn) {
      columns.unshift(
        {
          name: 'Owned',
          options: {
            filter: true,
            customBodyRender: (value = false, tableMeta) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox color='primary' checked={value.props.checked} value={value.props.checked} />
                  }
                  onClick={() => {
                    updateOwnedStatus(value.props.checked, tableMeta.rowData[SearchTablePresets.moreInfoColumnIndex].props.id);
                  }}
                />
              );
            }
          }
        }
      );
      fullData = this.props.searchBGG.formattedGameSearchResults.map((gameObj, index) => {
        return [<Checkbox color='primary' checked={gameObj.owned} key={`game-search-table-row-${index}`} />, ...baseData[index]];
      });
    }

    return (
      <MuiThemeProvider theme={SearchTablePresets.theme}>
        <MUIDataTable title='Search Page' data={fullData} columns={columns} options={SearchTablePresets.options} />
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = reduxState => ({
  searchBGG: reduxState.searchBGG,
  userStatus: reduxState.status
});

export default connect(mapStateToProps)(Table);
