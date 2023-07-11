import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Input from "../components/Input";
import { gql, useMutation } from "@apollo/client";
import ErrorParagraph from "../components/ErrorParagraph";
import SuccessParagraph from "../components/SuccessParagraph";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import InputSubmit from "../components/InputSubmit";

const AUTENTICAR_USUARIO = gql`
    mutation autentitcarUsuario($input: AutenticarInput) {
      autenticarUsuario(input: $input) {
        token
      }
    }
`;

function IniciarSesion() {
    const [mensaje, setMensaje] = useState("");
    const [success, setSuccess] = useState(false);
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("El email no es válido")
                .required("El email es requerido"),
            password: Yup.string()
                .required("La contraseña es obligatoria")
        }),
        onSubmit: async valores => {
            // console.log(valores);
            const { email, password } = valores;
            try {
                const { data } = await autenticarUsuario({
                    variables: {
                        input: {
                            email,
                            password,
                        }
                    }
                });
                /**
                 * @typedef {Object} autenticarUsuario
                 * @typedef {Object} Data
                 * @property {autenticarUsuario} autenticarUsuario
                 */
                // console.log(data);
                setMensaje("Su usuario ha sido autenticado");
                setSuccess(true);

                const { token } = data.autenticarUsuario;
                sessionStorage.setItem('token',token);

                setTimeout(() => {
                    router.push("/");
                }, 3000);

            } catch(e) {
                console.error(e);
                setMensaje(e.message);
                setSuccess(false);

                setTimeout(() => {
                    setMensaje("");
                }, 5000)
            }
        }
    });

    const mostrarMensaje = (bool = false) => {
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
    return (
        <Layout>
            <h1 className={"text-center text-2xl text-white font-medium"}>Iniciar sesión</h1>
            <div className={"flex justify-center mt-5"}>
                <div className={"w-full max-w-sm"}>
                    <form
                        className={"bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"}
                        onSubmit={formik.handleSubmit}
                    >
                        { mensaje && success ? mostrarMensaje(true) : mostrarMensaje(false) }
                        <Input
                            name={"email"}
                            type={"email"}
                            placeholder={"Ingrese su email"}
                            value={formik.values.email}
                            handleChange={formik.handleChange}
                            handleBlur={formik.handleBlur}
                            error={formik.errors.email}
                            touched={formik.touched.email}
                        />
                        <Input
                            name={"password"}
                            type={"password"}
                            placeholder={"Ingrese su contraseña"}
                            value={formik.values.password}
                            handleChange={formik.handleChange}
                            handleBlur={formik.handleBlur}
                            error={formik.errors.password}
                            touched={formik.touched.password}
                        />
                        <InputSubmit
                            value={"Iniciar sesión"}
                        />
                        <p className={"mt-5 text-center"}>
                            ¿No tiene una cuenta? <Link href={"/registro"}>
                            <span className={"text-sky-800 hover:text-sky-900"}>Registrarse</span>
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default IniciarSesion;