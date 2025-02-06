import { updateNavigation } from '/header/header.js';
import { validationName } from '/validation.js';
import { validationDate } from '/validation.js';
import { validationGender } from '/validation.js';
import { validationPhone } from '/validation.js';
import { validationEmail } from '/validation.js';
import { validationPassword } from '/validation.js';

const buttonSignUp = document.getElementById('SignUp');
const nameRegistration = document.getElementById('nameRegistration');
const dateRegistration = document.getElementById('dateRegistration');
const genderRegistration = document.getElementById('genderRegistration');
const phoneRegistration = document.getElementById('phoneRegistration');
const emailRegistration = document.getElementById('emailRegistration');
const passwordRegistration = document.getElementById('passwordRegistration');

const nameErrorRegistration = document.getElementById('nameErrorRegistration');
const dateErrorRegistration = document.getElementById('dateErrorRegistration');
const genderErrorRegistration = document.getElementById('genderErrorRegistration');
const phoneErrorRegistration = document.getElementById('phoneErrorRegistration');
const emailErrorRegistration = document.getElementById('emailErrorRegistration');
const passwordErrorRegistration = document.getElementById('passwordErrorRegistration');

buttonSignUp.addEventListener('click', async function (event) {
    event.preventDefault();

    if (validationName(nameRegistration, nameErrorRegistration) === false) {
        return;
    }

    if (validationDate(dateRegistration, dateErrorRegistration) === false) {
        return;
    }

    if (validationGender(genderRegistration, genderErrorRegistration) === false) {
        return;
    }

    if (validationPhone(phoneRegistration, phoneErrorRegistration) === false) {
        return;
    }

    if (validationEmail(emailRegistration, emailErrorRegistration) === false) {
        return;
    }

    if (validationPassword(passwordRegistration, passwordErrorRegistration) === false) {
        return;
    }

    const data = {
        fullName: nameRegistration.value,
        password: passwordRegistration.value,
        email: emailRegistration.value,
        birthDate: dateRegistration.value,
        gender: genderRegistration.value === 'male' ? 'Male' : 'Female',
        phoneNumber: phoneRegistration.value
    };

    try {
        const response = await fetch("https://blog.kreosoft.space/api/account/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error("Неправильные введенные данные");
            }
            else {
                throw new Error(`Ошибка ${response.status}: ${response.text}`);
            }
        }
        else {
            const responseData = await response.json();
            const token = responseData.token;
            localStorage.setItem("token", token);
            console.log(token);
            window.location.hash = 'profile';
            updateNavigation();
        }
    }
    catch (error) {
        alert(error);
    }
});