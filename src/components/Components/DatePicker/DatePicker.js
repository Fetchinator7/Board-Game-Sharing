import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, Button, TextField } from "@material-ui/core";
import { Badge } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

const materialTheme = createMuiTheme({
  palette: {
    type: 'dark'
  },
    MuiPickersModal: {
      dialogAction: {
        color: '#757ce8',
      }
    }
});

class DateAndTimePickers extends React.Component {
  state = {
    // The dispatch type can either be request or block out so store that here in local state.
    dispatchTypeStr: '',
    // Controls if the calender window is visible.
    selectionWindowOpen: false,
    // Set the default start and end day to today.
    start: moment().format('yyyy-MM-DD'),
    end: moment().format('yyyy-MM-DD'),
    // Controls if the error message is visible.
    showErrorMessage: false,
    // What to display in the error message (such as how they can't select overlapping times.)
    message: '',
    // These arrays determine which (if any) badge will be displayed with a day.
    // requestedDays is the question mark.
    requestedDays: [],
    // blockOutDays is the prohibited badge. 
    blockOutDays: [],
    // acceptedLoanDays is the check mark.
    acceptedLoanDays: []
  }

  componentDidMount() {
    // This is a prop that gets passed in from the parent to say if the calendar should be
    // in request mode (requesting a different user's game) or block out.
    // (the user can exclude loan days) mode.
    const dateSetMode = this.props.mode;
    // This is the array that comes with a game object containing all the loans days for said game.
    const { loanDaysArray } = this.props;
    // These are temporary arrays to store which type of day to block out which are set
    // to the local state after the arrays have been flattened.
    const requestedDays = [];
    const blockOutDays = [];
    const acceptedLoanDays = [];
    // This function takes in two moment objects and returns a string for each day in between
    // those two days. This is because the calendar needs days to be explicitly specified
    // to block them out, but the database can just store the start and end date.
    function getDaysBetween(start, end) {
      const daysArr = [start.format('yyyy-MM-DD')];
      // Get an int of the difference between days, such as "-3".
      const dif = moment(end).diff(moment(start), 'days')
      if (dif !== 0) {
        for (let index = 0; index < dif; index++) {
          // There is a date range (as apposed to one day loans) so run a for loop to get the
          // days in between. Get the next day by adding one to the current day index.
          daysArr.push(moment(start, 'yyyy-MM-DD').add(index + 1, 'days').format('yyyy-MM-DD'));
        }
      }
      return daysArr;
    }
    for (const gameLoan of loanDaysArray) {
      const daysBetweenLoanStartAndEnd = getDaysBetween(moment(gameLoan.loan_start), moment(gameLoan.loan_end));
      // Skip this loop because the owner declined this loan (block out day).
      if (gameLoan.friend_id === null) {
        blockOutDays.push(daysBetweenLoanStartAndEnd);
      // The owner declined this loan so see if the current user is the user who had the loan declined.
      // If they are then don't let them select the same days again.
      } else if (gameLoan.agreed === false && gameLoan.viewed === true) {
        if (gameLoan.friend_id === this.props.currentUserID) {
          blockOutDays.push(daysBetweenLoanStartAndEnd);
        }
      } else if (gameLoan.agreed === true) {
        acceptedLoanDays.push(daysBetweenLoanStartAndEnd);
      } else {
        requestedDays.push(daysBetweenLoanStartAndEnd);
      }
    }
    let dispatchTypeStr;
    // Set the mode this component is in (request or block out).
    if (dateSetMode === 'request') {
      dispatchTypeStr = 'SET_LOAN_REQUEST_TIME_FRAME';
    } else if (dateSetMode === 'blockOut') {
      dispatchTypeStr = 'SET_BLOCK_OUT_TIME_FRAME';
    } else {
      throw new Error(`The DatePicker component only accepts modes of "request" and "blockOut" not "${dateSetMode}"`);
    }
    // Set the local state to the arrays generated by this function after flattening them.
    this.setState({
      dispatchTypeStr: dispatchTypeStr,
      requestedDays: requestedDays.flat(),
      blockOutDays: blockOutDays.flat(),
      acceptedLoanDays: acceptedLoanDays.flat(),
    })
    // If today is an invalid day change the starting values to null. The calendar will
    // automatically start with the next eligible day after it's clicked.
    if (this.state.blockOutDays.includes(moment().format('yyyy-MM-DD')) || this.state.acceptedLoanDays.includes(moment().format('yyyy-MM-DD'))) {
      this.setState({ start: null, end: null })
    }
  }

