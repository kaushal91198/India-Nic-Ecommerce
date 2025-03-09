import path from 'path';
import multer, { FileFilterCallback } from 'multer';


const imageFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (
        file.mimetype.includes('image/jpeg') ||
        file.mimetype.includes('image/png') ||
        file.mimetype.includes('image/jpg')
    ) {
        cb(null, true);
    } else {
        cb(null, false);
        cb(new Error('Please upload only jpeg/png/jpg files.'));
    }
};


export const uploadFileImage = multer({
    limits: { fieldSize: 25 * 1024 * 1024 },
    fileFilter: imageFilter,
    storage: multer.diskStorage({
        destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
            cb(null, path.join(__dirname, '../../public/images'));
        },
        filename: function (req: any, file: { originalname: string; }, cb: (arg0: null, arg1: string) => void) {
            cb(null, Date.now() + '_' + file.originalname);
        },
    }),
});

