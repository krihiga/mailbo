const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const multer = require('multer');
const express = require('express');

admin.initializeApp();

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Express app for handling routes
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

exports.sendMail = functions.https.onRequest((req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
     upload.array('attachments'), async (req, res) => {
    try {
        const { email, subject, name, phone, businessName, style, colors, message } = req.body;

        // Validate required fields
        if (!email || !subject || !name || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Construct the email
        const mailOptions = {
            from: email,
            to: process.env.GMAIL_USER,
            subject: subject,
            text: `
                Name: ${name}
                Email: ${email}
                Phone: ${phone || 'N/A'}
                Business Name: ${businessName || 'N/A'}
                Preferred Style: ${style || 'N/A'}
                Preferred Colors: ${colors || 'N/A'}
                Message: ${message}
            `,
            attachments: req.files.map(file => ({
                filename: file.originalname,
                content: file.buffer,
            })),
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
    }
}
});

// Export the Cloud Function
exports.sendMail = functions.https.onRequest(app);
