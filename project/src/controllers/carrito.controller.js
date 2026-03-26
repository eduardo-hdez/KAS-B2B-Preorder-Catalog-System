import Carrito from '../models/carrito.model.js';

async function getOrCreateCarrito(idConcesionaria) {
  const {data: carrito, error: errorGet} = await Carrito.getCartById(idConcesionaria);
  if (errorGet) return {carrito: null, error: errorGet};
  if (carrito) return {carrito, error: null};

  const {data: created, error: errorCreate} = await Carrito.createNewCart(idConcesionaria);
  if (errorCreate) return {carrito: null, error: errorCreate};

  return {
    carrito: {
      ...(created ?? {}),
      productos_seleccionados: [],
    },
    error: null,
  };
}

export async function crearCarrito(request, response) {
  const idConcesionaria = request.session.idConcesionaria;
  if (!idConcesionaria) return response.redirect('/login');

  const {error} = await getOrCreateCarrito(idConcesionaria);
  if (error) {
    return response.status(500).render('cliente/carrito-reserva', {
      title: 'Carrito',
      carrito: null,
      errorCarrito: 'Error al crear el carrito',
    });
  }

  return response.redirect('/cliente/carrito-reserva');
}

export async function agregarProductoCarrito(request, response) {
  const idConcesionaria = request.session.idConcesionaria;
  if (!idConcesionaria) return response.redirect('/login');

  const idProducto = request.body.id_producto ?? request.body.idProducto;
  const cantidadRaw = request.body.cantidad ?? 1;
  const cantidad = Math.max(1, Number(cantidadRaw) || 1);

  if (!idProducto) {
    return response.redirect('/cliente/carrito-reserva?error=sin-producto');
  }

  const {carrito, error: errorCart} = await getOrCreateCarrito(idConcesionaria);
  if (errorCart || !carrito?.id_carrito) {
    return response.redirect('/cliente/carrito-reserva?error=carrito');
  }

  const {error: errorInsert} = await Carrito.insertToCart(carrito.id_carrito, idProducto, cantidad);
  if (errorInsert) {
    return response.redirect('/cliente/carrito-reserva?error=agregar');
  }

  return response.redirect('/cliente/carrito-reserva?success=agregado');
}

export async function renderCarritoCliente(request, response) {
  const idConcesionaria = request.session.idConcesionaria;
  if (!idConcesionaria) return response.redirect('/login');

  const {carrito, error} = await getOrCreateCarrito(idConcesionaria);
  if (error) {
    return response.status(500).render('cliente/carrito-reserva', {
      title: 'Carrito',
      carrito: null,
      errorCarrito: 'Error al obtener el carrito',
    });
  }

  return response.render('cliente/carrito-reserva', {
    title: 'Carrito',
    carrito,
    errorCarrito: null,
  });
}
