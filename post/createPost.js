import { validationTitle } from '/validation.js';
import { validationReadTime } from '/validation.js';
import { validationImage } from '/validation.js';
import { validationText } from '/validation.js';
import { validationTags } from '/validation.js';
import { getTags } from '/generalFunctions.js';

const titlePost = document.getElementById("titlePost");
const timeReadPost = document.getElementById("timeReadPost");
const communityPost = document.getElementById("communityPost");
const tagsPost = document.getElementById("tagsPost");
const imagePost = document.getElementById("imagePost");
const textPost = document.getElementById("textPost");
//const addressPost = document.getElementById("addressPost");
const createPosts = document.getElementById("createPost");

const titleError = document.getElementById('titleError');
const timeError = document.getElementById('timeError');
const tagsError = document.getElementById('tagsError');
const imageError = document.getElementById('imageError');
const textError = document.getElementById('textError');

myCommunities();
getTags(tagsPost);

function myCommunities() {
    const token = localStorage.getItem("token");

    fetch("https://blog.kreosoft.space/api/community/my", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}: ${response.text}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(community => {
                if (community.role === "Administrator") {
                    getNameCommunity(community.communityId);
                }
            });
        })
        .catch(error => {
            alert(error);
        });
}

function getNameCommunity(communityId) {
    fetch(`https://blog.kreosoft.space/api/community/${communityId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.json();
        })
        .then(data => {
            let option = new Option(data.name, communityId);
            communityPost.add(option);
        })
        .catch(error => {
            alert(error);
        });
}

createPosts.addEventListener('click', async function createPost() {
    if (validationTitle(titlePost, titleError) === false) {
        return;
    }

    if (validationReadTime(timeReadPost, timeError) === false) {
        return;
    }

    if (validationTags(tagsPost, tagsError) === false) {
        return;
    }

    if (validationImage(imagePost, imageError) === false) {
        return;
    }

    if (validationText(textPost, textError) === false) {
        return;
    }

    let image = null;
    if (imagePost.value !== '') {
        image = imagePost.value;
    }

    let tags = [];
    for (let i = 0; i < tagsPost.selectedOptions.length; i++) {
        tags.push(tagsPost.selectedOptions[i].value);
    }

    let postData = {
        title: titlePost.value,
        description: textPost.value,
        readingTime: timeReadPost.value,
        image: image,
        addressId: null,
        tags: tags
    }

    let url = "https://blog.kreosoft.space/api/post";

    if (communityPost.value != "noCommunity") {
        url = `https://blog.kreosoft.space/api/community/${communityPost.value}/post`;
    }

    try {
        const token = localStorage.getItem("token");

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${response.text}`);
        }
        else {
            window.location.hash = 'main';
        }
    }
    catch (error) {
        alert(error);
    }
});