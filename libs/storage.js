var multer = require("multer");

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
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
	switch (true) {
		case path.includes("materials"):
			return "public/URL/Imagen";
		case path.includes("planta"):
			return "public/URL/imgPlanols";
		case path.includes("usuaris"):
			return "public/URL/Profile";
		default:
			return "import";
			
	}
}

var upload = multer({ storage });

module.exports = upload;
