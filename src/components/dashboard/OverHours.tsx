import FlexContainer from "../layout/FlexContainer";
import "./OverHours.css"
function OverHours(props:any) {
    const {fullWidth, value, label} = props;

    let classNameRoot = "over-hours";
    let classNameChild = "over-hours-item";
    if(fullWidth)
        classNameRoot += " fullWidth"
    else
        classNameRoot += " over-hours-sm"

    if(Math.abs(value) > 5)
        classNameChild += " over-hours-signal-bad"
    else if (Math.abs(value) > 3)
        classNameChild += " over-hours-signal-alarm"
    else
        classNameChild += " over-hours-signal-good"

    return (
        <FlexContainer className={classNameRoot} styleSetting={{spaceBetween: true, fullWidth, fullHeight:false, column:true}}>
            <div className={classNameChild}>{value}</div>
            <div className={"over-hours-item-label"}>{label}</div>
        </FlexContainer>
    );
}

export default OverHours;