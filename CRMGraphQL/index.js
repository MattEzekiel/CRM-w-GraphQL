const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const conectarDB = require('./config/db');
require('dotenv').config({ path: '../config/.env' });
const jwt = require('jsonwebtoken');

// Conectar a la base de datos
conectarDB();

// Servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        // console.log(req.headers);
        const token = req.headers['authorization'] || '';
        if (token) {
            try {
                const usuario = jwt.verify(token.replace('Bearer ',""), process.env.SECRET_WORD);
                // console.log(usuario);
                return {
                    usuario
                }
            } catch(e) {
                console.error('Hubo un error');
                console.error(e);
            }
        }
    }
});

// Servidor start
server.listen().then(({url}) =>{
   console.log(`Servidor listo en la url ${url}`);
});