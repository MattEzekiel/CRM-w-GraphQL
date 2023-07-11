import ErrorParagraph from "./ErrorParagraph";

function Input({
                   name,
                   type,
                   placeholder,
                   value,
                   handleChange,
                   handleBlur,
                   error,
                   touched,
               }) {
    return (
        <>
            <div className={"mb-4"}>
                <label htmlFor={name.toLowerCase()} className={"block text-gray-700 text-sm font-medium mb-2 capitalize"}>{name.toLowerCase()}</label>
                <input
                    type={type}
                    id={name.toLowerCase()}
                    name={name.toLowerCase()}
                    className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:transition-shadow duration-300 focus:shadow-md"}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </div>
            { error && touched ? (
                <ErrorParagraph
                    message={error}
                />
            ) : null }
        </>
    );
}

export default Input;