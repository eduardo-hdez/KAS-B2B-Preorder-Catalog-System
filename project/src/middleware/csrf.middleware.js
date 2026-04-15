import {csrfSync} from 'csrf-sync';

const {csrfSynchronisedProtection, generateToken} = csrfSync({
  getTokenFromRequest: (request) => request.body._csrf,
});

function csrfTokenLocalsMiddleware(request, response, next) {
  response.locals.csrfToken = generateToken(request);
  next();
}

export {csrfSynchronisedProtection, csrfTokenLocalsMiddleware};
