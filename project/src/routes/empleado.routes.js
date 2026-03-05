const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
  response.render('empleado/catalogo-productos', { title: 'Catalogo de Productos' });
});

router.get('/catalogo', (request, response) => {
  response.render('empleado/catalogo-productos', { title: 'Catalogo de Productos' });
});

router.get('/gestion-productos', (request, response) => {
  response.render('empleado/gestion-productos', { title: 'Gestión de Productos' });
});

router.get('/tabla-reservas', (request, response) => {
  response.render('empleado/tabla-reservas', { title: 'Tabla de Reservas' });
});

module.exports = router;
