import { createMuiTheme } from '@material-ui/core';

const tablePreferences = {
  moreInfoColumnIndex: 3,
  columns: [
    {
      name: 'Artwork',
      options: {
        filter: false,
        sort: false
      }
    },
    {
      name: 'Name',
      options: {
        filter: true
      }
    },
    {
      name: 'More Info',
      options: {
        filter: false,
        sort: false
      }
    },
    {
      name: 'Player Range',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'Play Time',
      options: {
        filter: true,
        sort: false
      }
    }
  ],
  options: {
    selectableRows: 'none',
    responsive: 'standard',
    print: false,
    download: false,
    filter: true,
    filterType: 'dropdown'
  },
  theme: createMuiTheme({
    palette: { type: 'dark' },
    typography: { useNextVariants: true }
  })
};

export default tablePreferences;