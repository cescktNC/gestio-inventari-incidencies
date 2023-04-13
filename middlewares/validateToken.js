const Token = require("../models/token");
const jwt = require('jsonwebtoken');
const secret = 'secretDelToken';


exports.protegirRuta = async function (req, res, next) {
  // Obtenir el toquen de la capçelera 'Authorization'
  const headerToken = req.headers.authorization.substring(7);
  
  // Verifica si sa proporcionat el token
  if (headerToken === undefined) {
    return res.status(401).json({ message: "Es requereix un token per accedir a la ruta" });
  }

  await Token.findOne({token: headerToken}).exec((err, token) => {
    if(err) res.status(401).json({ message: "El token proporcionat no es valid" });

    try {
      const decodedToken = jwt.verify(token.token, secret, { ignoreExpiration: false });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        res.status(401).json({ message: "El token ha expirat" });
      } else {
        res.status(401).json({ message: "Error al comprobar el token" });
      }
    }
  });
}
// 