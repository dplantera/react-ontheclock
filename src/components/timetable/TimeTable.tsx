import "./TimeTable.css"
import FlexContainer from "../layout/FlexContainer";

const getTimeDiff = (start:Date, end:Date) => {
    const date = new Date(end.getTime() - start.getTime());
    let diff = date.getHours();
    if(date.getMinutes() > 0)
        diff += (date.getMinutes() / 60)
    return Number(diff).toFixed(2);
}

export default function TimeTable(props: any) {
    const data = [
        {start: new Date("2021-01-01T09:00:00Z"), end: new Date("2021-01-01T12:00:00Z")},
        {start: new Date("2021-01-01T12:30:00Z"), end: new Date("2021-01-01T15:00:00Z")},
        {start: new Date("2021-01-01T12:30:00Z"), end: undefined},
    ]
    return (
        <FlexContainer className={"time-table"} styleSetting={{column:true}}>
            <FlexContainer className={"time-table-row headline"} styleSetting={{spaceBetween: true}}>
                <div>Von</div>
                <div>Bis</div>
                <div>Total</div>
            </FlexContainer>
            {data.map((row, idx) => {
                return(
                    <FlexContainer key={idx} className={"time-table-row"} styleSetting={{spaceBetween: true}}>
                        <div>{row.start.toLocaleTimeString([], {timeStyle: 'short'})}</div>
                        <div>{row.end?.toLocaleTimeString([], {timeStyle: 'short'})}</div>
                        <div>{row.end? getTimeDiff(row.start, row.end): "open"}</div>
                    </FlexContainer>
                )
            })}

        </FlexContainer>
    );
}