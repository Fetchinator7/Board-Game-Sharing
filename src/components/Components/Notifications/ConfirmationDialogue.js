import React from 'react';
import SearchTablePresets from '../GamesTable/GamesTable';
import { Button, MuiThemeProvider, createMuiTheme, Dialog, DialogTitle, DialogContentText, DialogContent, TextField, DialogActions } from "@material-ui/core";

// Import the style presets from my table preset.
const useStyles = createMuiTheme(
  SearchTablePresets.theme
);

// Preset dialogue to display in the center of the screen for confirming certain actions
// or submitting requests.
class Dialogue extends React.Component {
  state = {
    message: ''
  }
  render() {
    const { parentCallBackFunc, visible, title, showTextField, trueButtonAction } = this.props;
    // If visible is true dispaly this componet, but otherwise return null (to display nothing.)
    return (visible
      ? <>
        <MuiThemeProvider theme={useStyles}>
          <Dialog open={visible} onClose={() => parentCallBackFunc(false, 'clicked away ' + this.state.message )} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Any already existing loans will be deleted.
                This can't be undone!
              </DialogContentText>
              {showTextField &&
                <TextField
                  autoFocus
                  margin="dense"
                  label="Message"
                  type="text"
                  fullWidth
                  maxLength='10'
                  value={this.state.message}
                  onChange={
                    // Set maximum number of message characters to 1000.
                    event => event.target.value.length <= 1000 && this.setState({ message: event.target.value })
                  }
                />
              }
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => parentCallBackFunc(false, this.state.message)}
                color="secondary"
                variant="contained">
                Cancel
              </Button>
              <Button
                onClick={() => parentCallBackFunc(true, this.state.message)}
                color="primary"
                variant="contained">
                {trueButtonAction}
              </Button>
            </DialogActions>
          </Dialog>
        </MuiThemeProvider>
      </>
      : null
    );
  }
}

export default Dialogue;
