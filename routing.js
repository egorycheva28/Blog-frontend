const routes = {
    "main": {
        template: '/main/main.html',
        script: '/main/main.js',
    },
    "login": {
        template: '/login/login.html',
        script: '/login/login.js',
    },
    "registration": {
        template: '/registration/registration.html',
        script: '/registration/registration.js'
    },
    "profile": {
        template: '/profile/profile.html',
        script: '/profile/profile.js'
    },
    "communityList": {
        template: '/community/communityList.html',
        script: '/community/communityList.js'
    },
    "concreteCommunity": {
        template: '/community/concreteCommunity.html',
        script: '/community/concreteCommunity.js'
    },
    "authorList": {
        template: '/authors/authorList.html',
        script: '/authors/authorList.js'
    },
    "concretePost": {
        template: '/post/post.html',
        script: '/post/post.js'
    },
    "createPost": {
        template: '/post/createPost.html',
        script: '/post/createPost.js'
    }
};

function loadPage() {
    const contentDiv = document.getElementById('content');
    const hash = window.location.hash.substring(1) || 'login';

    const [routeName, id] = hash.split('/');

    const route = routes[routeName];

    if (route) {
        fetch(route.template)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка ${response.status}: ${response.text}`);
                }
                return response.text();
            })
            .then(html => {
                contentDiv.innerHTML = html;

                const existingScript = document.getElementById('dynamic-script');
                if (existingScript) {
                    existingScript.remove();
                }

                const script = document.createElement('script');
                script.src = `${route.script}?=${new Date().getTime()}`;
                script.type = "module";
                script.id = 'dynamic-script';
                document.body.appendChild(script);

                if (routeName === 'concreteCommunity' && id) {
                    window.communityId = id;
                }

                if (routeName === 'concretePost' && id) {
                    window.postId = id;
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке HTML:', error);
            });
    }
}

window.addEventListener('hashchange', loadPage);

loadPage();
