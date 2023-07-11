import H1 from "../components/H1";
import Layout from "../components/Layout";
import { gql, useMutation } from "@apollo/client";
import Input from "../components/Input";
import InputSubmit from "../components/InputSubmit";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { mostrarMensaje } from "../helpers";
import { useState } from "react";
import { useRouter } from "next/router";

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput) {
        nuevoProducto(input: $input) {
            id
            nombre
            existencia
            precio
            creado
        }
    }
`;

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos {
            id,
            nombre,
            existencia,
            precio,
            creado,
        }
    }
`;
function NuevoProducto() {
    const [mensaje, setMensaje] = useState("");
    const [success, setSuccess] = useState(false);

    const router = useRouter();

    const [ nuevoProducto ] = useMutation(NUEVO_PRODUCTO, {
        update(cache, { data: { nuevoProducto } }) {
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS });

            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [...obtenerProductos, nuevoProducto]
                }
            });
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: '',
        },
        validationSchema: Yup.object({
           nombre: Yup.string()
               .required('El nombre del producto es obligatorio'),
            existencia: Yup.number()
                .required('Agrega una cantidad disponible')
                .positive('No se aceptan número negativos')
                .integer('El número debe ser un entero'),
            precio: Yup.number()
                .required('El precio es obligatorio')
                .positive('No se aceptan número negativos')
        }),
        onSubmit: async valores => {
            const { nombre, existencia, precio } = valores;
            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            existencia,
                            precio,
                        }
                    }
                });
                if (data.nuevoProducto) {
                    setSuccess(true);
                    setMensaje("Producto creado exitosamente");

                    setTimeout(() => {
                        router.push("/productos");
                    }, 5000)
                }
            } catch(e) {
                console.error(e);
            }
        }
    });

    return (
        <Layout>
            <H1>Crear nuevo producto</H1>
            <div className={"flex justify-center mt-5"}>
                <div className={"w-full max-w-lg"}>
                    <form
                        className={"bg-white shadow-md px-8 pt-6 pb-8 mb-4"}
                        onSubmit={formik.handleSubmit}
                    >
                        { mensaje && success ? mostrarMensaje(true,mensaje) : mostrarMensaje(false,mensaje) }
                        <Input
                            name={"nombre"}
                            placeholder={"Ingrese el nombre del producto"}
                            type={"text"}
                            handleChange={formik.handleChange}
                            handleBlur={formik.handleBlur}
                            value={formik.values.nombre}
                            error={formik.errors.nombre}
                            touched={formik.touched.nombre}
                        />
                        <Input
                            name={"existencia"}
                            placeholder={"Cantidad disponible"}
                            type={"number"}
                            handleChange={formik.handleChange}
                            handleBlur={formik.handleBlur}
                            value={formik.values.existencia}
                            error={formik.errors.existencia}
                            touched={formik.touched.existencia}
                        />
                        <Input
                            name={"Precio"}
                            placeholder={"Precio del producto"}
                            type={"number"}
                            handleChange={formik.handleChange}
                            handleBlur={formik.handleBlur}
                            value={formik.values.precio}
                            error={formik.errors.precio}
                            touched={formik.touched.precio}
                        />
                        <InputSubmit
                            value={"Agregar producto"}
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoProducto;