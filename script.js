document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('emailForm');

    onAuthStateChanged(auth, user => {
        if (user) {
            form.addEventListener('submit', async e => {
                e.preventDefault();

                const email = user.email;
                const subject = document.getElementById('subject').value.trim();
                const name = document.getElementById('name').value.trim();
                const phone = document.getElementById('phone').value.trim();
                const businessName = document.getElementById('businessName').value.trim();
                const style = document.getElementById('style').value.trim();
                const colors = document.getElementById('colors').value.trim();
                const message = document.getElementById('message').value.trim();
                const fileInput = document.getElementById('file');
                const files = fileInput.files;

                if (!subject || !name || !message) {
                    alert('Please fill in all required fields.');
                    return;
                }

                const formData = new FormData();
                formData.append('email', email);
                formData.append('subject', subject);
                formData.append('name', name);
                formData.append('phone', phone);
                formData.append('businessName', businessName);
                formData.append('style', style);
                formData.append('colors', colors);
                formData.append('message', message);

                for (let i = 0; i < files.length; i++) {
                    formData.append('attachments', files[i]);
                }

                try {
                    const response = await fetch('https://mailbo.vercel.app/api/sendMail', {
                        method: 'POST',  // Make sure to use POST
                        body: formData,  // Send form data
                    });

                    const data = await response.json();

                    if (response.ok) {
                        alert(data.message || 'Email sent successfully!');
                    } else {
                        alert('Error sending email: ' + (data.error || 'Unknown error'));
                    }
                } catch (error) {
                    console.error('Error sending email:', error);
                    alert('Error sending email: ' + error.message);
                }
            });
        } else {
            alert('Please log in to send an email.');
        }
    });
});
