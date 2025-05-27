export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-color-line shadow-sm focus:ring-color-line ' +
                className
            }
        />
    );
}
