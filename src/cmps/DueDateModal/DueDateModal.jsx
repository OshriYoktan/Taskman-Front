import './DueDateModal.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

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
            <section className="due-date-modal-header">
                <h3>Due Date</h3>
                <p className="btn-close-icon" onClick={() => props.setDueDateModal(false)}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
            </section>
            <form onSubmit={submit}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Pick A Deadline"
                        value={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        KeyboardButtonProps={{ 'aria-label': 'change date', }}
                    ></KeyboardDatePicker>
                </MuiPickersUtilsProvider>
                <button >save</button>
            </form>
        </div>

    )

}
