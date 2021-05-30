import React, {FunctionComponent, HTMLProps} from 'react';
import "./MenuItem.css";

export type MenuItemProps = {
    label?:string
    addClasses?:string
} & HTMLProps<HTMLDivElement>
const MenuItem: FunctionComponent<MenuItemProps> = ({children, className, addClasses, label, ...props}) => {
    return (
        <div {...props} className={className ?? "menu-item" + (addClasses? ` ${addClasses}`: "")}>
            {label || null}
            {children}
        </div>
    );
};

export default MenuItem;
