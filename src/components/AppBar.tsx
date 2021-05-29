import React, {useEffect} from 'react';
import FlexContainer from "./layout/FlexContainer";
import "./AppBar.css";
import {ReactComponent as MenuBar } from "../assets/bars-solid.svg";

export default function AppBar() {
    return (
        <FlexContainer className={"app-bar"}>
            <div className={"app-name"}>OnTheClock</div>
            <MenuBar className={"app-menu"}/>
        </FlexContainer>
    );
}