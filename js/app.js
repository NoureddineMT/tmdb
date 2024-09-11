const apiKey = '120f0637ca79d38f18ad54d449e3e3de';

function cleanValue(rawAmount, symbol) {
    return rawAmount.replace(symbol, "+").trim();
}

$('#btnMovie').on("click", function() {
    $('.movieInputDiv').removeClass('d-none');
    $('.tvInputDiv').addClass('d-none');
});

$('#btnTV').on("click", function() {
    $('.tvInputDiv').removeClass('d-none');
    $('.movieInputDiv').addClass('d-none');
});

let myTitle;
let currentPage = 1;
let totalPages = 1;

$("#button-addon1").on("click", function() {
    document.querySelector(".movieRow").innerHTML = "";
    myTitle = $("#inputMovie").val();
    currentPage = 1; // Reset to first page
    getMovies(cleanValue(myTitle, " "), currentPage);
});

$("#button-addon2").on("click", function() {
    document.querySelector(".tvRow").innerHTML = "";
    myTitle = $("#inputTv").val();
    currentPage = 1; // Reset to first page
    getTv(cleanValue(myTitle, " "), currentPage);
});

async function getTv(title, page) {
    const apiUrl = `https://api.themoviedb.org/3/search/tv?query=${title}&api_key=${apiKey}&page=${page}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        renderTvShows(data.results);
        totalPages = data.total_pages;
        renderPagination();
    } catch (error) {
        console.error('Error fetching TV shows:', error);
    }
}

async function getMovies(title, page) {
    const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${title}&api_key=${apiKey}&page=${page}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        renderMovies(data.results);
        totalPages = data.total_pages;
        renderPagination();
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

function renderMovies(movies) {
    const movieRow = document.querySelector(".movieRow");
    movieRow.innerHTML = movies.map(movie => `
        <div class="col-12 col-md-4 col-lg-3 mb-3">
            <div class="card" style="width: 100%;">
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text">${movie.overview}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function renderTvShows(tvShows) {
    const tvRow = document.querySelector(".tvRow");
    tvRow.innerHTML = tvShows.map(tvShow => `
        <div class="col-12 col-md-4 col-lg-3 mb-3">
            <div class="card" style="width: 100%;">
                <img src="https://image.tmdb.org/t/p/w500/${tvShow.poster_path}" class="card-img-top" alt="${tvShow.name}">
                <div class="card-body">
                    <h5 class="card-title">${tvShow.name}</h5>
                    <p class="card-text">${tvShow.overview}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function renderPagination() {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous button
    if (currentPage > 1) {
        pagination.innerHTML += `
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Previous" onclick="changePage(${currentPage - 1})">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            pagination.innerHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            pagination.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    // Next button
    if (currentPage < totalPages) {
        pagination.innerHTML += `
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Next" onclick="changePage(${currentPage + 1})">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `;
    }
}

function changePage(page) {
    currentPage = page;
    myTitle = $("#inputMovie").val() || $("#inputTv").val();
    if (myTitle) {
        if ($('.movieInputDiv').is(':visible')) {
            getMovies(cleanValue(myTitle, " "), page);
        } else {
            getTv(cleanValue(myTitle, " "), page);
        }
    }
}
