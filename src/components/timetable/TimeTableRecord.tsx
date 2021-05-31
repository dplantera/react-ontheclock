import React, {HTMLAttributes, useEffect, useState} from 'react';
import FlexContainer from "../layout/FlexContainer";
import "./TimeTableRecord.css";
import {useMenuStore, useNotificationStore, useTimeTableStore} from "../../store";
import useLongPress from "../../hooks/useLongPress";
import EditRecord from "./EditRecord";
import {TimeRecord} from "../../model/TimeRecord";
import {useModal} from "../../hooks/useModal";
import Dialog from "../dialog/Dialog";
import MenuItem from "../menu/MenuItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons/faPlusSquare";


type TimeTableRecordProps = {
    id?: number | string,
    htmlAttr?: HTMLAttributes<HTMLDivElement>,
    date?: Date,
    start?: Date,
    end?: Date,
    total?: number
}

const TimeTableRecord = ({id, start, end, total, date}: React.PropsWithChildren<TimeTableRecordProps>) => {
    const [updateRecord, deleteRecord, createRecord] = useTimeTableStore(state => [state.updateRecord, state.deleteRecord, state.createRecord])
    const [isMenuOpen, openMenu] = useMenuStore(state => [state.visible, state.open]);
    const [selected, setSelected] = useState(false);
    const notify = useNotificationStore(state => state.notify);
    const [mode, setMode] = useState("read");
    const {RenderModal: EditDialog, show: showEditDialog, hide: hideEditDialog} = useModal();
    const {RenderModal: ConfirmDialog, show: showConfirm, hide: hideConfirm} = useModal();


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

        openMenu({
            position: pos,
            onUpdate: () => {
                setMode("edit");
                showEditDialog();
            },
            onDelete: () => showConfirm(),
            onCreate: () => {
                setMode("create")
                showEditDialog();
            }
        });
    }

    const handleDelete = (sure: boolean) => {
        if (!sure) {
            hideConfirm();
            return;
        }

        if (id)
            deleteRecord(id)
                .then(() => notify({
                        type: "success",
                        content: <p>Eintrag gelöscht.</p>
                    })
                ).catch(() => notify({
                type: "error",
                content: <p>Eintrag konnte nicht gelöscht werden.</p>
            })).finally( () =>
                hideConfirm()
            )
    }

    const handleCreate = (data: Partial<TimeRecord>) => {
        createRecord(data).then(() => notify({
                type: "success",
                content: <p>Eintrag erstellt.</p>
            })
        ).catch((err) => notify({
            type: "error",
            content: <main>
                <p>Eintrag konnte nicht erstellt werden.</p>
                <p>{err.message}</p>
            </main>
        })).finally(() => {
            hideEditDialog();
        })
    }

    const handleCloseModal = () => {
        setMode("read");
        hideEditDialog();
    }

    const handleUpdate = (data: Partial<TimeRecord>) => {
        if (data)
            updateRecord({timeStart: start, timeEnd: end, ...data, id}).then(() => notify({
                    type: "success",
                    content: <p>Eintrag aktuallisiert.</p>
                })
            ).catch((err) => notify({
                type: "error",
                content: <main>
                    <p>Eintrag konnte nicht aktuallisiert werden.</p>
                    <p>{err.message}</p>
                </main>
            })).finally(() => {
                handleCloseModal();
            })
    }

    const onLongPress = useLongPress({
        onLongPress: handleEdit
    }, {delay: 450});

    useEffect(() => {
        if (!isMenuOpen)
            setSelected(false);
    }, [isMenuOpen, setSelected])

    const renderModalContent = () => {
        switch (mode) {
            case "edit":
                return <EditRecord onSubmit={handleUpdate} onCancel={handleCloseModal} from={start} to={end}
                                   date={date}/>;
            case "create":
                return <EditRecord onSubmit={handleCreate} onCancel={handleCloseModal} from={end} date={date}/>
        }
        return <React.Fragment/>;
    }

    const renderRecord = () => {
        if (!start)
            return <MenuItem onClick={() => {
                setMode("create")
                showEditDialog();
            }} label={"Neuer Eintrag"}>
                <FontAwesomeIcon icon={faPlusSquare} className={"menu-icon"}/>
            </MenuItem>

        return (
            <FlexContainer className={"time-table-row item" + (selected ? " selected" : "")}
                           styleSetting={{spaceBetween: true}}
                           domAttr={{...onLongPress, defaultValue: id}}>
                <div>{start?.toLocaleTimeString([], {timeStyle: 'short'})}</div>
                <div>{end?.toLocaleTimeString([], {timeStyle: 'short'})}</div>
                <div>{total ?? "open"}</div>
            </FlexContainer>
        )
    }
    return (
        <React.Fragment>
            {renderRecord()}
            <EditDialog>
                {renderModalContent()}
            </EditDialog>
            <ConfirmDialog>
                <Dialog onConfirm={handleDelete} content={"Wirklich löschen?"}/>
            </ConfirmDialog>
        </React.Fragment>
    );
};

export default TimeTableRecord;
