import { updateNavigation } from '/header/header.js';
import { validationEmail } from '/validation.js';
import { validationPassword } from '/validation.js';

const buttonLogin = document.getElementById('buttonLogin');
const buttonSignUp = document.getElementById('buttonSignUp');

const passwordLogin = document.getElementById('passwordLogin');
const emailLogin = document.getElementById('emailLogin');

const emailErrorLogin = document.getElementById('emailErrorLogin');
const passwordErrorLogin = document.getElementById('passwordErrorLogin');

buttonLogin.addEventListener('click', async function (event) {
    event.preventDefault();

    if (validationEmail(emailLogin, emailErrorLogin) === false) {
        return;
    }

    if (validationPassword(passwordLogin, passwordErrorLogin) === false) {
        return;
    }

    const data = {
        email: emailLogin.value,
        password: passwordLogin.value
    };

    try {
        const response = await fetch("https://blog.kreosoft.space/api/account/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error("Неправильные входные данные");
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
            localStorage.setItem("email", data.email);
            window.location.hash = 'profile';
            updateNavigation();
        }
    }
    catch (error) {
        alert(error);
    }
});

buttonSignUp.addEventListener('click', async function () {
    try {
        window.location.hash = 'registration';
    }
    catch (error) {
        alert(error);
    }
});