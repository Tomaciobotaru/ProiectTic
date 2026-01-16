export const notFound = (req, res) => {
  res.status(404).json({
    error: 'Ruta nu exista',
    path: req.originalUrl
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;
  const payload = {
    error: err.message || 'Internal server error'
  };

  if (process.env.NODE_ENV === 'development') {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
};
