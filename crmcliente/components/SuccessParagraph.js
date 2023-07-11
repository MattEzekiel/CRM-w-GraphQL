function SuccessParagraph({ message }) {
    return (
        <p className={"my-2 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 font-medium"}><span className={"font-normal"}>Éxito:</span> <br/> { message }</p>
    );
}

export default SuccessParagraph;