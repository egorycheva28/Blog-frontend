export function reverseDate(date) {
    const parts = date.split('-');
    if (parts.length !== 3) {
        throw new Error("Неправильный формат даты");
    }
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    return `${day}-${month}-${year}`;
}

export function reverseTimeAndDate(date) {
    const parts = date.split('T');
    if (parts.length !== 2) {
        throw new Error("Неправильный формат даты и времени");
    }

    const dateParts = parts[0].split('-');
    if (dateParts.length !== 3) {
        throw new Error("Неправильный формат даты");
    }

    const timeParts = parts[1].split(':');
    if (timeParts.length !== 2) {
        throw new Error("Неправильный формат времени");
    }

    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    const hours = timeParts[0];
    const minutes = timeParts[1];

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export function pluralForm(number, singular, less5, more5) {
    if (number > 10 && number < 20) {
        return more5;
    }
    if (number % 10 == 1) {
        return singular;
    }
    if (number % 10 > 1 && number % 10 < 5) {
        return less5;
    }
    else {
        return more5;
    }
}

export async function getUserRole(communityId) {
    let communityCard = document.getElementById(communityId);
    let subscribeButton = communityCard.querySelector('.btn-subscribe');
    let unsubscribeButton = communityCard.querySelector('.btn-unsubscribe');
    let newPostBtn = communityCard.querySelector('.btn-new-post');

    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`https://blog.kreosoft.space/api/community/${communityId}/role`, {
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
            if (responseData == null) {
                subscribeButton.classList.remove('d-none');
            }
            else if (responseData === 'Subscriber') {
                unsubscribeButton.classList.remove('d-none');
            }
            else if (responseData === 'Administrator') {
                if (newPostBtn != null) {
                    newPostBtn.classList.remove('d-none');
                }
            }
            return responseData;
        }
    }
    catch (error) {
        alert(error);
    }
}

window.subscribe = function (button, action) {
    let communityId = button.id;
    let communityCard = document.getElementById(communityId);
    let subscribeButton = communityCard.querySelector('.btn-primary');
    let unsubscribeButton = communityCard.querySelector('.btn-danger');
    let subCount = document.querySelector('.subscribers-count');

    const url = `https://blog.kreosoft.space/api/community/${communityId}/${action}`;

    let requestMethod;
    if (action === 'subscribe') {
        requestMethod = 'POST';
    }
    else {
        requestMethod = 'DELETE';
    }

    try {
        const token = localStorage.getItem("token");

        const response = fetch(url, {
            method: requestMethod,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${response.text}`);
        }
        else {
            let responseData = response.json();

            if (action === 'subscribe') {
                subscribeButton.classList.add('d-none');
                unsubscribeButton.classList.remove('d-none');
                let subCountValue = parseFloat(subCount.textContent.split(' ')[0]);
                subCount.textContent = (subCountValue + 1) + " подписчик" + russianPlural(subCountValue + 1, "", "а", "ов");
            }
            else {
                subscribeButton.classList.remove('d-none');
                unsubscribeButton.classList.add('d-none');
                if (subCount != null) {
                    subCount.textContent = (subCountValue - 1) + " подписчик" + russianPlural(subCountValue - 1, "", "а", "ов");
                }
            }
        }
    }
    catch (error) {
        console.log(error);
        //alert(error);
    }
}

export function getTags(tags) {
    fetch("https://blog.kreosoft.space/api/tag", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}: ${response.text}`);
            }
            return response.json();
        })
        .then(data => {
            tags.options.length = 0;
            for (let i = 0; i < data.length; i++) {
                let option = new Option(data[i].name, data[i].id);
                tags.add(option);
            }
        })
        .catch(error => {
            alert(error);
        });
}

window.showFull = function (showBtn) {
    var parent = showBtn.parentNode;

    var shortText = parent.querySelector('.post-text-short');
    var fullText = parent.querySelector('.post-text-full');

    if (shortText) {
        shortText.classList.add('d-none');
    }

    if (fullText) {
        fullText.classList.remove('d-none');
    }

    showBtn.style.display = 'none';
}

window.likePost = function (like) {
    if (like.classList.contains('disabled')) {
        return;
    }
    let requestMethod = like.classList.contains('text-danger') ? 'DELETE' : 'POST';

    try {
        const token = localStorage.getItem("token");

        const response = fetch(`https://blog.kreosoft.space/api/post/${like.id}/like`, {
            method: requestMethod,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${response.text}`);
        }
        else {
            let likeCount = like.querySelector('.like-count');
            if (requestMethod === 'POST') {
                like.classList.add('text-danger');
                likeCount.textContent = parseFloat(likeCount.textContent) + 1;
            }
            else {
                like.classList.remove('text-danger');
                likeCount.textContent = parseFloat(likeCount.textContent) - 1;
            }
        }
        location.reload();
    }
    catch (error) {
        alert(error);
    }
}

window.pressTitle = function (post) {
    window.location.hash = `concretePost/${post.id}`;
}

