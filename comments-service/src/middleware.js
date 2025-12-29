export const logging = (req, res, next) => {
  console.info(`[${new Date().toISOString()}]:[${req.method}]:[${req.path}]`);
  next();
};
