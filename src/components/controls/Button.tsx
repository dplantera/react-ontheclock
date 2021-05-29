import {PropsWithChildren, ButtonHTMLAttributes} from 'react';
import "./Button.css"

interface ButtonProps {
}


function Button(props: PropsWithChildren<ButtonProps> & ButtonHTMLAttributes<HTMLButtonElement>) {
    const {children, ...htmlButtonProps} = props;
    return (
        <button type={"button"} className={"button"} {...htmlButtonProps}>{props.children}</button>
    );
}

export default Button;