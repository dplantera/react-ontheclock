import "./Dashboard.css"
import FlexContainer from "../layout/FlexContainer";
import OverHours from "./OverHours";
import {useTimeTableStore} from "../../store";
import React, {useEffect, useState} from "react";
import {DateTransform} from "../../utils/dates";
import {TimeRecord} from "../../model/TimeRecord";

enum DaysOfWeek {Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday}

// https://mygeekjourney.com/programming-notes/javascript-how-to-calculate-number-of-working-days/
function workingDays(fromDate: Date, toDate: Date, workingDays: DaysOfWeek[]) {
    if (!fromDate || toDate < fromDate) {
        return -1;
    }
    let frD = DateTransform.for(fromDate).truncate("day").toDate(),
        toD = DateTransform.for(toDate).truncate("day").toDate(),
        numOfWorkingDays = 1;

    const noWorkingDays = Object.values(DaysOfWeek).filter(val => Number.isInteger(val) && !workingDays.includes(val as number))
    while (frD < toD) {
        frD = DateTransform.for(frD).addDays(1).toDate();
        if (!noWorkingDays.includes(frD.getDay())) {
            numOfWorkingDays++;
        }
    }
    return numOfWorkingDays;
}

let now = new Date();
const currentMonth = DateTransform.for(now).truncate("month").toDate();
const weekStartDay = DaysOfWeek.Monday;
const currentDay = now.getDay();
const daysPassed = currentDay === 0 ? 6 : currentDay - weekStartDay;

const dayTransform = DateTransform.for(now).truncate("day");
const currentDate = dayTransform.toDate();
const weekStartDate = dayTransform.addDays(-daysPassed).toDate();

const Dashboard = (props: any) => {
    const timeRecords = useTimeTableStore(state => state.timeRecords);

    const [contractTargetHours] = useState(40);
    const [contractWeeklyWorkingDays] = useState([DaysOfWeek.Monday, DaysOfWeek.Tuesday, DaysOfWeek.Wednesday, DaysOfWeek.Thursday, DaysOfWeek.Friday]);
    const [hoursWeekly, setHoursWeekly] = useState(0);
    const [hoursMonthly, setHoursMonthly] = useState(0);
    const [hoursYear, setHoursYear] = useState(0);

    useEffect(() => {
        const truncateMonth = (date: Date) => DateTransform.for(date).truncate("month").toDate().getTime();
        const thisMonth = timeRecords.filter(record =>
            record.timeStart && truncateMonth(record.timeStart) === currentMonth.getTime()
        );
        const thisWeek = thisMonth.filter(record =>
            record.date && record.date >= weekStartDate.getTime() && record.date <= currentDate.getTime()
        );

        const calcTotalHours = (records: TimeRecord[]) => {
            return records.map(record => record.totalHours).reduce((acc: number, curr) => {
                if (curr)
                    return acc + curr;
                return acc;
            }, 0)
        }

        const startCountInMonth = timeRecords[0]?.timeStart || currentMonth;
        const startCountInYear = timeRecords[0]?.timeStart || DateTransform.for(now).truncate("year").toDate();
        const daysInCurrentWeek = workingDays(weekStartDate, now, contractWeeklyWorkingDays);
        const daysInCurrentMonth = workingDays(startCountInMonth, now, contractWeeklyWorkingDays);
        const daysInCurrentYear = workingDays(startCountInYear, now, contractWeeklyWorkingDays);

        const targetHoursDay = contractTargetHours / contractWeeklyWorkingDays.length;
        const targetHoursWeek = targetHoursDay * daysInCurrentWeek;
        const targetHoursMonth = targetHoursDay * daysInCurrentMonth;
        const targetHoursYear = targetHoursDay * daysInCurrentYear;

        const updateThisMonth = () => setHoursMonthly(Math.round(calcTotalHours(thisMonth)) - targetHoursMonth);
        const updateThisWeek = () => setHoursWeekly(Math.round(calcTotalHours(thisWeek) - targetHoursWeek));
        const updateTotal = () => setHoursYear(Math.round(calcTotalHours(timeRecords) - targetHoursYear));
        setTimeout(updateThisMonth, 0);
        setTimeout(updateThisWeek, 0);
        setTimeout(updateTotal, 0);
    }, [timeRecords, contractWeeklyWorkingDays, contractTargetHours]);

    return (
        <FlexContainer className={"dashboard"} styleSetting={{wrap: true, spaceBetween: true}}>
            <OverHours value={hoursWeekly} label={"Woche"}/>
            <OverHours value={hoursMonthly} label={"Monat"}/>
            <OverHours value={hoursYear} label={"Total"} fullWidth/>
        </FlexContainer>
    );
}

export default React.memo(Dashboard)