import ErrorParagraph from "../components/ErrorParagraph";
import SuccessParagraph from "../components/SuccessParagraph";

const mostrarMensaje = (bool = false, mensaje = "") => {
    if (mensaje === "") return;
    if (!bool) {
        return (
            <ErrorParagraph
                message={mensaje}
            />
        )
    } else {
        return (
            <SuccessParagraph
                message={mensaje}
            />
        )
    }
}

export {
    mostrarMensaje,
}