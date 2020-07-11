// import TextField from '@material-ui/core/TextField';
import React, { Fragment } from 'react';
import moment from 'moment';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, Button, TextField } from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import { Badge } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

const materialTheme = createMuiTheme({
  palette: {
    primary: green,
    type: 'dark'
  },
  overrides: {
    // MuiPickersToolbar: {
    //   toolbar: {
    //     backgroundColor: '#757ce8',
    //   },
    // },
    // MuiPickersCalendarHeader: {
    //   switchHeader: {
    //     backgroundColor: '#757ce8',
    //     color: "green",
    //   },
    // },
    MuiPickersDay: {
      // day: {
      //   color: '#1331c9',
      // },
      // daySelected: {
      //   backgroundColor: '#2e7d32',
      // },
      // dayDisabled: {
      //   color: '#c91313',
      // },
      // current cv 
    },
    MuiPickersModal: {
      dialogAction: {
        color: '#757ce8',
      },
    },
  },
});

class DateAndTimePickers extends React.Component {
  state = {
    dispatchTypeStr: '',
    selectionWindowOpen: false,
    start: moment().format('yyyy-MM-DD'),
    end: moment().format('yyyy-MM-DD'),
    showErrorMessage: false,
    message: '',
    requestedDays: ['2020-07-27', '2020-07-29', '2020-07-30'],
    blockOutDays: ['2020-07-07', '2020-07-20', '2020-07-22', '2020-07-23'],
    acceptedLoanDays: ['2020-07-09', '2020-07-10', '2020-07-11']
  }

  componentDidMount() {
    const dateSetMode = this.props.mode;
    let dispatchTypeStr;
    if (dateSetMode === 'request') {
      dispatchTypeStr = 'SET_LOAN_REQUEST_TIME_FRAME';
    } else if (dateSetMode === 'blockOut') {
      dispatchTypeStr = 'SET_BLOCK_OUT_TIME_FRAME';
    } else {
      throw new Error(`The DatePicker component only accepts modes of "request" and "blockOut" not "${dateSetMode}"`);
    }
    this.setState({
      dispatchTypeStr: dispatchTypeStr,
    })
    // If today is an invalid day change the starting values to null.
    if (this.state.blockOutDays.includes(moment().format('yyyy-MM-DD')) || this.state.acceptedLoanDays.includes(moment().format('yyyy-MM-DD'))) {
      this.setState({ start: null, end: null })
    }
  }

  dispatchLoanRequest = () => {
    console.log('dispatch', this.state.start, this.state.end, this.state.message);
    // const dispatch = useDispatch()
    // dispatch({ type: this.state.dispatchTypeStr, payload: '' })
  }

  checkIfValidBorrowingRange = (date) => {
    const isInAcceptedLoanRange = this.state.acceptedLoanDays.some(loanDay =>
      moment(loanDay).isBetween(this.state.start, date)
    )
    const isInBlockOutRange = this.state.blockOutDays.some(loanDay =>
      moment(loanDay).isBetween(this.state.start, date)
    )
    if (isInAcceptedLoanRange || isInBlockOutRange) {
      console.log('Error, invalid range');
      this.setState({ showErrorMessage: true })
    } else {
      this.setState({ end: date })
    }
  }

  renderDay = (day, isInCurrentMonth, dayComponent) => {
    const isRequestedLoanDay = isInCurrentMonth && this.state.requestedDays.includes(day.format('yyyy-MM-DD'));
    const isBlockedOutDay = isInCurrentMonth && this.state.blockOutDays.includes(day.format('yyyy-MM-DD'));
    const isAcceptedLoanDay = isInCurrentMonth && this.state.acceptedLoanDays.includes(day.format('yyyy-MM-DD'));
    return <Badge badgeContent={isBlockedOutDay ? '1' : isAcceptedLoanDay ? '2' : isRequestedLoanDay ? '3' : null}>{dayComponent}</Badge>;
  }

  shouldDisableDate = (day) => {
    return this.state.blockOutDays.includes(day.format('yyyy-MM-DD')) || this.state.acceptedLoanDays.includes(day.format('yyyy-MM-DD'))
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

export default DateAndTimePickers;
