import Layout from "../components/Layout";
import H1 from "../components/H1";
import Input from "../components/Input";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import {useState} from "react";
import { mostrarMensaje } from "../helpers";
import InputSubmit from "../components/InputSubmit";

const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput) {
      nuevoCliente(input: $input) {
        id,
        nombre,
        apellido,
        empresa,
        email,
        telefono
      }
    }
`;

const OBTENER_CLIENTES_USUARIO = gql`
    query obtenerClientesVendedor {
      obtenerClientesVendedor {
        nombre,
        apellido,
        email,
        empresa
      }
    }
`;


function NuevoCliente() {
    const [mensaje, setMensaje] = useState("");
    const [success, setSuccess] = useState(false);
    const [ nuevoCliente ] = useMutation(NUEVO_CLIENTE, {
        update(cache, { data: { nuevoCliente } }) {
            const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO })
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: [...obtenerClientesVendedor,nuevoCliente]
                }
            })
        }
    });
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            nombre: "",
            apellido: "",
            empresa: "",
            email: "",
            telefono: ""
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required("El nombre es obligatorio"),
            apellido: Yup.string()
                .required("El apellido es obligatorio"),
            empresa: Yup.string()
                .required("El nombre de la empresa es obligatorio"),
            email: Yup.string()
                .required("El email es obligatorio")
                .email("El email no es válido"),
        }),
        onSubmit: async valores => {
            const { nombre, apellido, empresa, email, telefono } = valores;

            try {
                await nuevoCliente({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono,
                        }
                    }
                });
                await router.push("/");
                setSuccess(true);
            } catch(e) {
                console.error(e);
                setMensaje(e.message);
                
                setTimeout(() => {
                    setMensaje("");
                },5000);
            }
        }
    });

    return (
        <Layout>
            <H1>Nuevo Cliente</H1>
            <div className={"flex justify-center mt-5"}>
                <div className={"w-full max-w-lg"}>
                    <form
                        className={"bg-white shadow-md px-8 pt-6 pb-8 mb-4"}
                        onSubmit={formik.handleSubmit}
                    >
                        { mensaje && success ? mostrarMensaje(true,mensaje) : mostrarMensaje(false,mensaje) }
                        <Input
                            name={"nombre"}
                            type={"text"}
                            placeholder={"Ingrese el nombre del cliente"}
                            value={formik.values.nombre}
                            handleChange={formik.handleChange}
                            handleBlur={formik.handleBlur}
                            error={formik.errors.nombre}
                            touched={formik.touched.nombre}
                        />
                        <Input
                            name={"apellido"}
                            type={"text"}
                            placeholder={"Ingrese el apellido del cliente"}
                            value={formik.values.apellido}
                            handleChange={formik.handleChange}
                            handleBlur={formik.handleBlur}
                            error={formik.errors.apellido}
                            touched={formik.touched.apellido}
                        />
                        <Input
                            name={"empresa"}
                            type={"text"}
                            placeholder={"Ingrese el nombre de la empresa"}
                            value={formik.values.empresa}
                            handleChange={formik.handleChange}
                            handleBlur={formik.handleBlur}
                            error={formik.errors.empresa}
                            touched={formik.touched.empresa}
                        />
                        <Input
                            name={"email"}
                            type={"email"}
                            placeholder={"Ingrese el email de contacto"}
                            value={formik.values.email}
                            handleChange={formik.handleChange}
                            handleBlur={formik.handleBlur}
                            error={formik.errors.email}
                            touched={formik.touched.email}
                        />
                        <Input
                            name={"telefono"}
                            type={"tel"}
                            placeholder={"Ingrese el telefono de contacto"}
                            value={formik.values.telefono}
                            handleChange={formik.handleChange}
                            handleBlur={formik.handleBlur}
                        />
                        <InputSubmit
                            value={"Registrar cliente"}
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoCliente;