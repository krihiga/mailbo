const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const multer = require('multer');

// Initialize Firebase Admin
admin.initializeApp();

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('attachments');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.GMAIL_USER, // Environment variable for sender email
        pass: process.env.GMAIL_PASS, // Environment variable for sender password
    },
});

// Cloud Function to send email
const sendEmail = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Use Multer to handle file uploads
    upload(req, res, async (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(400).json({ error: 'Error uploading file' });
        }

        try {
            const { userId, email, subject, name, phone, businessName, style, colors, message } = req.body;

            // Validate required fields
            if (!userId || !email || !subject || !name || !message) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Construct the email
            const mailOptions = {
                from: process.env.GMAIL_USER, // Sender email
                to: process.env.GMAIL_USER, // Receiver email (your admin email)
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
                // Attachments (if any)
                attachments: req.files.map(file => ({
                    filename: file.originalname,
                    content: file.buffer,
                })),
            };

            // Send the email
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
            return res.status(200).json({ message: 'Email sent successfully!' });
        } catch (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Error sending email' });
        }
    });
};

// Export Cloud Function
exports.sendEmail = functions.https.onRequest(sendEmail);
