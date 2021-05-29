import React, {HTMLAttributes} from 'react';
import FlexContainer from "../layout/FlexContainer";

type TimeTableRecordProps = {
    idx: number,
    htmlAttr: HTMLAttributes<HTMLDivElement>,
    start?: Date
    end?: Date,
    total?: number
}
const TimeTableRecord = ({idx, htmlAttr, start, end, total}: React.PropsWithChildren<TimeTableRecordProps>) => {
    return (
        <FlexContainer key={idx} className={"time-table-row item"}
                       styleSetting={{spaceBetween: true}}
                       domAttr={{...htmlAttr, defaultValue: idx}}>
            <div>{start?.toLocaleTimeString([], {timeStyle: 'short'})}</div>
            <div>{end?.toLocaleTimeString([], {timeStyle: 'short'})}</div>
            <div>{total ?? "open"}</div>
        </FlexContainer>
    );
};

export default TimeTableRecord;
