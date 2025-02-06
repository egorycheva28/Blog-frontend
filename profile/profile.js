import { validationName } from '/validation.js';
import { validationDate } from '/validation.js';
import { validationGender } from '/validation.js';
import { validationPhone } from '/validation.js';
import { validationEmail } from '/validation.js';

const buttonSave = document.getElementById('Save');

let emailProfile = document.getElementById('emailProfile');
let nameProfile = document.getElementById('nameProfile');
let phoneProfile = document.getElementById('phoneProfile');
let genderProfile = document.getElementById('genderProfile');
let dateProfile = document.getElementById('dateProfile');

const emailErrorProfile = document.getElementById('emailErrorProfile');
const nameErrorProfile = document.getElementById('nameErrorProfile');
const phoneErrorProfile = document.getElementById('phoneErrorProfile');
const genderErrorProfile = document.getElementById('genderErrorProfile');
const dateErrorProfile = document.getElementById('dateErrorProfile');

profile();

async function profile() {
    try {
        const token = localStorage.getItem("token");
        if (token) {
            const response = await fetch("https://blog.kreosoft.space/api/account/profile", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}: ${response.text}`);
            }
            else {
                const responseData = await response.json();
                nameProfile.value = responseData.fullName;
                genderProfile.value = responseData.gender === 'Male' ? 'male' : 'female';
                dateProfile.value = responseData.birthDate === null ? null : responseData.birthDate.slice(0, 10);
                phoneProfile.value = responseData.phoneNumber;
                emailProfile.value = responseData.email;
                localStorage.setItem("email", responseData.email);
                buttonSave.classList.remove('disabled');
            }
        }
        else {
            window.location.hash = 'login';
        }
    }
    catch (error) {
        alert(error);
    }
}

buttonSave.addEventListener('click', async function (event) {
    event.preventDefault();

    if (validationEmail(emailProfile, emailErrorProfile) === false) {
        return;
    }
    if (validationName(nameProfile, nameErrorProfile) === false) {
        return;
    }
    if (validationPhone(phoneProfile, phoneErrorProfile) === false) {
        return;
    }
    if (validationGender(genderProfile, genderErrorProfile) === false) {
        return;
    }
    if (validationDate(dateProfile, dateErrorProfile) === false) {
        return;
    }

    const data = {
        fullName: nameProfile.value,
        email: emailProfile.value,
        birthDate: dateProfile.value,
        gender: genderProfile.value === 'male' ? 'Male' : 'Female',
        phoneNumber: phoneProfile.value
    };

    try {
        const token = localStorage.getItem("token");
        if (token) {
            const response = await fetch("https://blog.kreosoft.space/api/account/profile", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
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
                alert("Данные успешно сохранены");
            }
        }
        else {
            window.location.hash = 'login';
        }
    }
    catch (error) {
        alert(error);
    }
});