import multer from 'multer';

const SESSION_ANADIR_PRODUCTO_ERROR = 'anadirProductoError';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {fileSize: 5 * 1024 * 1024},
  fileFilter: (request, file, callback) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      callback(new Error('Solo se permiten archivos de imagen.'));
      return;
    }
    callback(null, true);
  },
});

function messageForUploadError(error) {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return 'La imagen no puede superar 5 MB.';
    }
    return 'No se pudo procesar el archivo. Intenta de nuevo.';
  }
  if (error && error.message) {
    return error.message;
  }
  return 'No se pudo procesar el archivo.';
}

export function parseProductoMultipart(request, response, next) {
  upload.single('foto')(request, response, (error) => {
    if (error) {
      console.error(error);
      request.session[SESSION_ANADIR_PRODUCTO_ERROR] = messageForUploadError(error);
      return response.redirect('/empleado/gestion-productos/anadir-producto');
    }
    next();
  });
}
