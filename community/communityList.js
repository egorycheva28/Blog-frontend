import { getUserRole } from "/generalFunctions.js";

let listCommunities = document.getElementById("listCommunities");

getCommunities();

async function getCommunities() {
    fetch("https://blog.kreosoft.space/api/community")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}: ${response.text}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(community => {
                getCommunity(community);
            });
        })
        .catch(error => {
            alert(error);
        });
}

async function getCommunity(community) {
    fetch("/community/communitySample.html")
        .then(response => response.text())
        .then(data => {
            const communities = document.createElement('div');
            communities.innerHTML = data;

            const communitiesCopy = communities.firstElementChild.cloneNode(true);

            communitiesCopy.id = community.id;
            communitiesCopy.querySelector('.card-title').textContent = community.name;
            communitiesCopy.querySelector('.card-title').id = community.id;
            communitiesCopy.querySelector('.btn-subscribe').id = community.id;
            communitiesCopy.querySelector('.btn-unsubscribe').id = community.id;

            listCommunities.appendChild(communitiesCopy);
            let userRole = getUserRole(community.id);
        })
        .catch(error => {
            alert(error)
        });
}

window.openCommunity = function (community) {
    window.location.hash = `concreteCommunity/${community.id}`;
}