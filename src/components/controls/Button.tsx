import React from 'react';
import "./Button.css"

interface ButtonProps{

}
function Button(props: React.PropsWithChildren<ButtonProps>) {
    return (
        <button type={"button"} className={"button"} >{props.children}</button>

    );
}

export default Button;