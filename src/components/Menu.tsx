import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {useMenuStore} from "../store";
import "./Menu.css";
import {faEdit} from "@fortawesome/free-solid-svg-icons/faEdit";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons/faTrashAlt";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons/faPlusSquare";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons/faAngleLeft";

export type MenuProps = {
    position?: { x: number, y: number }
}

const Menu = () => {
    const [visible, setVisible, {position}] = useMenuStore(state => [state.visible, state.setVisible, state.props]);

    const handleClose = () => {
        setVisible(false);
    }

    const show = () => {
        if (visible)
            return (
                <div className={"menu"} onClick={handleClose} style={{left: position?.x ?? 0, top: position?.y ?? 0}}>
                    <div className={"icon-container"}>
                        <FontAwesomeIcon icon={faEdit} className={"icon"}/>
                    </div>
                    <div className={"icon-container"}>
                        <FontAwesomeIcon icon={faPlusSquare} className={"icon"}/>
                    </div>
                    <div className={"icon-container"}>
                        <FontAwesomeIcon icon={faTrashAlt} className={"icon"}/>
                    </div>
                    <div className={"icon-container"}>
                        <FontAwesomeIcon icon={faAngleLeft} className={"icon"}/>
                    </div>
                </div>
            )
        return null;
    }
    return show();
};

export default Menu;
