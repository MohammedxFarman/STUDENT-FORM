document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const statusMessage = document.getElementById('form-status');

    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        const error = formGroup.querySelector('.error-message');
        input.classList.add('invalid');
        error.textContent = message;
        error.style.display = 'block';
    };

    const hideError = (input) => {
        const formGroup = input.closest('.form-group');
        const error = formGroup.querySelector('.error-message');
        input.classList.remove('invalid');
        if (error) error.style.display = 'none';
    };

    const hideGenderError = () => {
        const genderError = document.getElementById('genderError');
        genderError.style.display = 'none';
    };

    const validateForm = () => {
        let isValid = true;
        const requiredInputs = form.querySelectorAll('[required]');

        requiredInputs.forEach(input => hideError(input));
        hideGenderError();

        requiredInputs.forEach(input => {
            if (input.type === 'radio') return;
            if (!input.value.trim()) {
                showError(input, 'This field is required.');
                isValid = false;
            }
        });

        const email = document.getElementById('email');
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (email.value.trim() && !email.value.match(emailPattern)) {
            showError(email, 'Please enter a valid email address.');
            isValid = false;
        }

        const password = document.getElementById('password');
        if (password.value.trim() && !password.value.match(/^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/)) {
            showError(password, 'Password must be at least 8 characters, include a number and a special character.');
            isValid = false;
        }

        const phone = document.getElementById('phone');
        const phonePattern = /^[0-9]{10}$/;
        if (phone.value.trim() && !phone.value.match(phonePattern)) {
            showError(phone, 'Please enter a valid 10-digit phone number.');
            isValid = false;
        }

        const age = document.getElementById('age');
        if (age.value && (parseInt(age.value) < 16 || parseInt(age.value) > 100)) {
            showError(age, 'Age must be between 16 and 100.');
            isValid = false;
        }

        const gender = form.querySelector('input[name="gender"]:checked');
        if (!gender) {
            const genderError = document.getElementById('genderError');
            genderError.style.display = 'block';
            isValid = false;
        }

        return isValid;
    };

    form.querySelectorAll('[required]').forEach(input => {
        input.addEventListener('input', () => hideError(input));
    });
    document.getElementsByName('gender').forEach(radio => {
        radio.addEventListener('change', hideGenderError);
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (validateForm()) {
            statusMessage.textContent = 'Submitting...';
            statusMessage.style.color = '#555';
            statusMessage.style.display = 'block';

            const formData = new FormData(form);

            try {
                const response = await fetch('/submit', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    statusMessage.textContent = 'Form submitted successfully!';
                    statusMessage.style.color = 'green';
                    form.reset();
                } else {
                    throw new Error('Server responded with an error.');
                }
            } catch (error) {
                statusMessage.textContent = 'An error occurred. Please try again.';
                statusMessage.style.color = 'red';
            }
        } else {
            statusMessage.textContent = 'Please correct the errors before submitting.';
            statusMessage.style.color = 'red';
            statusMessage.style.display = 'block';
        }
    });
});
