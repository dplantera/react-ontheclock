import React, {ChangeEvent, FormEvent, FunctionComponent, useState} from 'react';
import {TimeRecord} from "../../model/TimeRecord";
import FlexContainer from "../layout/FlexContainer";
import "./EditRecord.css";
import Button from "../controls/Button";

type EditRecordTypes = {
    from?: Date,
    to?: Date,
    date?: Date
    onSubmit: (data: Partial<TimeRecord>) => void
}

const EditRecord: FunctionComponent<EditRecordTypes> = ({from, to, date, onSubmit}) => {
    const [start, setStart] = useState(from?.toLocaleTimeString([], {timeStyle: 'short'}) ?? null);
    const [end, setEnd] = useState(to?.toLocaleTimeString([], {timeStyle: 'short'}) ?? null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const getHourMinute = (shortTime: string) => {
            const [hours, minutes] = shortTime.split(":");
            return [parseInt(hours), parseInt(minutes)]
        }

        const update: Partial<TimeRecord> = {};
        if (start) {
            const [hours, minutes] = getHourMinute(start);
            const localFrom = date ?? from ?? to ?? new Date();
            const newStart = new Date(localFrom.getTime());
            newStart.setHours(hours);
            newStart.setMinutes(minutes);
            update.timeStart = newStart;
        }
        if (end) {
            const [hours, minutes] = getHourMinute(end);
            const localTo = date ?? to ?? from ?? new Date();
            const newEnd = new Date(localTo.getTime());
            newEnd.setHours(hours);
            newEnd.setMinutes(minutes);
            update.timeEnd = newEnd;
        }
        if (update)
            onSubmit(update)
    }

    return (
        <FlexContainer className={"edit-record"} styleSetting={{column: true, spaceBetween: false}}>
            <form className={"edit-record-form"} onSubmit={handleSubmit}>
                <FlexContainer className={"form-item"} >
                    <label htmlFor={"from"}>Von: </label>
                    <input id={"from"} type={"time"}
                           defaultValue={start ?? undefined}
                           onBlur={(e) => setStart(e.target.value)}/>
                </FlexContainer>
                <FlexContainer className={"form-item"} >
                    <label htmlFor={"to"}>Bis: </label>
                    <input id={"to"} type={"time"}
                           defaultValue={end ?? undefined}
                           onBlur={(e) => setEnd(e.target.value)}/>
                </FlexContainer>
                <Button onClick={handleSubmit} style={{fontSize:"1rem"}}>Speichern</Button>
            </form>
        </FlexContainer>
    );
};

export default EditRecord;