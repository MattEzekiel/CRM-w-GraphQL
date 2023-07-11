import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import H1 from "../../components/H1";
import { mostrarMensaje } from "../../helpers";
import Input from "../../components/Input";
import {useState} from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import Spinner from "../../components/Spinner";
import { Formik } from "formik";
import * as Yup from "yup";
import InputSubmit from "../../components/InputSubmit";

const OBTENER_CLIENTE = gql`
    query obtenerCliente($id: ID!) {
        obtenerCliente(id: $id) {
            nombre,
            apellido,
            empresa,
            email,
            telefono,
        }
    }
`;

const ACTUALIZAR_CLINETE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput) {
        actualizarCliente(id: $id, input: $input) {
            nombre,
            apellido,
            email,
        }
    }
`;

function EditarCliente() {
    const [mensaje, setMensaje] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const { query: { pid } } = router;

    const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
        variables: {
            id: pid,
        }
    });

    if (error) {
        console.error(error);
    }

    const [ actualizarCliente ] = useMutation(ACTUALIZAR_CLINETE);

    const schemaValidator = Yup.object({
        nombre: Yup.string()
            .required("El nombre es obligatorio"),
        apellido: Yup.string()
            .required("El apellido es obligatorio"),
        empresa: Yup.string()
            .required("El nombre de la empresa es obligatorio"),
        email: Yup.string()
            .required("El email es obligatorio")
            .email("El email no es válido"),
    });

    if (loading) {
        return <Spinner />
    }

    const obtenerCliente = data?.obtenerCliente;

    const actualizarInfoCliente = async valores => {
        const { nombre, apellido, empresa, email, telefono } = valores;

        try {
            await actualizarCliente({
                variables: {
                    id: pid,
                    input: {
                        nombre,
                        apellido,
                        empresa,
                        email,
                        telefono
                    }
                }
            });
            setSuccess(true);
            setMensaje("Cliente actualizado");

            setTimeout(() => {
                setMensaje("");
                router.push("/");
            }, 5000);
        } catch(e) {
            console.error(e);
        }
    }

    return(
        <Layout>
            <H1>Editar Cliente</H1>
            <div className={"flex justify-center mt-5"}>
                <div className={"w-full max-w-lg"}>
                    <Formik
                        validationSchema={schemaValidator}
                        enableReinitialize
                        initialValues={obtenerCliente}
                        onSubmit={ ( valores ) => {
                            actualizarInfoCliente(valores);
                        }}
                    >
                        { props => {
                            return (
                                <form
                                    className={"bg-white shadow-md px-8 pt-6 pb-8 mb-4"}
                                    onSubmit={props.handleSubmit}
                                >
                                    { mensaje && success ? mostrarMensaje(true,mensaje) : mostrarMensaje(false,mensaje) }
                                    <Input
                                        name={"nombre"}
                                        type={"text"}
                                        placeholder={"Ingrese el nombre del cliente"}
                                        value={props.values.nombre}
                                        handleChange={props.handleChange}
                                        handleBlur={props.handleBlur}
                                        error={props.errors.nombre}
                                        touched={props.touched.nombre}
                                    />
                                    <Input
                                        name={"apellido"}
                                        type={"text"}
                                        placeholder={"Ingrese el apellido del cliente"}
                                        value={props.values.apellido}
                                        handleChange={props.handleChange}
                                        handleBlur={props.handleBlur}
                                        error={props.errors.apellido}
                                        touched={props.touched.apellido}
                                    />
                                    <Input
                                        name={"empresa"}
                                        type={"text"}
                                        placeholder={"Ingrese el nombre de la empresa"}
                                        value={props.values.empresa}
                                        handleChange={props.handleChange}
                                        handleBlur={props.handleBlur}
                                        error={props.errors.empresa}
                                        touched={props.touched.empresa}
                                    />
                                    <Input
                                        name={"email"}
                                        type={"email"}
                                        placeholder={"Ingrese el email de contacto"}
                                        value={props.values.email}
                                        handleChange={props.handleChange}
                                        handleBlur={props.handleBlur}
                                        error={props.errors.email}
                                        touched={props.touched.email}
                                    />
                                    <Input
                                        name={"telefono"}
                                        type={"tel"}
                                        placeholder={"Ingrese el telefono de contacto"}
                                        value={props.values.telefono}
                                        handleChange={props.handleChange}
                                        handleBlur={props.handleBlur}
                                    />
                                    <InputSubmit
                                        value={"Editar Cliente"}
                                    />
                                </form>
                            )
                        } }
                    </Formik>
                </div>
            </div>
        </Layout>
    );
}

export default EditarCliente;