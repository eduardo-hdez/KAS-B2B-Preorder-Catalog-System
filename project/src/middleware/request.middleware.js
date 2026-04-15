function rootRedirectMiddleware(request, response) {
  const expired = request.query.expired === '1';
  if (expired) {
    return response.redirect('/login?expired=1');
  }

  return response.redirect('/login');
}

function csrfErrorMiddleware(error, request, response, next) {
  if (error.code !== 'EBADCSRFTOKEN') {
    return next(error);
  }

  const sesionActiva = request.session && request.session.idUsuario;
  if (sesionActiva) {
    return response.redirect(`${request.originalUrl.split('?')[0]}?invalidToken=1`);
  }

  return response.redirect('/login?expired=1');
}

export {rootRedirectMiddleware, csrfErrorMiddleware};
