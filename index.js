const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const corsOptions = {
    origin: '*', 
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    // credentials: true // Enable credentials
};

app.use(cors(corsOptions));

// Replace with your actual connection string
const mongoConnectionString = process.env.MONGODB_URI;

mongoose.connect(mongoConnectionString).then((conn) => {
    mongoose.set("strictQuery", false);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
})

const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'] // Simple regex for email validation
    }
});

const Email = mongoose.model('Email', emailSchema);

// Middleware for bearer token authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    if (token !== process.env.AUTH) return res.sendStatus(403);
    next(); // Token is authenticated, proceed to the route
};

//public join waitlist
app.post('/joinwaitlist', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({ message: 'Email address is required.' });
    }

    try {
        const newEmail = new Email({ email });
        await newEmail.save();
        res.status(200).send({ message: 'Email added to the waitlist.' });
    } catch (error) {
        if (error.code === 11000) { //catch dup err
            res.status(409).send({ message: 'This email is already on the waitlist.' });
        } else { //return generic msg for other err
            console.log(error) //log err for debug purpose
            res.status(500).send({ message: 'An error occurred while processing your request.' });
        }
        // res.status(500).send({ message: error.message });
    }
});

//admin get all waitlists
app.get('/getwaitlist', authenticateToken, async (req, res) => {
    try {
        const emails = await Email.find().select('email -_id');
        res.status(200).send(emails.map(e => e.email));
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Handle undefined routes
app.use('*', (req, res) => {
    res.status(404).send('H3llo MudaFvcka 😏');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
