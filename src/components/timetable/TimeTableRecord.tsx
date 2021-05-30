import React, {HTMLAttributes, useEffect, useState} from 'react';
import FlexContainer from "../layout/FlexContainer";
import "./TimeTableRecord.css";
import {useMenuStore, useTimeTableStore} from "../../store";
import useLongPress from "../../hooks/useLongPress";
import EditRecord from "./EditRecord";
import {TimeRecord} from "../../model/TimeRecord";
import {useModal} from "../../hooks/useModal";


type TimeTableRecordProps = {
    id?: number | string,
    htmlAttr?: HTMLAttributes<HTMLDivElement>,
    date?:Date,
    start?: Date,
    end?: Date,
    total?: number
    onUpdate?: (update:Partial<TimeRecord>) => void
}

const TimeTableRecord = ({id, start, end, total, date, onUpdate}: React.PropsWithChildren<TimeTableRecordProps>) => {
    const updateRecord = useTimeTableStore(state => state.updateRecord)
    const [isMenuOpen, openMenu] = useMenuStore(state => [state.visible, state.open]);
    const [selected, setSelected] = useState(false);
    const {RenderModal, show, hide} = useModal();

    const handleEdit = (e: any) => {
        const pos = {x: 0, y: 0};
        setSelected(true);
        if (e.type === "touchstart") {
            const touch = e.touches[0];
            console.log({touch})
            pos.x = touch.pageX;
            pos.y = touch.pageY;
        } else {
            pos.x = e.clientX;
            pos.y = e.clientY;
        }

        openMenu({position: pos, onUpdate: () => show()});
    }

    const handleUpdate = (data: Partial<TimeRecord>) => {
        if(data)
            updateRecord({timeStart: start, timeEnd:end, ...data, id})
        hide();
    }

    const onLongPress = useLongPress({
        onLongPress: handleEdit, onClick: (e) => {
            console.log(e)
        }
    }, {delay: 450});

    useEffect(() => {
        if(!isMenuOpen)
            setSelected(false);
    }, [isMenuOpen, setSelected])
    return (
       <React.Fragment>
           <FlexContainer className={"time-table-row item" + (selected? " selected": "")}
                          styleSetting={{spaceBetween: true}}
                          domAttr={{...onLongPress, defaultValue: id}}>
               <div>{start?.toLocaleTimeString([], {timeStyle: 'short'})}</div>
               <div>{end?.toLocaleTimeString([], {timeStyle: 'short'})}</div>
               <div>{total ?? "open"}</div>

           </FlexContainer>
           <RenderModal>
               <EditRecord onSubmit={handleUpdate} from={start} to={end} date={date}/>
           </RenderModal>
       </React.Fragment>

);
};

export default TimeTableRecord;
