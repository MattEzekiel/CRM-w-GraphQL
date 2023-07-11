function ErrorParagraph({message}) {
    return (
        <p className={"my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 font-medium"}><span className={"font-normal"}>Error:</span> <br/> { message }</p>
    );
}

export default ErrorParagraph;