  dispatchLoanRequest = () => {
    // Dispatch to saga which will do a post to the loan requests.
    const { gameID, ownerID, gameTitle } = this.props;
    this.props.dispatch({
      type: this.state.dispatchTypeStr,
      payload: {
        message: this.state.message,
        gameID: gameID,
        gameTitle: gameTitle,
        otherUserID: ownerID,
        startDate: this.state.start,
        endDate: this.state.end
    }})
  }

  // Confirm that the user isn't trying to select a time range that overlaps when someone
  // else is borrowing this game.
  checkIfValidBorrowingRange = (date) => {
    const isInAcceptedLoanRange = this.state.acceptedLoanDays.some(loanDay =>
      moment(loanDay).isBetween(this.state.start, date)
    )
    const isInBlockOutRange = this.state.blockOutDays.some(loanDay =>
      moment(loanDay).isBetween(this.state.start, date)
    )
    if (isInAcceptedLoanRange || isInBlockOutRange) {
      this.setState({ showErrorMessage: true })
    } else {
      this.setState({ end: date })
    }
  }

  // This makes a custom component to render a day of the month adding the badges if appropriate.
  renderDay = (day, isInCurrentMonth, dayComponent) => {
    const isRequestedLoanDay = isInCurrentMonth && this.state.requestedDays.includes(day.format('yyyy-MM-DD'));
    const isBlockedOutDay = isInCurrentMonth && this.state.blockOutDays.includes(day.format('yyyy-MM-DD'));
    const isAcceptedLoanDay = isInCurrentMonth && this.state.acceptedLoanDays.includes(day.format('yyyy-MM-DD'));
    return <Badge badgeContent={isBlockedOutDay ? '🚫' : isAcceptedLoanDay ? '✅' : isRequestedLoanDay ? '❓' : null}>{dayComponent}</Badge>;
    // https://emojipedia.org/prohibited/
    // https://emojipedia.org/check-mark-button/
    // https://emojipedia.org/question-mark/
  }

  // Check if a date should be disabled because it's in any of the block out day arrays.
  // TODO make this cleaner.
  shouldDisableDate = (day) => {
    return this.state.blockOutDays.includes(day.format('yyyy-MM-DD')) || this.state.acceptedLoanDays.includes(day.format('yyyy-MM-DD')) || this.state.requestedDays.includes(day.format('yyyy-MM-DD'))
  }

  render() {
    return (
      <>
        {<MuiPickersUtilsProvider utils={MomentUtils}>
          <Fragment>
            <ThemeProvider theme={materialTheme}>
              <DatePicker
                value={this.state.start}
                onChange={date => this.setState({ start: date, end: date })}
                variant="inline"
                inputVariant="outlined"
                label='Start Day'
                shouldDisableDate={day => this.shouldDisableDate(day)}
                // Don't let the user select a starting date before today.
                disablePast={true}
                renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) =>
                  this.renderDay(day, isInCurrentMonth, dayComponent)
                }
              />
              <DatePicker
                disabled={!this.state.start}
                minDate={this.state.start}
                value={this.state.end}
                onChange={date => this.checkIfValidBorrowingRange(date)}
                variant="inline"
                inputVariant="outlined"
                label='End Day'
                shouldDisableDate={day => this.shouldDisableDate(day)}
                renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) =>
                  this.renderDay(day, isInCurrentMonth, dayComponent)
                }
              />
            </ThemeProvider>
          </Fragment>
        </MuiPickersUtilsProvider>}
        {
          <TextField
            variant="outlined"
            placeholder='Message'
            value={this.state.message}
            type="text"
            onChange={(event) => {
              event.target.value.length <= 50 &&
                this.setState({
                  message: event.target.value
                })
            }}
          />
        }
        {
          <Button
            variant="contained"
            color="primary"
            disabled={!this.state.start}
            onClick={this.dispatchLoanRequest}
          >
            Submit Request
          </Button>
        }
        {<>
          {/* Dialogue that pops up if the user attempts to select an invalid loan day range. */}
          <Dialog
            open={this.state.showErrorMessage}
            onClose={() => this.setState({ showErrorMessage: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Error, you can't request a borrowing time-frame that overlaps the days this game is unavailable."}</DialogTitle>
            <DialogActions>
              <Button onClick={() => this.setState({ showErrorMessage: false })} color="primary" autoFocus>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </>}
      </>
    )
  }
}

const mapStateToProps = reduxState => ({
  currentUserID: reduxState.user.userAttributes.user_id
});

export default connect(mapStateToProps)(DateAndTimePickers);
