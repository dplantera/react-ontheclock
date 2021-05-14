import "./Dashboard.css"
import FlexContainer from "../layout/FlexContainer";
import OverHours from "./OverHours";

export default function Dashboard(props: any) {


    return (
        <FlexContainer className={"dashboard"} styleSetting={{wrap: true, spaceBetween: true}}>
            <OverHours value={-3.00} label={"Woche"}/>
            <OverHours value={5.00} label={"Monat"}/>
            <OverHours value={-15.00} label={"Total"} fullWidth/>
        </FlexContainer>
    );
}