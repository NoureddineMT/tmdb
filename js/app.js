
const apiKey = '120f0637ca79d38f18ad54d449e3e3de';

function cleanValue(rawAmount, symbol) {
    return rawAmount.replace(symbol, "+").trim();
}

$('#btnMovie').on("click",function(){
    $('.movieInputDiv').removeClass('d-none');
    $('.tvInputDiv').addClass('d-none');
})
$('#btnTV').on("click",function(){
    $('.tvInputDiv').removeClass('d-none');
    $('.movieInputDiv').addClass('d-none');
})

let myTitle;

$("#button-addon1").on("click",function(){
    document.querySelector(".movieRow").innerHTML = ""
    myTitle = $("#inputMovie").val();
    getMovies(cleanValue(myTitle, " "))
})
$("#button-addon2").on("click",function(){
    document.querySelector(".tvRow").innerHTML = ""
    myTitle = $("#inputTv").val();
    getTv(cleanValue(myTitle, " "))
})

let currentPage = 1;

async function getTv(title, page = 1) {
    const apiUrl = `https://api.themoviedb.org/3/search/tv?query=${title}&api_key=${apiKey}&page=${page}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        document.querySelector(".tvRow").innerHTML = ""; 
        for (let i = 0; i < data.results.length; i++) {
            if (data.results[i].poster_path != null) {
                document.querySelector(".tvRow").innerHTML += `
                    <div class="col-3">
                        <div class="card m-1" style="width: 18rem;">
                            <img src="https://image.tmdb.org/t/p/w500/${data.results[i].poster_path}" class="card-img-top" >
                            <div class="card-body">
                                <h5 class="card-title">${data.results[i].name}</h5>
                                <p class="card-text pWidth">${data.results[i].overview}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
        setupPagination(data.page, data.total_pages, title, "tv");
    } catch (error) {
        console.error('Error fetching TV data:', error);
    }
}

async function getMovies(title, page = 1) {
    const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${title}&api_key=${apiKey}&page=${page}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        document.querySelector(".movieRow").innerHTML = ""; 
        for (let i = 0; i < data.results.length; i++) {
            if (data.results[i].poster_path != null) {
                document.querySelector(".movieRow").innerHTML += `
                    <div class="col-3">
                        <div class="card m-1" style="width: 18rem;">
                            <img src="https://image.tmdb.org/t/p/w500/${data.results[i].poster_path}" class="card-img-top" >
                            <div class="card-body">
                                <h5 class="card-title">${data.results[i].title}</h5>
                                <p class="card-text pWidth">${data.results[i].overview}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
        setupPagination(data.page, data.total_pages, title, "movie");
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
}

function setupPagination(current, total, title, type) {
    let paginationHtml = "";


    paginationHtml += `
        <li class="page-item ${current === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" aria-label="Previous" onclick="changePage('${title}', ${current - 1}, '${type}')">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `;


    if (current > 3) {
        paginationHtml += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage('${title}', 1, '${type}')">1</a>
            </li>
            <li class="page-item disabled">
                <span class="page-link">...</span>
            </li>
        `;
    }


    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(total, current + 2);

    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `
            <li class="page-item ${i === current ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage('${title}', ${i}, '${type}')">${i}</a>
            </li>
        `;
    }


    if (endPage < total - 1) {
        paginationHtml += `
            <li class="page-item disabled">
                <span class="page-link">...</span>
            </li>
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage('${title}', ${total}, '${type}')">${total}</a>
            </li>
        `;
    }

    paginationHtml += `
        <li class="page-item ${current === total ? 'disabled' : ''}">
            <a class="page-link" href="#" aria-label="Next" onclick="changePage('${title}', ${current + 1}, '${type}')">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;

    document.querySelector('.pagination').innerHTML = paginationHtml;
}


function changePage(title, page, type) {
    if (type === "movie") {
        getMovies(title, page);
    } else {
        getTv(title, page);
    }
}
