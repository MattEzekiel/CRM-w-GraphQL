/**
 * @param { string } value
 * @returns {JSX.Element}
 * @constructor
 */
function InputSubmit({value}) {
    return (
        <input
            type={"submit"}
            className={"bg-gray-800 w-full mt-5 p-2 text-white uppercase font-medium hover:bg-gray-900 cursor-pointer transition duration-300"}
            value={value}
        />
    );
}

export default InputSubmit;