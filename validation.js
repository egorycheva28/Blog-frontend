function validationError(input, errorField, message) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    errorField.innerText = message;
}

function emptyValidation(input) {
    input.classList.remove('is-valid');
    input.classList.remove('is-invalid');
}

export function validationEmail(input, errorField) {
    if (input.value === '') {
        validationError(input, errorField, "Введите адрес электронной почты.");
        return false;
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]+$/;
    if (!emailRegex.test(input.value)) {
        validationError(input, errorField, "Это не адрес электронной почты.");
        return false;
    }

    emptyValidation(input);
    return true;
}

export function validationPassword(input, errorField) {
    if (input.value === '') {
        validationError(input, errorField, "Введите пароль.");
        return false;
    }

    if (input.value.length < 6) {
        validationError(input, errorField, "Минимальная длина пароля — 6.");
        return false;
    }

    const passwordRegex = /(?=.*d)/;
    if (!passwordRegex.test(input.value)) {
        validationError(input, errorField, "Пароль должен содержать как минимум 1 цифру.");
        return false;
    }

    emptyValidation(input);
    return true;
}

export function validationName(input, errorField) {
    if (input.value === '') {
        validationError(input, errorField, "Введите ФИО.");
        return false;
    }

    emptyValidation(input);
    return true;
}

export function validationDate(input, errorField) {
    var today = new Date().toISOString().split('T')[0];
    if (input.value > today) {
        validationError(input, errorField, "Дата рождения не должна быть позже сегодня.");
        return false;
    }

    emptyValidation(input);
    return true;
}

export function validationGender(input, errorField) {
    if (input.value != 'male' && input.value != 'female') {
        validationError(input, errorField, "Укажите пол.");
        return false;
    }

    emptyValidation(input);
    return true;
}

export function validationPhone(input, errorField) {
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (input.value !== '' && !phoneRegex.test(input.value)) {
        validationError(input, errorField, "Это не номер телефона.");
        return false;
    }

    emptyValidation(input);
    return true;
}

export function validationTitle(input, errorField) {
    if (input.value === '') {
        validationError(input, errorField, "Введите заголовок поста.");
        return false;
    }

    if (input.value.length < 5) {
        validationError(input, errorField, "Минимальная длина заголовка поста — 5.");
        return false;
    }

    if (input.value.length > 1000) {
        validationError(input, errorField, "Максимальная длина заголовка поста — 1000.");
        return false;
    }

    emptyValidation(input);
    return true;
}

export function validationReadTime(input, errorField) {
    if (input.value === '') {
        validationError(input, errorField, "Введите время чтения.");
        return false;
    }

    if (input.value < 1) {
        validationError(input, errorField, "Минимальное время чтения — 1 мин.");
        return false;
    }

    if (input.value > 2147483647) {
        validationError(input, errorField, "Максимальное время чтения — 2147483647 мин.");
        return false;
    }

    emptyValidation(input);
    return true;
}

export function validationImage(input, errorField) {
    let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|ftp:\/\/)([a-zA-Z0-9-]+\.)*[a-zA-Z]{2,}(\/.*)*$/;
    if (!regex.test(input.value) && input.value.length != 0) {
        validationError(input, errorField, "Ссылка недействительна.");
        return false;
    }

    emptyValidation(input);
    return true;
}

export function validationText(input, errorField) {
    if (input.value === '') {
        validationError(input, errorField, "Введите текст поста.");
        return false;
    }

    if (input.value.length < 5) {
        validationError(input, errorField, "Минимальная длина текста поста — 5.");
        return false;
    }

    if (input.value.length > 5000) {
        validationError(input, errorField, "Максимальная длина текста поста — 5000.");
        return false;
    }

    emptyValidation(input);
    return true;
}

export function validationTags(input, errorField) {
    if (input.selectedOptions.length < 1) {
        validationError(input, errorField, "Выберите как минимум 1 тэг.");
        return false;
    }

    emptyValidation(input);
    return true;
}

export function validationComment(input, errorField) {
    if (input.value === '') {
        validationError(input, errorField, "Введите текст комментария.");
        return false;
    }

    if (input.value.length > 1000) {
        validationError(input, errorField, "Максимальная длина комментария — 1000.");
        return false;
    }

    emptyValidation(input);
    return true;
}