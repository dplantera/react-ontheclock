import React from 'react';
import ReactCalendar from "react-calendar"


function Calendar(props:any) {
    return (
        <ReactCalendar value={new Date()} onChange={(e) => console.log(e)}/>
    );
}

export default Calendar;