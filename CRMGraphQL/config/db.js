const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewURLParser: true,
            useUnifiedTopology: true,
            // useFindAdnModify:false,
            // useCreateIndex: true,
        });
        console.log('DB conectada')
    } catch (error) {
        console.log('Hubo un error');
        console.error(error);
        process.exit(1);
    }
}

module.exports = conectarDB;