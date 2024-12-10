document.getElementById('emailForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from refreshing the page

    onAuthStateChanged(auth, user => {
        if (user) {
            form.addEventListener('submit', async e => {
                e.preventDefault();

                const email = user.email;

    // Gather form inputs
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const businessName = document.getElementById('businessName').value.trim();
    const style = document.getElementById('style').value.trim();
    const colors = document.getElementById('colors').value.trim();
    const message = document.getElementById('message').value.trim();
    const fileInput = document.getElementById('file');
    const files = fileInput.files;

    // Validate required fields
    if (!email || !subject || !name || !message) {
        alert('Please fill in all required fields: Email, Subject, Name, and Message.');
        return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('businessName', businessName);
    formData.append('style', style);
    formData.append('colors', colors);
    formData.append('message', message);

    // Append files
    for (let i = 0; i < files.length; i++) {
        formData.append('attachments', files[i]);
    }

    // Send the form data to the backend API
    fetch('https://mailbo.vercel.app/api/sendMail', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send email');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Email sent successfully!');
        })
        .catch(error => {
            console.error('Error sending email:', error);
            alert('Error sending email: ' + error.message);
        });
});
