import multer from 'multer';

// Where to store the image
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now(+'_' + Math.round(Math.random() * 1e9));
    const filename = file.originalname.split('.')[0];
    cb(null, filename + '_' + uniqueSuffix + '.png');
  },
});

// Export upload
export const upload = multer({ storage: storage });

