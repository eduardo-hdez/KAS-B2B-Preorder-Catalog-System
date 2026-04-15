import 'dotenv/config';
import express from 'express';
import path from 'path';
import session from 'express-session';
import { fileURLToPath } from 'url';
import {
  csrfSynchronisedProtection,
  csrfTokenLocalsMiddleware,
} from './src/middleware/csrf.middleware.js';
import authRoutes from './src/routes/auth.routes.js';
import clienteRoutes from './src/routes/cliente.routes.js';
import empleadoRoutes from './src/routes/empleado.routes.js';
import {
  rootRedirectMiddleware,
  csrfErrorMiddleware,
} from './src/middleware/request.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 30 } // 30 minutos
}));

// Hacer que la variable este disponible en todas las vistas
app.use((request, response, next) => {
  response.locals.concesionarias = request.session.concesionarias ?? [];
  response.locals.idConcesionaria = request.session.idConcesionaria ?? null;
  next();
});

app.use(csrfSynchronisedProtection);
app.use(csrfTokenLocalsMiddleware);

app.use(authRoutes);
app.use('/cliente', clienteRoutes);
app.use('/empleado', empleadoRoutes);

// Páginas legales
app.get('/avisoprivacidad', (request, response) => {
  response.render('avisoprivacidad', { title: 'Aviso de Privacidad' });
});

app.get('/terminoscondiciones', (request, response) => {
  response.render('terminoscondiciones', { title: 'Términos y Condiciones' });
});

app.get('/', rootRedirectMiddleware);

app.use(csrfErrorMiddleware);

app.listen(3000);
