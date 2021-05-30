import React, {ComponentPropsWithRef, FunctionComponent, PropsWithChildren, PropsWithRef} from 'react';
import {createPortal} from "react-dom";
import "./Modalt.css";

type ModalProps = {
    className?: string,
    parent?:HTMLElement
}
const Modal: FunctionComponent<ModalProps & PropsWithRef<ModalProps>> = ({children, className, parent}) => {

    return createPortal(
        <div className={(className ?? "modal")}>
            {children}
        </div>
        , parent ?? document.body)
};

export default Modal;
