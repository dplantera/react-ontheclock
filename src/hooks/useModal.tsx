//https://sandstorm.de/de/blog/post/reusable-modal-with-react-hooks-and-portals.html
import React, {useEffect, useRef, useState} from 'react';
import Modal from "../components/modal/Modalt";

type useModalProps = {
    children: React.ReactChild,
    parent?: HTMLElement,
    className?: string
}
export const useModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef();
    const show = () => {
        console.log("showing")
        setIsVisible(true)
    }
    const hide = () => setIsVisible(false)

    const handleOutsideClick = (e: Event) => {
        return;
        if (!isVisible)
            return;
        const mouseEvent = e as MouseEvent;
    }

    useEffect(() => {
        if (isVisible)
            document.addEventListener("click", handleOutsideClick);
        else
            document.removeEventListener("click", handleOutsideClick);

    }, [isVisible]);


    const RenderModal = ({children, ...rest}: useModalProps) => (
        <React.Fragment>
            {isVisible && <Modal {...rest}>{children}</Modal>}
        </React.Fragment>
    )

    return {
        show,
        hide,
        RenderModal,
    }
}


