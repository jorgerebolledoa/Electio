import express from 'express';
import auth from './routes/auth.routes.js';
import electivo from './routes/electivo.routes.js';
import postulacion from './routes/postulacion.routes.js';
import secretaria from './routes/secretaria.routes.js';
import admin from './routes/admin.routes.js';

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/auth', auth);
app.use('/electivos', electivo);
app.use('/postulaciones', postulacion);
app.use('/secretaria', secretaria);
app.use('/admin', admin);

app.listen(3000, () => {
  console.log('Backend Electio corriendo en puerto 3000');
});
