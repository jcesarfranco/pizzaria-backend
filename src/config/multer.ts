import multer from 'multer';

export default {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024, // 4 MB
  },
  fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
    const allowedMimeType = ['image/jpeg', 'image/png', 'image/gif'];

    if (allowedMimeType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  },
};
