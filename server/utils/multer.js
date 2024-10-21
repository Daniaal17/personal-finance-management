const multer = require("multer");
const path = require("path");
const fs = require("fs");
const filePath = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(filePath)) {
	fs.mkdirSync(filePath, { recursive: true });
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, filePath);
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + "-" + Date.now() + "-" + Math.random() * 100 + path.extname(file.originalname));
	},
});

//init storage
//single file to store
imageUploader = multer({
	storage: storage,
	limits: { fileSize: 20 * 1000 * 1000 }, //200MB
	fileFilter: function (req, file, cd) {
		checkImageExtension(file, cd);
	},
});

//file extension checking
function checkImageExtension(file, cd) {
	//declaring file types
	const filetype = /png|jpeg|svg|jpg|/;
	//extracting file extension
	const extname = filetype.test(path.extname(file.originalname).toLowerCase());
	//mapping mimetype
	const mimetype = filetype.test(file.mimetype);

	if (mimetype && extname) {
		return cd(null, true);
	} else {
		return cd("Error: File type not supported!");
	}
}

module.exports = {
	imageUploader,
};
