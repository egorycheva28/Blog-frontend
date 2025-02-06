let paginationContainer = document.getElementById("paginationContainer");

window.reloadWithNewPageSize = function (pageSizeInput) {
    let params = new URLSearchParams(window.location.search);
    params.set('size', pageSizeInput.value);
    params.delete('page');

    window.location.search = params;
}

window.showPage = function (pageButton) {
    let params = new URLSearchParams(window.location.search);
    params.set('page', pageButton.textContent);

    window.location.search = params;
}

window.nextPages = function () {
    let params = new URLSearchParams(window.location.search);

    if (!params.has('page')) {
        params.set('page', '2');
        window.location.search = params;
    }
    else {
        let currentPage = params.get('page');
        params.set('page', currentPage + 1);
        window.location.search = params;
    }
}

window.previousPages = function () {
    let params = new URLSearchParams(window.location.search);

    if (!params.has('page')) {
        window.location.search = params;
    }
    else {
        let currentPage = params.get('page');
        if (currentPage == 1) {
            window.location.search = params;
        }
        params.set('page', currentPage - 1);
        window.location.search = params;
    }
}

export function createPagination(pagination) {
    let size = pagination.size;
    let count = pagination.count;
    let current = pagination.current;

    fetch("/paginiation/pagination.html")
        .then(response => response.text())
        .then(data => {
            const pagin = document.createElement('div');
            pagin.innerHTML = data;
            const paginCopy = pagin.firstElementChild.cloneNode(true);

            let previousPage = paginCopy.querySelector('#previousPage');
            let page1 = paginCopy.querySelector('#page1');
            let page2 = paginCopy.querySelector('#page2');
            let page3 = paginCopy.querySelector('#page3');
            let nextPage = paginCopy.querySelector('#nextPage');
            let pageSizeInput = paginCopy.querySelector('#pageSize');

            pageSizeInput.value = size;

            if (count == 0) {
                page1.textContent = 1;
                page2.textContent = 2;
                page3.textContent = 3;

                previousPage.parentElement.classList.add('disabled');
                page1.parentElement.classList.add('disabled');
                page2.parentElement.classList.add('disabled');
                page3.parentElement.classList.add('disabled');
                nextPage.parentElement.classList.add('disabled');
            }
            if (count == 1) {
                page1.textContent = 1;
                page2.textContent = 2;
                page3.textContent = 3;

                previousPage.parentElement.classList.add('disabled');
                page1.parentElement.classList.add('active');
                page2.parentElement.classList.add('disabled');
                page3.parentElement.classList.add('disabled');
                nextPage.parentElement.classList.add('disabled');
            }
            else if (count == 2) {
                page1.textContent = 1;
                page2.textContent = 2;
                page3.textContent = 3;

                page3.parentElement.classList.add('disabled');
                if (current == 1) {
                    previousPage.parentElement.classList.add('disabled');
                    page1.parentElement.classList.add('active');
                }
                else {
                    page2.parentElement.classList.add('active');
                    nextPage.parentElement.classList.add('disabled');
                }
            }
            else if (current == 1) {
                page1.textContent = 1;
                page2.textContent = 2;
                page3.textContent = 3;

                previousPage.parentElement.classList.add('disabled');
                page1.parentElement.classList.add('active');
            }
            else if (current == count && current > 2) {
                page1.textContent = current - 2;
                page2.textContent = current - 1;
                page3.textContent = current;

                page3.parentElement.classList.add('active');
                nextPage.parentElement.classList.add('disabled');
            }
            else if (count > 2) {
                page1.textContent = current - 1;
                page2.textContent = current;
                page3.textContent = current + 1;

                page2.parentElement.classList.add('active');
            }

            paginationContainer.appendChild(paginCopy);
        })
}