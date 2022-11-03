var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, url(req.url));
  },
  filename: function (req, file, cb) {
    var extensio = file.originalname.slice(file.originalname.lastIndexOf('.'));
    cb(null, file.fieldname + '-' + Date.now() + extensio);
  }
});

function url(url) {
  if (url == '/create') {
    return 'public/URL/Imagen';
  }
  return 'seeders';
};

var upload = multer({ storage });

module.exports = upload;