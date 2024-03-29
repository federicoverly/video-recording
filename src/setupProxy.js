module.exports = app => {
  app.use((_, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Opener-Policy', 'credentialless');
    next();
  });
};
