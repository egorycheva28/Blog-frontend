const buttonLogout = document.getElementById("btnLogout");

export function updateNavigation() {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    const emailButton = document.getElementById("emailButton");
    const login = document.getElementById("login");
    const emailElement = document.getElementById("email");

    const authorList = document.getElementById("authorList");
    const communityList = document.getElementById("communityList");

    if (token) {
        login.style.display = "none";
        emailButton.style.display = "block";
        authorList.style.display = "block";
        communityList.style.display = "block";
        emailElement.textContent = email;
    }
    else {
        login.style.display = "block";
        emailButton.style.display = "none";
        authorList.style.display = "none";
        communityList.style.display = "none";
        window.location.hash = 'login';
    }
}

export function updateNavigate() {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    const emailButton = document.getElementById("emailButton");
    const login = document.getElementById("login");
    const emailElement = document.getElementById("email");

    const authorList = document.getElementById("authorList");
    const communityList = document.getElementById("communityList");

    if (token) {
        login.style.display = "none";
        emailButton.style.display = "block";
        authorList.style.display = "block";
        communityList.style.display = "block";
        emailElement.textContent = email;
    }
    else {
        login.style.display = "block";
        emailButton.style.display = "none";
        authorList.style.display = "none";
        communityList.style.display = "none";
    }
}

buttonLogout.addEventListener("click", async function (event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
        let response = await fetch("https://blog.kreosoft.space/api/account/logout", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${response.text}`);
        }
        else {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            updateNavigation();
            window.location.hash = 'login';
        }
    }
    catch (error) {
        alert(error);
    }
});