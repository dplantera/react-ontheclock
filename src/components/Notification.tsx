import React, {useCallback, useEffect} from 'react';
import FlexContainer from "./layout/FlexContainer";
import {useNotificationStore} from "../store";
import "./Notification.css"
import {CSSTransition} from "react-transition-group";

export type NotificationProps = {
    content?: JSX.Element,
    type?: "info" | "error" | "success",
    title?: JSX.Element,
    blurTime?: number
}
const Notification = () => {
    const [open, setOpen, {
        content,
        type,
        title,
        blurTime = 3000
    }] = useNotificationStore(state => [state.open, state.setOpen, state.props])


    const handleClose = useCallback(() => {
        if (!open)
            return;
        setOpen(false);
    }, [setOpen, open]);

    useEffect(() => {
        setTimeout(handleClose, blurTime )
    }, [blurTime, handleClose]);

        return (
            <CSSTransition in={open} timeout={blurTime} classNames={"notification-main"} onClick={handleClose} >
                <div>
                    <FlexContainer className={`notification ${type}`}
                                   styleSetting={{fullWidth: false, fullHeight: false, relative: false}}
                                   domAttr={{id: "notification", onClick: handleClose}}
                    >
                        <main>
                            <h1 className={"notification-title"}>{title}</h1>
                            <div className={"notification-content"}>{content}</div>
                        </main>
                    </FlexContainer>

                </div>
            </CSSTransition>
        );
};

export default Notification;
