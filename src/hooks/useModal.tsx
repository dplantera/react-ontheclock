//https://sandstorm.de/de/blog/post/reusable-modal-with-react-hooks-and-portals.html
import React, {useRef, useState} from 'react';
import Modal from "../components/modal/Modalt";

export type useModalProps = {
    children: React.ReactChild,
    parent?: HTMLElement,
    className?: string
}
export const useModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const hide = () => setIsVisible(false);
    const show = () => setIsVisible(true);

    const RenderModal = ({children, ...rest}: useModalProps) => (
        <React.Fragment>
            {isVisible && <Modal ref={modalRef} {...rest}>{children}</Modal>}
        </React.Fragment>
    )

    return {
        show,
        hide,
        RenderModal,
    }
}


