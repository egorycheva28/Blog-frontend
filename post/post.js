import { reverseDate } from "/generalFunctions.js";
import { reverseTimeAndDate } from "/generalFunctions.js";
import { validationComment } from "/validation.js";

const postId = window.postId;

let posts = document.getElementById("posts");
let commentsContainer = document.getElementById("commentsContainer");
let buttonSend = document.getElementById("send");
let newComment = document.getElementById("newComment");
let editCommentText = document.getElementById("editCommentText");
let userId = null;

const editCommentError = document.getElementById("editCommentError");
const commentError = document.getElementById("commentError");

getPost();
profile();

async function getPost() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://blog.kreosoft.space/api/post/${postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${response.text}`);
        }
        else {
            let responseData = await response.json();
            showPost(responseData);
            getComments(null, responseData.comments, 0);
        }
    }
    catch (error) {
        alert(error.text);
    }
}

async function showPost(post) {
    fetch("/post/postSample.html")
        .then(response => response.text())
        .then(data => {
            const postContainer = document.createElement('div');
            postContainer.innerHTML = data;
            const postCopy = postContainer.firstElementChild.cloneNode(true);

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

            postCopy.querySelector('.card-title').textContent = post.title;
            postCopy.querySelector('.card-title').id = post.id;
            postCopy.querySelector('.post-text-short').textContent = post.description;
            postCopy.querySelector('.tags').textContent = tags;
            postCopy.querySelector('.read-time').textContent = "Время чтения: " + post.readingTime + " мин.";
            postCopy.querySelector('.comment-count').textContent = post.commentsCount;
            postCopy.querySelector('.comment-btn').id = post.id;
            //postCopy.querySelector('.like-count').textContent = post.likes;
            //postCopy.querySelector('.like-btn').id = post.id;

            posts.appendChild(postCopy);
        })
        .catch(error => {
            alert(error);
        });
}

function getComments(parentId, comments, depth) {
    if (parentId === null) {
        if (comments.length === 0) {
            const commentsCard = document.querySelector('.comments-card');
            if (commentsCard) {
                commentsCard.remove();
            }
        }
        getComment(comments, depth);
        return;
    }

    try {
        const response = fetch(`https://blog.kreosoft.space/api/comment/${parentId}/tree`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${response.text}`);
        }
        else {
            const responseData = response.json();
            getComment(responseData, depth);
        }
    }
    catch (error) {
        alert(error);
    }
}

function getComment(comments, depth) {
    comments.forEach(comment => {
        fetch("/post/commentSample.html")
            .then(response => response.text())
            .then(data => {
                const commentsCont = document.createElement('div');
                commentsCont.innerHTML = data;
                const commentsCopy = commentsCont.firstElementChild.cloneNode(true);

                if (comment.modifiedDate !== null && comment.deleteDate === null) {
                    const editedText = commentsCopy.querySelector('.edited-text');
                    editedText.classList.remove('d-none');
                    editedText.querySelector('.data-bs-title').textContent = 'в ' + reverseTimeAndDate(comment.modifiedDate.slice(0, 16));
                }

                /*if (comment.subComments !== 0) {
                    const answerComments = commentsCopy.querySelector('.expand-btn');
                    answerComments.classList.remove('d-none');
                    answerComments.querySelector('.child-comments-container').id = comment.id;
                }*/

                commentsCopy.id = comment.id;
                commentsCopy.querySelector('.comment-author').textContent = comment.author;
                commentsCopy.querySelector('.comment-text').textContent = comment.content;
                commentsCopy.querySelector('.comment-time').textContent = reverseTimeAndDate(comment.createTime.slice(0, 16));
                commentsCopy.querySelector('.btn-edit').setAttribute('onclick', 'editComment("' + comment.id + '")');
                commentsCopy.querySelector('.btn-delete').setAttribute('onclick', 'deleteComment("' + comment.id + '")');

                if (comment.authorId == userId) {
                    commentsCopy.querySelector('.control-icons').classList.remove('d-none');
                }

                commentsContainer.appendChild(commentsCopy);
            })
            .catch(error => {
                alert(error);
            });
    });
}

window.editComment = function (commentId) {
    if (validationComment(editCommentText, editCommentError) === false) {
        return;
    }

    let data = {
        content: editCommentText.value
    }
    try {
        const token = localStorage.getItem("token");
        if (token) {
            const response = fetch(`https://blog.kreosoft.space/api/comment/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}: ${response.text}`);
            }
            else {
                location.reload();
            }
        }
        else {
            alert("Войдите в аккаунт!");
        }
    }
    catch (error) {
        console(error);
        //alert(error);
    }
}

window.deleteComment = function (commentId) {
    try {
        const token = localStorage.getItem("token");
        if (token) {
            const response = fetch(`https://blog.kreosoft.space/api/comment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}: ${response.text}`);
            }
            else {
                alert("Комментарий удален, обновите страницу!");
                location.reload();
            }
        }
        else {
            alert("Войдите в аккаунт!");
        }
    }
    catch (error) {
        console.log(error);
        //alert(error);
    }
}

buttonSend.addEventListener('click', function addComment(parentId) {
    if (validationComment(newComment, commentError) === false) {
        return;
    }

    let data = {
        content: newComment.value,
        parentId: null
    }

    try {
        const token = localStorage.getItem("token");
        if (token) {
            const response = fetch(`https://blog.kreosoft.space/api/post/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}: ${response.text}`);
            }
            else {
                alert("Комментарий добавлен, обновите страницу!");
                location.reload();
            }
        }
        else {
            alert("Войдите в аккаунт!");
        }
    }
    catch (error) {
        console.log(error);
        //alert(error);
    }
});

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
                userId = responseData.id;
            }
        }
    }
    catch (error) {
        alert(error);
    }
}

