const { connectToMongoDB } = require('../connect');
const File = require('../../models/File');
const multer = require('multer');
const aws = require('aws-sdk');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Configure AWS S3
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

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

    // Authenticate the user
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    await connectToMongoDB(process.env.MONGODB_URI);

    try {
        await parseForm(req);
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const cryptoKey = generateCryptoKey(req.file.buffer);

        // Upload to S3
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${Date.now()}-${req.file.originalname}`,
            Body: req.file.buffer,
            ACL: 'private'
        };

        const s3Upload = s3.upload(params).promise();

        // Timeout after 8 seconds
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('S3 upload timed out')), 8000)
        );

        const s3Response = await Promise.race([s3Upload, timeout]);

        // Save to database
        const file = new File({
            filename: s3Response.Key,
            originalName: req.file.originalname,
            s3Key: s3Response.Key,
            size: req.file.size,
            cryptoKey: cryptoKey,
            userId: req.user.userId
        });
        await file.save();

        res.status(200).json({ cryptoKey: cryptoKey });
    } catch (err) {
        console.error(err);
        if (err.message === 'S3 upload timed out') {
            res.status(504).json({ message: 'File upload timed out. Please try again.' });
        } else {
            res.status(500).json({ message: 'An error occurred during file upload.' });
        }
    }
};
