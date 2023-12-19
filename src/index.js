import './style.css';
import { make, query } from 'jeff-query';

const postalConstraints = {
    CN: {
        exp: /^[0-9]{6}$/,
        error: 'Chinese postal codes require 6 digits. (e.g., 100000)',
    },
    US: {
        exp: /^[0-9]{5}(?:-[0-9]{4})?$/,
        error: 'USA codes have 5 or 9 w/ a hyphen (e.g., 12345 or 12345-6789).',
    },
    BR: {
        exp: /^\d{5}-\d{3}$/,
        error: "Brazil's codes have 8 digits with a hyphen (e.g., 12345-678)",
    },
    RU: {
        exp: /^[0-9]{6}$/,
        error: 'Russian postal codes require 6 digits. (e.g., 690000)',
    },
};

const form = query('form');

const emailInput = query('input#email');
const emailError = query('input#email + .error');

const countrySel = query('select#country');

const postalInput = query('input#postal');
const postalError = query('input#postal + .error');

const passInput = query('input#password');
const passError = query('input#password + .error');

const confirmInput = query('input#confirmed-password');
const confirmError = query('input#confirmed-password + .error');

const submitButton = query('form button[type="submit"]');

const displayCustomError = (errorHolder, message) => {
    errorHolder.textContent = message;
};

const validateEmail = (input, errorHolder) => {
    let message = '';
    if (input.validity.valueMissing) {
        message = 'Email is required.';
    } else if (input.validity.typeMismatch) {
        message = 'This is not an email!'; // Don't need to check for min or max since typeMismatch already does that indirectly
    }

    displayCustomError(errorHolder, message);
    input.setCustomValidity(message);
};

const validatePostal = (postInp, errHolder, counSelec) => {
    const country = counSelec.value;
    const constraint = postalConstraints[country].exp;

    let message = '';
    if (postInp.validity.valueMissing) {
        message = 'Postal code required.';
    } else if (!constraint.test(postInp.value)) {
        message = postalConstraints[country].error;
    }
    displayCustomError(errHolder, message);
    postInp.setCustomValidity(message);
};

const validatePass = (input, errorHolder) => {
    let message = '';
    if (input.validity.valueMissing) {
        message = 'Password required!';
    } else if (input.validity.tooShort) {
        message = 'Password must be at least 8 characters.';
    } else if (input.validity.tooLong) {
        message = 'Password cannot be over 20 characters.';
    } else if (input.validity.patternMismatch) {
        message = 'Whitespace is not allowed.';
    }

    displayCustomError(errorHolder, message);
    input.setCustomValidity(message);
};

const validateConfirmedPass = (input, ogPassInput, errorHolder) => {
    validatePass(input, errorHolder);
    if (input.value !== ogPassInput.value) {
        const message = 'Passwords do not match.';
        displayCustomError(errorHolder, message);
        input.setCustomValidity(message);
    }
};

emailInput.addEventListener('change', () => {
    validateEmail(emailInput, emailError);
});

postalInput.addEventListener('change', () => {
    validatePostal(postalInput, postalError, countrySel);
});

countrySel.addEventListener('change', () => {
    validatePostal(postalInput, postalError, countrySel);
});

passInput.addEventListener('change', () => {
    validatePass(passInput, passError);
});

confirmInput.addEventListener('change', () => {
    validateConfirmedPass(confirmInput, passInput, confirmError);
});

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    validateEmail(emailInput, emailError);
    validatePostal(postalInput, postalError, countrySel);
    validatePass(passInput, passError);
    validateConfirmedPass(confirmInput, passInput, confirmError);

    if (form.checkValidity()) {
        form.submit();
    }
});
