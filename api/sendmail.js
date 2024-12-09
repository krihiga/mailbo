const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const multer = require('multer');

admin.initializeApp();

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

const sendEmail = async (req, res) => {
    if (req.method === 'POST') {
        upload(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(400).json({ error: 'Error uploading file' });
            }

            const { userId, email, subject, name, phone, businessName, style, colors, message } = req.body;

            if (!userId || !email || !subject || !name || !message) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const user = auth.currentUser;
                if (!user) {
                    alert('You need to log in to send a message.');
                    return;
                }

                const userEmail = user.email;

                const mailOptions = {
                    from: userEmail,
                    to: process.env.GMAIL_USER,
                    subject: subject,
                    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nBusiness Name: ${businessName || 'N/A'}\nPreferred Style: ${style || 'N/A'}\nPreferred Colors: ${colors || 'N/A'}\nMessage: ${message}`,
                    attachments: req.files.map(file => ({
                        filename: file.originalname,
                        content: file.buffer,
                        encoding: 'base64',
                    })),
                };

                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'Email sent successfully!' });
            } catch (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ error: 'Error sending email' });
            }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};

exports.sendEmail = functions.https.onRequest(sendEmail);
