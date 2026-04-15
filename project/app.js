import 'dotenv/config';
import express from 'express';
import path from 'path';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { csrfSync } from 'csrf-sync'; //versión actual y compatible de csrf
import authRoutes from './src/routes/auth.routes.js';
import clienteRoutes from './src/routes/cliente.routes.js';
import empleadoRoutes from './src/routes/empleado.routes.js';

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

const { csrfSynchronisedProtection, generateToken } = csrfSync({
  getTokenFromRequest: (request) => request.body._csrf,
});

app.use(csrfSynchronisedProtection);

app.use((request, response, next) => { //genera el token CSRF y hacerlo variable local de todas las vistas
  response.locals.csrfToken = generateToken(request);
  next();
});

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

app.get('/', (request, response) => {
  const expired = request.query.expired === '1';
  response.redirect('/login', expired);
});

//Middleware para el manejo de error de tipo token CSRF inválido (global)
app.use((err, request, response, next) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }
  const sesionActiva = request.session && request.session.idUsuario;
  if (sesionActiva) { //la sesión aún es válida, solo el token CSRF expiró
    return response.redirect(request.originalUrl.split('?')[0] + '?invalidToken=1');
  }
  return response.redirect('/login?expired=1'); //la sesión expiró (se debe volver a iniciar sesión)
});

app.listen(3000);
