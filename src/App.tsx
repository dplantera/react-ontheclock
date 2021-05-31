import React, {useEffect} from 'react';
import AppBar from "./components/AppBar";
import TimeTableControl from "./components/timetable/TimeTableControl";
import FlexContainer from "./components/layout/FlexContainer";
import Dashboard from "./components/dashboard/Dashboard";
import TimeTable from "./components/timetable/TimeTable";
import "./Calendar.css"
import './App.css';
import Calendar from "./components/Calendar";
import {useNotificationStore, useTimeTableStore} from "./store";

import Notification from "./components/Notification";
import Menu from "./components/menu/Menu";

function App() {
    const [notify] = useNotificationStore(state => [state.notify]);
    const fetchTimeRecords = useTimeTableStore(state => state.fetchTimeRecords)

    useEffect(() => {
        fetchTimeRecords()
            .then(() => {
                    notify({
                        type: "success",
                        content: <p>Erfasste Zeiten wurden geladen.</p>
                    })
                }
            ).catch(err => {
            notify({
                type: "error",
                content: <span> <p>Zeiten konnten nicht geladen werden!</p> <p>{err.message}</p></span>
            })
        });
    }, [fetchTimeRecords, notify])

    return (
        <React.Fragment>
            <div id="app" className="App">
                <Menu/>
                <FlexContainer styleSetting={{column: true, spaceBetween: true}} className={"app-content"}>
                    <AppBar/>
                    <Calendar/>
                    <TimeTable/>
                    <Dashboard/>
                    <TimeTableControl/>
                    <Notification/>
                </FlexContainer>
            </div>
        </React.Fragment>
    );
}

export default App;
