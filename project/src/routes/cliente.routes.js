const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
  response.render('cliente/catalogo-productos', { title: 'Catalogo de Productos' });
});

router.get('/catalogo', (request, response) => {
  response.render('cliente/catalogo-productos', { title: 'Catalogo de Productos' });
});

router.get('/carrito-reserva', (request, response) => {
  response.render('cliente/carrito-reserva', { title: 'Carrito' });
});

router.get('/detalle-producto', (request, response) => {
  response.render('cliente/detalle-producto', { title: 'Detalle de Producto' });
});

router.get('/historial-reservas', (request, response) => {
  response.render('cliente/historial-reservas', { title: 'Historial de Reservas' });
});

router.get('/detalle-reserva', (request, response) => {
  response.render('cliente/detalle-reserva', { title: 'Detalle de Reserva' });
});

router.get('/info-perfil', (request, response) => {
  response.render('cliente/info-perfil', { title: 'Información del Perfil' });
});

module.exports = router;
