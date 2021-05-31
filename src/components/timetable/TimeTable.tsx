import "./TimeTable.css"
import FlexContainer from "../layout/FlexContainer";
import {useCalendarStore, useTimeTableStore} from "../../store";
import React, {useEffect, useState} from "react";
import {TimeRecord} from "../../model/TimeRecord";

import TimeTableRecord from "./TimeTableRecord";

export default function TimeTable() {
    const [records, setRecords] = useState([] as TimeRecord[]);
    const selectedDates = useCalendarStore(state => state.selectedDates);
    const timeRecords = useTimeTableStore(state => state.timeRecords);

    useEffect(() => {
        const selectedDatesInMS = selectedDates.map(date => date.getTime())
        const recordsForSelection = timeRecords.filter(record => record.date && selectedDatesInMS.includes(record.date));
        setRecords(recordsForSelection);
    }, [setRecords, selectedDates, timeRecords])

    const renderRecords = () => {
        if (records.length <= 0)
            return <TimeTableRecord date={selectedDates[0]}/>

        return records.map((row, idx) => {
            return <TimeTableRecord key={idx}
                                    start={row.timeStart}
                                    end={row.timeEnd}
                                    total={row.totalHours}
                                    id={row.id}
                                    date={selectedDates[0]}
            />
        })
    }
    return (
           <FlexContainer className={"time-table"} styleSetting={{column: true}}>
               <FlexContainer className={"time-table-row headline"} styleSetting={{spaceBetween: true}}>
                   <div>Von</div>
                   <div>Bis</div>
                   <div>Total</div>
               </FlexContainer>
               <div className={"time-table-data"}>
                   {renderRecords()}
               </div>
           </FlexContainer>
    );
}