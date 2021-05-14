import React from 'react';
import AppBar from "./components/AppBar";
import Controls from "./components/controls/Controls";
import FlexContainer from "./components/layout/FlexContainer";
import Dashboard from "./components/dashboard/Dashboard";
import TimeTable from "./components/timetable/TimeTable";
import "./Calendar.css"
import './App.css';
import Calendar from "./components/Calendar";

function App() {
    return (
        <div className="App">
            <FlexContainer styleSetting={{column: true, spaceBetween: true}}>
                <AppBar/>
                <Calendar/>
                <TimeTable/>
                <Dashboard/>
                <Controls/>
            </FlexContainer>
        </div>
    );
}

export default App;
