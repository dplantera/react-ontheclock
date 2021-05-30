import React from 'react';
import ReactCalendar, {CalendarTileProperties} from "react-calendar"
import {useCalendarStore, useTimeTableStore} from "../store";


function Calendar(props:any) {
    const dates = useTimeTableStore(state => state.timeRecords)
    const [selectedDate, setSelectedDate] = useCalendarStore(state => [state.selectedDates, state.changeSelectedDate])

    function handleChanceDate(date: Date | Date[]){
            if (Array.isArray(date))
                setSelectedDate([...date])
            else
                setSelectedDate([date])
    }

    function tileContent(props:CalendarTileProperties) {
        const {date, view} = props;
        const existingDates = dates.map((date) => date.date);

        // Add class to tiles in month view only
        if(view === "month" && existingDates.includes(date.getTime())) {
            return (<div style={{backgroundColor:"blue", borderRadius: "100%", position:"relative", width:"5px", height:"5px", margin:"auto"}}/>)
        }

        return null;
    }

    return (
        <ReactCalendar value={selectedDate} onChange={handleChanceDate} tileContent={tileContent}/>
    );
}

export default Calendar;