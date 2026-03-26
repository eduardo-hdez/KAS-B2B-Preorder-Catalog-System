export const ROL_CLIENTE = 'ROL-CLI';
export const ROL_EMPLEADO = 'ROL-EMP';

export function requireRol(roles) {
  return (request, response, next) => {
    if (!request.session?.idUsuario) {
      return response.redirect('/login');
    }
    if (!roles.includes(request.session.idRol)) {
      return response.redirect('/login');
    }
    next();
  };
}
