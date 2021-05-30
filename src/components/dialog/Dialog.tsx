import React, {FunctionComponent} from 'react';
import Button from "../controls/Button";
import "./Dialog.css";
import FlexContainer from "../layout/FlexContainer";

type DialogProps = {
    content: string | React.ReactChild
    onConfirm: (result: boolean) => void;
}
const Dialog: FunctionComponent<DialogProps> = ({content, onConfirm}) => {

    return (
        <FlexContainer className={"dialog"} styleSetting={{column: true}}>
            <div className={"dialog-content"}>
                {content}
            </div>
            <FlexContainer className={"dialog-controls"}>
                <Button onClick={() => onConfirm(true)}
                        style={{fontSize: "1rem", backgroundColor: "var(--color-primary)", color: "white"}}>JA</Button>
                <Button onClick={() => onConfirm(false)} style={{
                    fontSize: "1rem",
                    backgroundColor: "var(--color-secondary)",
                    color: "white"
                }}>Nein</Button>
            </FlexContainer>
        </FlexContainer>
    );
};

export default Dialog;
