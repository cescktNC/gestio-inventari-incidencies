var multer = require("multer");

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log(req._parsedOriginalUrl.pathname)
		let path = req._parsedOriginalUrl.pathname;
		path = path.slice(1, path.lastIndexOf("/"));
		cb(null, url(path));
	},
	filename: function (req, file, cb) {
		var extensio = file.originalname.slice(file.originalname.lastIndexOf("."));
		cb(null, file.fieldname + "-" + Date.now() + extensio);
	},
});

function url(path) {
	console.log(path)
	switch (path) {
		case "materials":
			return "public/URL/Imagen";
		case "planta":
			return "public/URL/imgPlanols";
		case "usuaris":
			return "public/URL/Profile";
		default:
			return "seeders";
			
	}
}

var upload = multer({ storage });

module.exports = upload;
