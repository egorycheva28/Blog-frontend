import { getUserRole } from "/generalFunctions.js";
import { getTags } from "/generalFunctions.js";
import { updateNavigate } from '/header/header.js';
import { createPagination } from "/pagination/pagination.js";
import { pluralForm } from "/generalFunctions.js";
import { reverseDate } from "/generalFunctions.js";

const lengthPost = 500;
const communityId = window.communityId;

let postContainer = document.getElementById("postContainer");
let concreteCommunity = document.getElementById("concreteCommunity");
//let listAdmins = document.getElementById("adminsContainer");
let tagFilter = document.getElementById("tagFilter");
let userRole = null;

getTags(tagFilter);
getCommunity();

async function getCommunity() {
    try {
        const response = await fetch(`https://blog.kreosoft.space/api/community/${communityId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${response.text}`);
        }
        else {
            let responseData = await response.json();
            showCommunity(responseData);
        }
    }
    catch (error) {
        console.log("1");
        alert(error);
    }
}

function showCommunity(community) {
    fetch("/community/concreteCommunitySample.html")
        .then(response => response.text())
        .then(data => {
            const communityContainer = document.createElement('div');
            communityContainer.innerHTML = data;
            const communityCopy = communityContainer.firstElementChild.cloneNode(true);

            communityCopy.id = community.id;
            communityCopy.querySelector('.card-title').textContent = "Группа '" + community.name + "'";
            communityCopy.querySelector('.btn-new-post').id = community.id;
            communityCopy.querySelector('.btn-subscribe').id = community.id;
            communityCopy.querySelector('.btn-unsubscribe').id = community.id;
            communityCopy.querySelector('.subscribers-count').textContent = community.subscribersCount + " подписчик" + pluralForm(community.subscribersCount, "", "а", "ов");
            communityCopy.querySelector('.communityType').textContent = "Тип сообщества: " + (community.isClosed === true ? "закрытое" : "открытое");

            /*for (let i = 0; i < community.administrators.length; i++) {
                getAdmins(community.administrators[i]);
            }*/

            concreteCommunity.appendChild(communityCopy);

            userRole = getUserRole(community.id);
            if (userRole === 'Subscriber' || userRole === 'Administrator' || community.isClosed === false) {
                getPostsCommunity(community.id);
            }
        })
        .catch(error => {
            alert(error);
        });
}

/*async function getAdmins(admin) {
    fetch("/community/admin.html")
        .then(response => response.text())
        .then(data => {
            let adminContainer = document.createElement('div');
            adminContainer.innerHTML = data;
            const adminCopy = adminContainer.firstElementChild.cloneNode(true);

            let avatar = admin.gender === 'Male' ? "/images/male.png" : "/images/female.png";


            console.log(adminCopy);
            
            adminCopy.querySelector('.image-container').src = avatar;
            adminCopy.querySelector('.name').textContent = admin.fullName;


            listAdmins.appendChild(adminCopy);

        })
        .catch(error => {
            console.log("3");

            alert(error);
        });
}*/

async function getPostsCommunity(communityId) {
    try {
        const response = await fetch(`https://blog.kreosoft.space/api/community/${communityId}/post`, {
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
                getPostCommunity(post);
            });
            createPagination(responseData.pagination);
            updateNavigate();
        }
    }
    catch (error) {
        alert(error);
    }
}

async function getPostCommunity(post) {
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

            if (post.hasLike === true) {
                postCopy.querySelector('.like-btn').classList.add('text-danger');
            }

            postCopy.querySelector('.text-muted').textContent = post.author + " - " + reverseDate(post.createTime.slice(0, 10));
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

window.newPost = function () {
    window.location.hash = 'createPost';
}