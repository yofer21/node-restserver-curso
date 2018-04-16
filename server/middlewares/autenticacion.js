const jwt = require('jsonwebtoken');

// =======================================
//  Verificar Token
// =======================================
let verificaToken = (req, res, next) => {

  let token = req.get('token');

  jwt.verify(token, process.env.SEED, (err, decoded) => {

    if (err) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Token no valido',
        err
      });
    }

    req.usuario = decoded.usuario;

    next();

  });


};

// =======================================
//  Verifica Admin_Role
// =======================================
let verificaAdmin_Role = (req, res, next) => {

  let usuario = req.usuario;

  if (usuario.role === 'ADMIN_ROLE') {
    return next();
  } else {
    return res.status(401).json({
      ok: false,
      mensaje: 'El usuario no es administrador'
    });
  }


};

module.exports = {
  verificaToken,
  verificaAdmin_Role
}