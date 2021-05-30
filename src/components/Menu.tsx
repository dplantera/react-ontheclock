import React, {FunctionComponent} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {useMenuStore} from "../store";
import "./Menu.css";
import {faEdit} from "@fortawesome/free-solid-svg-icons/faEdit";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons/faTrashAlt";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons/faPlusSquare";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons/faAngleLeft";

export type MenuProps = {
    position?: { x: number, y: number },
    onCreate?: () => void,
    onUpdate?: () => void,
    onDelete?: () => void,
    onAbort?: () => void,
}

const Menu: FunctionComponent<MenuProps> = ({
                                                position,
                                                onCreate,
                                                onDelete,
                                                onUpdate,
                                                onAbort
                                            }) => {
    const [visible, setVisible, {
        position: storedPos,
        onCreate:storedOnCreate,
        onDelete:storedOnDelete,
        onUpdate:storedOnUpdate,
        onAbort:storedOnAbort
    }] = useMenuStore(state => [state.visible, state.setVisible, state.props]);

    const handleClose = () => {
        setVisible(false);
    }

    const show = () => {
        if (visible)
            return (
                <div className={"menu"} onClick={handleClose}
                     style={{
                         left: position?.x ?? storedPos?.x ?? 0,
                         top: position?.y ?? storedPos?.y ?? 0
                     }}>
                    <div className={"icon-container"} onClick={onUpdate ?? storedOnUpdate}>
                        <FontAwesomeIcon icon={faEdit} className={"icon"} />
                    </div>
                    <div className={"icon-container"}>
                        <FontAwesomeIcon icon={faPlusSquare} onClick={storedOnCreate ?? onCreate} className={"icon"}/>
                    </div>
                    <div className={"icon-container"}>
                        <FontAwesomeIcon icon={faTrashAlt} onClick={storedOnDelete ?? onDelete} className={"icon"}/>
                    </div>
                    <div className={"icon-container"}>
                        <FontAwesomeIcon icon={faAngleLeft} onClick={storedOnAbort ?? onAbort} className={"icon"}/>
                    </div>
                </div>
            )
        return null;
    }
    return show();
};

export default Menu;
