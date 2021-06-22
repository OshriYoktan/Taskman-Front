import 'date-fns';
import './DueDateModal.scss'
import React, { useEffect, useRef, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from "@material-ui/styles";
import { lightBlue } from '@material-ui/core/colors';


const defaultMaterialTheme = createMuiTheme({
    overrides: {
        MuiPickersCalendarHeader: {
            switchHeader: {
                backgroundColor: 'inherit',
                color: '#172b4d',
            },
        },
        MuiPickersDay: {
            day: {
                color: lightBlue.A700,
            },
            daySelected: {
                color: '#fff !important',
                backgroundColor: 'rgb(66, 82, 110)',
            },
            dayDisabled: {
                color: lightBlue["100"],
            },
            container: {
                backgroundColor: "black"
            },
            current: {
                color: 'rgb(0, 82, 204)',
                border: 'rgb(0, 82, 204) 2px solid',
            },
        },
    },
});
export function DueDateModal(props) {

    const timeStemp = Date.now() + 604800000 //the default is next week
    const defaultNextWeek = new Date(Date.now() + 604800000);
    const [selectedDate, setSelectedDate] = React.useState(timeStemp);

    const submit = () => {
        var selectedDateStr = Date.parse(selectedDate)
        props.addDueDate(selectedDateStr)
        props.setDueDateModal(false)
    }
    return (
        <div className="due-date-modal">
            <section className="modal-header">
                <h3>Due Date</h3>
                <p className="btn-close-icon" onClick={() => props.setDueDateModal(false)}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
            </section>
            <form onSubmit={submit}>
                <ThemeProvider theme={defaultMaterialTheme}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="static"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Pick A Deadline"
                            value={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            KeyboardButtonProps={{ 'aria-label': 'change date', }}
                        ></KeyboardDatePicker>
                    </MuiPickersUtilsProvider>
                </ThemeProvider>
                <div className="ddm-btn">
                    <button>save</button>
                </div>
            </form>
        </div>

    )

}
