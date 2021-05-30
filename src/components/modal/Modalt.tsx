import React, {PropsWithChildren} from 'react';
import {createPortal} from "react-dom";
import "./Modalt.css";

type ModalProps = {
    className?: string,
    parent?: HTMLElement,
}
const Modal = React.forwardRef<HTMLDivElement, PropsWithChildren<ModalProps>>(
    ({
         children,
         className,
         parent,
         ...rest
     }, ref) => {

        return createPortal(
            <div {...rest} ref={ref} className={(className ?? "modal")}>
                {children}
            </div>
            , parent ?? document.body)
    });

export default Modal;
