const { connectToMongoDB } = require('../connect');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToMongoDB(process.env.MONGODB_URI);

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
            res.status(200).json({ token });
        } else {
            res.status(400).json({ message: 'Invalid email or password.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in. Please try again.' });
    }
};
