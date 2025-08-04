// const multer = require('multer');

// const storage = multer.memoryStorage();

// const upload = multer({ storage });

// module.exports = upload;


// middleware/multer.js
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;