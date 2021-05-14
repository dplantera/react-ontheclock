import React from 'react';
import "./SelectBox.css"


interface SelectBoxProps {
    id: string,
    options: [{ value: string , display?:string}]
}

function SelectBox(props: React.PropsWithChildren<SelectBoxProps>) {
    return (
        <div>
            <select className={"select-box"} name={"select-box-" + props.id}  id={"select-box-" + props.id}>
                {props.options.map((option, idx) =>
                    <option key={idx}
                            className={"option"}
                            value={option.value}
                    > {option.display ?? option.value} </option>)
                }
            </select>

            {/*<input list={"option-list-" + props.id} type={"text"}/>*/}
            {/*<datalist id={"option-list-" + props.id}>*/}
            {/*    {props.options.map(option => <option value={option.value}/>)}*/}
            {/*</datalist>*/}
        </div>
    );
}

export default SelectBox;