const nodemailer = require('nodemailer');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('attachments');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,  
        pass: process.env.GMAIL_PASS,  
    },
});

module.exports = (req, res) => {
    if (req.method === 'POST') {
        upload(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(400).json({ error: 'Error uploading file' });
            }

            const { email, subject, name, phone, businessName, style, colors, message } = req.body;

            if (!email || !subject || !name || !message) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const mailOptions = {
                from: process.env.GMAIL_USER, // Must match the authenticated email
                replyTo: email,              // Use the Firebase user's email for reply-to
                to: process.env.GMAIL_USER,  // Recipient's email address (your GMAIL_USER)
                subject: subject,
                text: `
                    Name: ${name}
                    Email: ${email}
                    Phone: ${phone || 'N/A'}
                    Business Name: ${businessName || 'N/A'}
                    Preferred Style: ${style || 'N/A'}
                    Preferred Colors: ${colors || 'N/A'}
                    Message: ${message}`,
                attachments: [],
            };

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
                res.status(500).json({ error: 'Error sending email: ' + error.message });
            }
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
