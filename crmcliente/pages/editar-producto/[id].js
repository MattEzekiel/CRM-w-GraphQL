import Layout from "../../components/Layout";
import H1 from "../../components/H1";
import { useRouter } from "next/router";
import {Formik} from "formik";
import {mostrarMensaje} from "../../helpers";
import Input from "../../components/Input";
import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import Spinner from "../../components/Spinner";
import * as Yup from 'yup';
import InputSubmit from "../../components/InputSubmit";

const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!) {
        obtenerProducto(id: $id) {
            precio,
            nombre,
            existencia,
        }
    }
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input) {
            id,
            nombre,
            existencia,
            precio,
        }
    }
`;

function EditarProducto() {
    const [mensaje, setMensaje] = useState("");
    const [success, setSuccess] = useState(false);

    const router = useRouter();
    const { query: { id } } = router;

    const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });

    const [ actualizarProducto ] = useMutation(ACTUALIZAR_PRODUCTO);

    const schemaValidator = Yup.object({
        nombre: Yup.string()
            .required('El nombre del producto es obligatorio'),
        existencia: Yup.number()
            .required('Agrega una cantidad disponible')
            .positive('No se aceptan número negativos')
            .integer('El número debe ser un entero'),
        precio: Yup.number()
            .required('El precio es obligatorio')
            .positive('No se aceptan número negativos')
    });

    if (loading) return <Spinner />

    const { obtenerProducto } = data;

    const actualizarInfoProducto = async valores => {
        const { nombre, existencia, precio } = valores;

        try {
            const { data } = await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre,
                        existencia,
                        precio,
                    }
                }
            });

            setSuccess(true);
            setMensaje("Producto actualizado");

            setTimeout(() => {
                router.push('/productos');
            },5000);
        } catch(e) {
            console.error(e);
        }
    }

    return (
        <Layout>
            <H1>Editar Producto</H1>
            <div className={"flex justify-center mt-5"}>
                <div className={"w-full max-w-lg"}>
                    <Formik
                        validationSchema={schemaValidator}
                        enableReinitialize
                        initialValues={obtenerProducto}
                        onSubmit={ ( valores ) => {
                            actualizarInfoProducto(valores);
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
                                        name={"existencia"}
                                        type={"number"}
                                        placeholder={"Ingrese la cantidad del producto"}
                                        value={props.values.existencia}
                                        handleChange={props.handleChange}
                                        handleBlur={props.handleBlur}
                                        error={props.errors.existencia}
                                        touched={props.touched.existencia}
                                    />
                                    <Input
                                        name={"precio"}
                                        type={"number"}
                                        placeholder={"Ingrese el precio del producto"}
                                        value={props.values.precio}
                                        handleChange={props.handleChange}
                                        handleBlur={props.handleBlur}
                                        error={props.errors.precio}
                                        touched={props.touched.precio}
                                    />
                                    <InputSubmit
                                        value={"Editar Producto"}
                                    />
                                </form>
                            )
                        } }
                    </Formik>
                </div>
            </div>
        </Layout>
    )
}

export default EditarProducto;