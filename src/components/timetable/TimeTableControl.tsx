import React, {MouseEvent, useState} from 'react';
import FlexContainer from "../layout/FlexContainer";
import Button from "../controls/Button";
import "./Controls.css"
import SelectBox from "../controls/SelectBox";
import {log} from "../../utils/logger";
import {useTimeTableStore} from "../../store";


function TimeTableControl(props: any) {
    const [toggleStart, setToggleStart] = useState(false);
    const [start, stop] = useTimeTableStore(state => [state.startRecord, state.stopRecord])
    const toggleTimer = () => {
        setToggleStart(!toggleStart);
    }

    const handleToggleTimer = (e: MouseEvent<HTMLButtonElement>) => {
        if (!toggleStart) {
            log.debug("start timer at: ", new Date());
            toggleTimer()
            start();
            return;
        }
        toggleTimer()
        stop();
    }

    return (
        <FlexContainer styleSetting={{fullWidth: false, fullHeight: false}} className={"app-controls"}>
            <FlexContainer styleSetting={{column: true, spaceBetween: true}} className={"app-controls-left"}>
                <SelectBox id={"vorlagen"} options={[{value: "Frühschicht"}]}/>
            </FlexContainer>

            <FlexContainer styleSetting={{column: true, spaceBetween: true}} className={"app-controls-right"}>
                <Button onClick={handleToggleTimer}>{!toggleStart? "START": "STOP"}</Button>
            </FlexContainer>
        </FlexContainer>

    );
}

export default TimeTableControl;