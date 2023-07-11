require('dotenv').config({ path: '../config/.env' });
const Usuario = require('../models/Usuarios');
const Producto = require('../models/Productos');
const Cliente = require('../models/Clientes');
const Pedido = require('../models/Pedidos');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const crearToken = (usuario, secret, expiration) => {
    const { id, email, nombre, apellido } = usuario;

    return jwt.sign( { id, email , nombre, apellido }, secret, { expiresIn: expiration } );
}

// Resolvers
const resolvers = {
    Query: {
        obtenerUsuario: async (_, {}, ctx) => {
            return ctx.usuario;
        },
        obtenerProductos: async () => {
            try {
                return await Producto.find({});
            } catch(e) {
                console.error(e);
            }
        },
        obtenerProducto: async (_,{ id }) => {
            if(!/^[0-9a-fA-F]{24}$/.test(id)) {
                throw new Error("No es un ID valido");
            }

            const producto = await Producto.findById(id);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            return producto;
        },
        obtenerClientes: async () => {
            try {
                return await Cliente.find({});
            } catch(e) {
                console.error(e)
            }
        },
        obtenerClientesVendedor: async (_, {}, ctx) => {
            try {
                return await Cliente.find({vendedor: `${ctx.usuario.id}`});
            } catch(e) {
                console.error(e)
            }
        },
        obtenerCliente: async (_,{ id }, ctx) => {
            const cliente = await Cliente.findById(id);

            if (!cliente) {
                throw new Error('Cliente no encontrado');
            }

            if (cliente.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales correspondientes');
            }

            return cliente;
        },
        obtenerPedidos: async () => {
            try {
                return await Pedido.find({});
            } catch(e) {
                console.error(e)
            }
        },
        obtenerPedidosVendedor: async (_,{  }, ctx) => {
            try {
                return await Pedido.find({ vendedor: ctx.usuario.id }).populate('cliente');
            } catch(e) {
                console.error(e)
            }
        },
        obtenerPedido: async (_,{id},ctx) => {
            const pedido = await Pedido.findById(id);

            if (!pedido) {
                throw new Error('Pedido no encontrado');
            }

            if (pedido.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales adecuadas');
            }

            return pedido;
        },
        obtenerPedidosEstado: async (_,{ estado },ctx) => {
            const pedidos = await Pedido.find({ vendedor: ctx.usuario.id, estado });

            return pedidos;
        },
        mejoresClientes: async () => {
            const clientes = await Pedido.aggregate([
                { $match: { estado: "COMPLETADO" } },
                { $group: {
                        _id: "$cliente",
                        total: { $sum: "$total" }
                    }
                },
                {
                    $lookup: {
                        from: 'clientes',
                        localField: '_id',
                        foreignField: "_id",
                        as: "cliente"
                    }
                },
                {
                    $limit: 5
                },
                {
                    $sort: { total: -1 }
                }
            ]);

            return clientes;
        },
        mejoresVendedores: async () => {
            const vendedores = await Pedido.aggregate([
                { $match: { estado: "COMPLETADO" } },
                { $group: {
                    _id: "$vendedor",
                    total: { $sum: "$total" }
                } },
                {
                    $lookup: {
                        from: 'usuarios',
                        localField: '_id',
                        foreignField: "_id",
                        as: "vendedor"
                    }
                },
                {
                    $limit: 5
                },
                {
                    $sort: { total: -1 }
                }
            ]);

            return vendedores;
        },
        buscarProducto: async (_, {texto}) => {
            const productos = await Producto.find({ $text: { $search: texto } }).limit(10);

            return productos;
        }
    },
    Mutation: {
        nuevoUsuario: async (_,{ input }, ctx) => {
            const { email, password } = input;
            // Revisar si ya existe el usuario
            const existeUsuario = await Usuario.findOne({email});

            if (existeUsuario) {
                throw new Error('El usuario ya está registrado');
            }

            // Hash Password
            const salt = await bcryptjs.genSaltSync(12);
            input.password = await bcryptjs.hash(password,salt);

            //Guardar en BBDD
            try {
                const usuario = new Usuario(input);
                usuario.save();
                return usuario;
            } catch (e) {
                console.error(e);
            }
        },

        autenticarUsuario: async (_, {input} ) => {
            const { email,password } = input;

            // Si el usuario existe
            const existeUsuario = await Usuario.findOne({email});

            if (!existeUsuario) {
                throw new Error('El usuario no existe en nuestra base de datos');
            }

            // Revisar la password
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);

            if (!passwordCorrecto) {
                throw new Error('Las credenciales no son válidas');
            }

            // Crear token
            return {
                token: crearToken(existeUsuario, process.env.SECRET_WORD, '24h')
            }
        },

        nuevoProducto: async (_, { input }) => {
            try {
                const producto = new Producto(input);

                return await producto.save();
            } catch (e) {
                console.error(e);
            }
        },

        actualizarProducto: async (_, { id, input }) => {
            try {
                let producto = await Producto.findById(id);
                if (!producto) {
                    throw new Error('Producto no encontrado');
                }

                producto = await Producto.findOneAndUpdate({_id: id}, input, { new: true });

                return producto;
            } catch(e) {
                console.error(e);
            }
        },

        eliminarProducto: async (_,{ id }) => {
            let producto = await Producto.findById(id);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            try {
                await Producto.findByIdAndDelete({_id: id});
                return "Producto eliminado";
            } catch(e) {
                console.error(e)
            }
        },

        nuevoCliente: async (_, { input }, ctx) => {
            const { email } = input;
            const cliente = await Cliente.findOne({ email });

            if (cliente) {
                throw new Error('Cliente ya registrado');
            }

            const nuevoCliente = new Cliente(input);

            nuevoCliente.vendedor = ctx.usuario.id;

            try {
                return await nuevoCliente.save();
            } catch(e) {
                console.error(e)
            }
        },
        actualizarCliente: async (_,{ id, input },ctx) => {
            let cliente = await Cliente.findById(id);

            if (!cliente) {
                throw new Error('Este cliente no existe');
            }

            if (cliente.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales correspondientes');
            }

            cliente = await Cliente.findOneAndUpdate({_id: id}, input, { new: true });
            return cliente;
        },
        eliminarCliente: async (_,{ id }, ctx) => {
            if(!/^[0-9a-fA-F]{24}$/.test(id)) {
                throw new Error("No es un ID válido");
            }

            const cliente = await Cliente.findById(id);

            if (!cliente) {
                throw new Error('Este cliente no existe');
            }

            if (cliente.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales correspondientes');
            }

            await Cliente.findOneAndDelete({ _id: id });

            return "Cliente eliminado";
        },
        nuevoPedido: async (_, { input }, ctx) => {
            const { cliente } = input;

            if(!/^[0-9a-fA-F]{24}$/.test(cliente)) {
                throw new Error("No es un cliente válido");
            }

            const clienteExiste = await Cliente.findById(cliente);

            if (!clienteExiste) {
                throw new Error('Este cliente no existe');
            }

            if (clienteExiste.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales correspondientes');
            }

            for await (const articulo of input.pedido) {
                const { id } = articulo;

                const producto = await Producto.findById(id);

                if (articulo.cantidad > producto.existencia) {
                    throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`);
                } else {
                    producto.existencia = producto.existencia - articulo.cantidad;

                    await producto.save();
                }
            }

            const nuevoPedido = new Pedido(input);
            nuevoPedido.vendedor = ctx.usuario.id;

            return await nuevoPedido.save();
        },
        actualizarPedido: async (_, { id, input }, ctx) => {
            const { cliente } = input;
            const existePedido = await Pedido.findById(id);

            if (!existePedido) {
                throw new Error('El pedido no existe');
            }

            const clienteExiste = await Cliente.findById(cliente);

            if (!clienteExiste) {
                throw new Error('El cliente no existe');
            }

            if (clienteExiste.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales correspondientes');
            }

            for await (const articulo of existePedido.pedido) {
                const { id } = articulo;

                const producto = await Producto.findById(id);

                if (articulo.cantidad > producto.existencia) {
                    throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`);
                } else if (input.cantidad){
                    producto.existencia = producto.existencia + articulo.cantidad - input.cantidad;

                    await producto.save();
                }
            }

            try {
                const resultado = await Pedido.findOneAndUpdate({ _id: id }, input, { new: true });
                return resultado;
            } catch(e) {
                console.error(e)
            }
        },
        eliminarPedido: async (_, { id } ,ctx) => {
            const existePedido = await Pedido.findById(id);

            if (!existePedido) {
                throw new Error('El pedido no existe');
            }

            if (existePedido.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales necesarias para esta acción');
            }

            await Pedido.findOneAndDelete({ _id: id });

            return 'Pedido eliminado';
        }
    }
}

module.exports = resolvers;