import { reverseDate } from "/generalFunctions.js";
import { getTags } from "/generalFunctions.js";
import { updateNavigate } from '/header/header.js';
import { createPagination } from "/pagination/pagination.js";

let postContainer = document.getElementById("postContainer");
let createPost = document.getElementById("newPost");
let tagFilter = document.getElementById("tagFilter");
//let applyFilters = document.getElementById("applyFilters");
const lengthPost = 500;

getTags(tagFilter);

createPost.addEventListener('click', async function newPost() {
    const token = localStorage.getItem("token");
    if (token) {
        window.location.hash = 'createPost';
    }
    else {
        alert("Войдите в аккаунт!");
    }
}
);

getPosts();

async function getPosts() {
    //const token = localStorage.getItem("token");

    try {
        const response = await fetch(`https://blog.kreosoft.space/api/post`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${response.text}`);
        }
        else {
            const responseData = await response.json();
            responseData.posts.forEach(post => {
                getPost(post);
            });
            createPagination(responseData.pagination);
            updateNavigate();
        }
    }
    catch (error) {
        alert(error);
    }
}

function getPost(post) {
    fetch("/post/postSample.html")
        .then(response => response.text())
        .then(data => {
            const posts = document.createElement('div');
            posts.innerHTML = data;
            const postCopy = posts.firstElementChild.cloneNode(true);

            let shortText = post.description;
            if (shortText.length > lengthPost) {
                shortText = shortText.substring(0, lengthPost) + "...";
                const fullText = postCopy.querySelector('.show-full-btn');
                fullText.classList.remove('d-none');
            }

            let tags = "";
            for (let i = 0; i < post.tags.length; i++) {
                if (tags != "") {
                    tags += "   ";
                }
                tags += "#" + post.tags[i].name;
            }

            if (post.image != null) {
                const imgContainer = postCopy.querySelector('.image-container');
                imgContainer.src = post.image;
                imgContainer.classList.remove('d-none');
            }

            if (post.communityId != null) {
                postCopy.querySelector('.text-muted').textContent = post.author + " - " + reverseDate(post.createTime.slice(0, 10)) + " в сообществе '" + post.communityName + "'";
            }
            else {
                postCopy.querySelector('.text-muted').textContent = post.author + " - " + reverseDate(post.createTime.slice(0, 10));
            }

            if (post.hasLike === true) {
                postCopy.querySelector('.like-btn').classList.add('text-danger');
            }

            postCopy.querySelector('.card-title').textContent = post.title;
            postCopy.querySelector('.card-title').id = post.id;
            postCopy.querySelector('.post-text-short').textContent = shortText;
            postCopy.querySelector('.post-text-full').textContent = post.description;
            postCopy.querySelector('.tags').textContent = tags;
            postCopy.querySelector('.read-time').textContent = "Время чтения: " + post.readingTime + " мин.";
            postCopy.querySelector('.comment-count').textContent = post.commentsCount;
            postCopy.querySelector('.comment-btn').id = post.id;
            //postCopy.querySelector('.like-count').textContent = post.likes;
            //postCopy.querySelector('.like-btn').id = post.id;

            postContainer.appendChild(postCopy);
        })
        .catch(error => {
            alert(error);
        });
}