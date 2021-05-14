import React from 'react';
import FlexContainer from "../layout/FlexContainer";
import Button from "./Button";
import "./Controls.css"
import SelectBox from "./SelectBox";


function Controls(props: any) {
    return (
        <FlexContainer styleSetting={{fullWidth: false, fullHeight: false}} className={"app-controls"}>
            <FlexContainer styleSetting={{column: true, spaceBetween: true}} className={"app-controls-left"}>
                <SelectBox id={"vorlagen"} options={[{value:"Frühschicht"}]}/>
            </FlexContainer>
            <FlexContainer styleSetting={{column: true, spaceBetween: true}} className={"app-controls-right"}>
                <Button>STOP</Button>
                <Button>PAUSE</Button>
                <Button>START</Button>
            </FlexContainer>
        </FlexContainer>

    );
}

export default Controls;