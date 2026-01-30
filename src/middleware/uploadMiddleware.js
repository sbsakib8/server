import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /zip|rar|7z/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    // Application/zip, Application/x-zip-compressed etc.
    // validating extension is simpler for this demo, keeping it strict to zip if possible.
    // allowing rar/7z for flexibility or strict per requirement.
    // Requirement: "Accept ZIP files only".

    if (path.extname(file.originalname).toLowerCase() === '.zip') {
        return cb(null, true);
    } else {
        cb(new Error('Zip files only!'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

export default upload;
