const express = require('express');
const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.get('/', (request, response) => {
  response.render('cliente/catalogo_productos', { title: 'Catalogo de Productos' });
});

app.get('/catalogo', (request, response) => {
  response.render('cliente/catalogo_productos', { title: 'Catalogo de Productos' });
});

app.get('/carrito', (request, response) => {
  response.render('cliente/carrito_reserva', { title: 'Carrito' });
});

app.get('/detalle_producto', (request, response) => {
  response.render('cliente/detalle_producto', { title: 'Detalle de Producto' });
});

app.get('/historial_reservas', (request, response) => {
  response.render('cliente/historial_reservas', { title: 'Historial de Reservas' });
});

app.get('/detalle_reserva', (request, response) => {
  response.render('cliente/detalle_reserva', { title: 'Detalle de Reserva' });
});

app.get('/info_perfil', (request, response) => {
  response.render('cliente/info_perfil', { title: 'Información del Perfil' });
});

app.listen(3000);
