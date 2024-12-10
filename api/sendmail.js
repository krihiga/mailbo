const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const multer = require('multer');
const express = require('express');

admin.initializeApp();

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Express app setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.GMAIL_USER, // Sender's email
        pass: process.env.GMAIL_PASS, // App password
    },
});

// Route to handle sending email
app.post('https://mailbo.vercel.app/api/sendMail', upload.array('attachments'), async (req, res) => {
    try {
        const { email, subject, name, phone, businessName, style, colors, message } = req.body;

        // Validate required fields
        if (!email || !subject || !name || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Email options
        const mailOptions = {
            from: email,
            to: process.env.GMAIL_USER, // Admin's email
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

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Export Firebase Cloud Function
exports.sendMail = functions.https.onRequest(app);
