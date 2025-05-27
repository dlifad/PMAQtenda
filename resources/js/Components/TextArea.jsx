import React from 'react';

export default function TextArea({
    name,
    id,
    value,
    className = '',
    autoComplete,
    required,
    isFocused,
    onChange,
    rows = 3,
    placeholder = '',
    disabled = false,
    ...props
}) {
    const textareaRef = React.useRef();

    React.useEffect(() => {
        if (isFocused) {
            
            textareaRef.current.focus();
        }
    }, [isFocused]);

    return (
        <textarea
            {...props}
            name={name}
            id={id || name}
            value={value}
            ref={textareaRef}
            className={
                `border-gray-300 focus:border-color-line focus:ring-color-line rounded-md shadow-sm ` +
                className
            }
            autoComplete={autoComplete}
            required={required}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
        />
    );
}