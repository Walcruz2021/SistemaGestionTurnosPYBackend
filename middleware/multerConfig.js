import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        files: 3,
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

export default upload;