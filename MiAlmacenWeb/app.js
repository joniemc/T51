const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');

const pool = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');
const miMiddleware = require('./middleware/miMiddleware');

const app = express();

require('dotenv').config();

const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(express.json());
app.use(cors());

const authRoute = require('./routes/authRoute');
const utilsRoute = require('./routes/utilsRoute');
const usersRoute = require('./routes/usersRoute');
app.use('/',authRoute);
app.use('/utils', utilsRoute);
app.use('/api', usersRoute);

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});