const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const LoginSignupRoutes = require("./routes/LoginSignupRoute.cjs");
const ProjectRoutes = require("./routes/ProjectManagerRoute.cjs");
const ProfileRoutes = require("./routes/ProfileRoute.cjs");
const TaskRoutes = require("./routes/TaskRoutes.cjs");

const uri = `mongodb+srv://${encodeURIComponent(process.env.MONGO_USER)}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@vanessa.cmfcsdg.mongodb.net/task-manager?retryWrites=true&w=majority&appName=vanessa`;

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

app.use("/api/loginsignup", LoginSignupRoutes);
app.use("/api/projects", ProjectRoutes); 
app.use("/api/profile", ProfileRoutes);
app.use("/api/projects", TaskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));