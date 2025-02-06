import { reverseDate } from "/generalFunctions.js";
import { pluralForm } from "/generalFunctions.js";

let listAuthors = document.getElementById("listAuthors");

getAuthors();

async function getAuthors() {
    fetch("https://blog.kreosoft.space/api/author/list")
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.json();
        })
        .then(data => {
            let bestThree = chooseBestThree(data);

            data.forEach((author, index) => {
                let place = bestThree.indexOf(author.fullName);
                getAuthor(author, place, index);
            });
        })
        .catch(error => {
            alert(error);
        });
}

async function getAuthor(author, place, number) {
    fetch("/authors/authorsSample.html")
        .then(response => response.text())
        .then(data => {
            const authors = document.createElement('div');
            authors.innerHTML = data;
            const authorsCopy = authors.firstElementChild.cloneNode(true);

            let avatar = author.gender === 'Male' ? "/images/male.png" : "/images/female.png";

            if (author.birthDate == null) {
                authorsCopy.querySelector('.birth-date-container').classList.add('d-none');
            }

            if (number === 0) {
                authorsCopy.querySelector('.divider').classList.add('d-none');
            }

            if (place === 0) {
                authorsCopy.querySelector('.gold-crown').classList.remove('d-none');
            }
            else if (place === 1) {
                authorsCopy.querySelector('.silver-crown').classList.remove('d-none');
            }
            else if (place === 2) {
                authorsCopy.querySelector('.bronze-crown').classList.remove('d-none');
            }

            authorsCopy.querySelector('.name').textContent = author.fullName;
            authorsCopy.querySelector('.create-date').textContent = "Создан: " + reverseDate(author.created.slice(0, 10));
            if (author.birthDate) {
                authorsCopy.querySelector('.birth-date').textContent = reverseDate(author.birthDate.slice(0, 10));
            }
            authorsCopy.querySelector('.post-count').textContent = author.posts + " пост" + pluralForm(author.posts, "", "а", "ов");
            authorsCopy.querySelector('.like-count').textContent = author.likes + " лайк" + pluralForm(author.likes, "", "а", "ов");
            authorsCopy.querySelector('.image-container').src = avatar;
            listAuthors.appendChild(authorsCopy);
        })
        .catch(error => {
            alert(error);
        });
}

function chooseBestThree(authors) {
    let copyAuthors = JSON.parse(JSON.stringify(authors));
    copyAuthors.sort(sorting);
    return [copyAuthors[0].fullName, copyAuthors[1].fullName, copyAuthors[2].fullName];
}

function sorting(a, b) {
    if (a.posts > b.posts) {
        return -1;
    }
    if (a.posts < b.posts) {
        return 1;
    }

    if (a.likes > b.likes) {
        return -1;
    }
    if (a.likes < b.likes) {
        return 1;
    }

    return 0;
}