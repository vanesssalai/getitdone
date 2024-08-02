const User = require('../models/Users.cjs');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, username, password: hashedPassword });
        await user.save();
        const createdUser = await User.findById(user._id).select('_id username email');
        res.status(201).json({ 
            message: 'User created successfully',
            user: createdUser
        });
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body; 
        if (!identifier || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email/username or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email/username or password' });
        }

        res.json({ 
            message: 'Logged in successfully',
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

exports.fetchProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({ user, msg: 'Fetched Profile Successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Error Fetching Profile' });
    }
}