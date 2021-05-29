import "./TimeTable.css"
import FlexContainer from "../layout/FlexContainer";
import {useCalendarStore, useMenuStore, useTimeTableStore} from "../../store";
import {useEffect, useState} from "react";
import {TimeRecord} from "../../model/TimeRecord";
import {log} from "../../utils/logger";
import useLongPress from "../../hooks/useLongPress";
import Menu from "../Menu";


export default function TimeTable(props: any) {
    const [records, setRecords] = useState([] as TimeRecord[]);
    const selectedDates = useCalendarStore(state => state.selectedDates);
    const timeRecords = useTimeTableStore(state => state.timeRecords);
    const openMenu = useMenuStore(state => state.open);


    const handleEdit = (e: any) => {
        const pos = {x: 0, y: 0};
        e.target.className += " selected";
        if (e.type === "touchstart") {
            const touch = e.touches[0];
            console.log({touch})
            pos.x = touch.pageX;
            pos.y = touch.pageY;
        } else {
            pos.x = e.clientX;
            pos.y = e.clientY;
        }

        openMenu({position: pos});
    }
    const onLongPress = useLongPress({
        onLongPress: handleEdit, onClick: (e) => {
            console.log(e)
        }
    }, {delay: 450});

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


    return (
        <FlexContainer className={"time-table"} styleSetting={{column: true}}>
            <FlexContainer className={"time-table-row headline"} styleSetting={{spaceBetween: true}}>
                <div>Von</div>
                <div>Bis</div>
                <div>Total</div>
            </FlexContainer>
            {records.map((row, idx) => {
                return (
                    <FlexContainer key={idx} className={"time-table-row item"}
                                   styleSetting={{spaceBetween: true}}
                                   domAttr={{...onLongPress, defaultValue: idx}}>
                        <div>{row.timeStart?.toLocaleTimeString([], {timeStyle: 'short'})}</div>
                        <div>{row.timeEnd?.toLocaleTimeString([], {timeStyle: 'short'})}</div>
                        <div>{row.totalHours ?? "open"}</div>
                    </FlexContainer>
                )
            })}
        </FlexContainer>
    );
}