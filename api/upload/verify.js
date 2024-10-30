const { connectToMongoDB } = require('../connect');
const File = require('../../models/File');
const multer = require('multer');
const crypto = require('crypto');

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
}).single('document');

// Helper to parse multipart/form-data
const parseForm = (req) => {
    return new Promise((resolve, reject) => {
        upload(req, {}, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

// Helper to generate crypto key
const generateCryptoKey = (buffer) => {
    return crypto.createHash('sha256').update(buffer).digest('hex');
};

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToMongoDB(process.env.MONGODB_URI);

    try {
        await parseForm(req);
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded for verification.' });
        }

        const cryptoKey = generateCryptoKey(req.file.buffer);

        const file = await File.findOne({ cryptoKey: cryptoKey });
        if (file) {
            res.status(200).json({
                success: true,
                message: `File is authentic and verified. Uploaded at: ${file.uploadDate}`
            });
        } else {
            res.status(200).json({
                success: false,
                message: 'File verification failed. The uploaded file does not match any records.'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred during file verification.' });
    }
};
