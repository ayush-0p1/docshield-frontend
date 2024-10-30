const { connectToMongoDB } = require('../connect');
const User = require('../../models/User');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToMongoDB(process.env.MONGODB_URI);

    const { firstName, lastName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ firstName, lastName, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error signing up. Please try again.' });
    }
};
