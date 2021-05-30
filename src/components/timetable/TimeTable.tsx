import "./TimeTable.css"
import FlexContainer from "../layout/FlexContainer";
import {useCalendarStore, useMenuStore, useTimeTableStore} from "../../store";
import React, {useEffect, useState} from "react";
import {TimeRecord} from "../../model/TimeRecord";
import {log} from "../../utils/logger";

import TimeTableRecord from "./TimeTableRecord";
import EditRecord from "./EditRecord";


export default function TimeTable(props: any) {
    const [records, setRecords] = useState([] as TimeRecord[]);
    const selectedDates = useCalendarStore(state => state.selectedDates);
    const timeRecords = useTimeTableStore(state => state.timeRecords);

    useEffect(() => {
        const selectedDatesInMS = selectedDates.map(date => date.getTime())
        const recordsForSelection = timeRecords.filter(record => record.date && selectedDatesInMS.includes(record.date));
        log.log({
            selectedDates,
            records,
            recordsForSelection,
            date: selectedDates[0].getTime(),
            str: selectedDates[0].toLocaleTimeString()
        })
        setRecords(recordsForSelection);
    }, [setRecords, selectedDates, timeRecords])

    const handleUpdate = (update:Partial<TimeRecord>) => {
    }

    return (
        <FlexContainer className={"time-table"} styleSetting={{column: true}}>
            <FlexContainer className={"time-table-row headline"} styleSetting={{spaceBetween: true}}>
                <div>Von</div>
                <div>Bis</div>
                <div>Total</div>
            </FlexContainer>
            {records.map((row, idx) => {
                return <TimeTableRecord key={idx}
                                        start={row.timeStart}
                                        end={row.timeEnd}
                                        total={row.totalHours}
                                        id={row.id}
                                        date={selectedDates[0]}
                                        onUpdate={handleUpdate}
                />
            })}
        </FlexContainer>
    );
}