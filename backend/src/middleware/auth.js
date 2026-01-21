export function requireRole(roles) {
  return (req, res, next) => {
    const { rol } = req.headers;
    if (!roles.includes(rol)) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }
    next();
  };
}
