const Token = require("../models/token")

exports.protegirRuta = async function (req, res, next) {
  // Obtenir el toquen de la capçelera 'Authorization'
  const headerToken = req.headers.authorization.substring(7);
  

  // Verifica si sa proporcionat el token
  if (!headerToken) {
    return res.status(401).json({ mensaje: "Se requiere un token para acceder a esta ruta" });
  }

  await Token.findOne({token: headerToken}).exec((err, token) => {
    if(err) res.status(401).json({ mensaje: "El token proporcionat no es valid" });
    if(token.token == headerToken) next();
  });
}
