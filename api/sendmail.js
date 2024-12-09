const nodemailer = require('nodemailer');
const multer = require('multer');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Set up storage for multer (in-memory storage for file upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('attachments');

// Create a transporter using Gmail's SMTP server
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.GMAIL_USER,  // Your Gmail address
        pass: process.env.GMAIL_PASS,  // Your Gmail App password
    },
});

// API route for sending the email
module.exports = (req, res) => {
    if (req.method === 'POST') {
        // Verify Firebase User's ID Token for Authentication
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        
        if (!idToken) {
            return res.status(403).json({ error: 'No ID token provided' });
        }

        admin.auth().verifyIdToken(idToken)
            .then((decodedToken) => {
                const userEmail = decodedToken.email; // Firebase user's email

                // Parse the incoming form data with file attachments
                upload(req, res, async (err) => {
                    if (err) {
                        console.error('Error uploading file:', err);
                        return res.status(400).json({ error: 'Error uploading file' });
                    }

                    console.log('Uploaded Files:', req.files);
                    console.log('Request Body:', req.body);

                    const { email, subject, name, phone, businessName, style, colors, message } = req.body;

                    // Validate required fields
                    if (!email || !subject || !name || !message) {
                        return res.status(400).json({ error: 'Missing required fields' });
                    }

                    const mailOptions = {
                        from: userEmail, // Gmail account used for sending email
                        to: process.env.GMAIL_USER, // Recipient's email address (Firebase user's email or other)
                        subject: subject,
                        text: `
                            Name: ${name}
                            Email: ${email}
                            Phone: ${phone || 'N/A'}
                            Business Name: ${businessName || 'N/A'}
                            Preferred Style: ${style || 'N/A'}
                            Preferred Colors: ${colors || 'N/A'}
                            Message: ${message}`,
                        attachments: [], // Initialize attachments array
                    };

                    // Add files to the attachments array
                    if (req.files) {
                        req.files.forEach(file => {
                            mailOptions.attachments.push({
                                filename: file.originalname,
                                content: file.buffer,
                                encoding: 'base64',
                            });
                        });
                    }

                    try {
                        const info = await transporter.sendMail(mailOptions);
                        console.log('Email sent: ' + info.response);
                        res.status(200).json({ message: 'Email sent successfully!' });
                    } catch (error) {
                        console.error('Error sending email:', error);
                        res.status(500).json({ error: 'Error sending email' });
                    }
                });
            })
            .catch((error) => {
                console.error('Error verifying Firebase ID token:', error);
                return res.status(403).json({ error: 'Unauthorized' });
            });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
