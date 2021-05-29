import React, {useEffect, useState, useCallback, useRef, memo, HTMLAttributes} from 'react';
import "./FlexContainer.css"
import {log} from "../../utils/logger";

interface IMapping {
    [propertyName: string]: any
}

interface FlexContainerStyleSettings extends IMapping {
    fullWidth?: Boolean
    wrap?: Boolean
    fullHeight?: Boolean
    relative?: Boolean
    column?: Boolean
    spaceBetween?:Boolean
    ref?: React.Ref<HTMLDivElement>
}

interface FlexContainerProps {
    styleSetting?: FlexContainerStyleSettings
    styles?: Object
    className?: string
    domAttr?: HTMLAttributes<any>
}

const PropsDefault = {
    styleSetting: {
        fullWidth: true,
        fullHeight: true,
        relative: true,
        column: false,
    }
}

function FlexContainer(props: React.PropsWithChildren<FlexContainerProps>) {
    props = {
        ...PropsDefault,
        ...props,
        styleSetting: {...PropsDefault.styleSetting, ...props.styleSetting}
    }

    const styleSetting: React.MutableRefObject<FlexContainerStyleSettings> = useRef({...PropsDefault.styleSetting, ...props.styleSetting});

    const [className, setClassName] = useState("flex-container")
    const refClassName = useRef(className)

    const assembleClassName = useCallback(() => {
        let result = refClassName.current;
        const append = (name: String) => result += (" " + name);
        for (let key in styleSetting.current) {
            if (styleSetting.current[key])
                append(key);
        }
        if (props.className)
            append(props.className);

        return result;
    }, [refClassName, styleSetting, props]);

    useEffect(() => {
        setClassName(assembleClassName())
    }, [setClassName, assembleClassName])

    return (
        <div className={className} style={props.styles} {...props.domAttr}>
            {props.children}
        </div>
    );
}

export default memo(FlexContainer);