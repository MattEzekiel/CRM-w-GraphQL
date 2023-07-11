import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Input from "../components/Input";
import { useMutation, gql } from "@apollo/client";
import {useState} from "react";
import ErrorParagraph from "../components/ErrorParagraph";
import SuccessParagraph from "../components/SuccessParagraph";
import { useRouter } from "next/router";
import Link from "next/link";
import InputSubmit from "../components/InputSubmit";

const NUEVA_CUENTA = gql`
    mutation nuevoUsuario($input: UsuarioInput) {
      nuevoUsuario(input: $input) {
        id
        nombre
        apellido
        email
      }
    }
`;
function Registro() {
    const [mensaje, setMensaje] = useState("");
    const [success, setSuccess] = useState(false);
    const [nuevoUsuario] = useMutation(NUEVA_CUENTA);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: '',
        },
        validationSchema : Yup.object({
            nombre: Yup.string()
                .required('El nombre es obligatorio'),
            apellido: Yup.string()
                .required('El apellido es obligatorio'),
            email: Yup.string()
                .required('El email es obligatorio')
                .email('El email no es válido'),
            password: Yup.string()
                .required('La contraseña es obligatoria')
                .min(6,'La contraseña es muy corta'),
        }),
        onSubmit: async valores => {
            const { nombre, apellido, email, password } = valores;

            try {
                const { data } = await nuevoUsuario({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password,
                        }
                    }
                });

                /**
                 * @typedef {Object} nuevoUsuario
                 * @typedef {Object} Data
                 * @property {nuevoUsuario} nuevoUsuario
                 */
                setMensaje(`Usuario: ${data.nuevoUsuario.email} creado correctamente`);
                setSuccess(true);

                setTimeout(() => {
                    router.push("/");
                },5000);

            } catch(e) {
                console.error(e);
                setMensaje(e.message);
                setSuccess(false);

                setTimeout(() => {
                    setMensaje("");
                },5000)
            }
        },
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
            <h1 className={"text-center text-2xl text-white font-medium"}>Registrarse</h1>
            <div className={"flex justify-center mt-5"}>
                <div className={"w-full max-w-sm"}>
                    <form
                        className={"bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"}
                        onSubmit={formik.handleSubmit}
                    >
                        { mensaje && success ? mostrarMensaje(true) : mostrarMensaje(false) }
                        <Input
                            name={"nombre"}
                            type={"text"}
                            placeholder={"Ingrese su nombre"}
                            value={formik.values.nombre}
                            handleChange={formik.handleChange}
                            handleBlur={formik.handleBlur}
                            error={formik.errors.nombre}
                            touched={formik.touched.nombre}
                        />
                        <Input
                            name={"apellido"}
                            type={"text"}
                            placeholder={"Ingrese su apellido"}
                            value={formik.values.apellido}
                            handleChange={formik.handleChange}
                            handleBlur={formik.handleBlur}
                            error={formik.errors.apellido}
                            touched={formik.touched.apellido}
                        />
                        <Input
                            name={"email"}
                            type={"email"}
                            placeholder={"Ingrese un email"}
                            value={formik.values.email}
                            handleChange={formik.handleChange}
                            handleBlur={formik.handleBlur}
                            error={formik.errors.email}
                            touched={formik.touched.email}
                        />
                        <Input
                            name={"password"}
                            type={"password"}
                            placeholder={"Ingrese una contraseña"}
                            value={formik.values.password}
                            handleChange={formik.handleChange}
                            handleBlur={formik.handleBlur}
                            error={formik.errors.password}
                            touched={formik.touched.password}
                        />
                        <InputSubmit
                            value={"Registrarse"}
                        />
                        <p className={"mt-5 text-center"}>
                            ¿Ya tiene una cuenta? <Link href={"/iniciar-sesion"}>
                            <span className={"text-sky-800 hover:text-sky-900"}>Inicie Sesión</span>
                        </Link>
                        </p>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default Registro;