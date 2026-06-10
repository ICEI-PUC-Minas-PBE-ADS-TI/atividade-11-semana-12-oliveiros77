const API_KEY = "cd625869783e7940f25083ba4be3e08e";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

async function fetchMovies(query = "") {
    let url = "";
    
    if (query === "") {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;
    } else {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`;
    }

    try {
        showMessage("Carregando filmes...");
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("Erro na requisição.");
        }
        
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error(error);
        showMessage("Não foi possível carregar os filmes.");
        return [];
    }
}

function createMovieCard(movie) {
    const card = document.createElement("div");
    card.classList.add("card-filme");

    const posterPath = movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : "https://via.placeholder.com/500x750?text=Sem+Poster";
    const anoLancamento = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
    const notaMedia = movie.vote_average ? movie.vote_average.toFixed(1) : "0.0";

    card.innerHTML = `
        <img src="${posterPath}" alt="Poster de ${movie.title}" class="poster-filme">
        <div class="info-tag">⭐ ${notaMedia} | 📅 ${anoLancamento}</div>
        <h3 class="titulo-filme">${movie.title}</h3>
        <p class="sinopse-filme">${movie.overview || "Sinopse não disponível para este filme."}</p>
    `;

    return card;
}

function renderMovies(movies) {
    const container = document.getElementById("movie-list");
    container.innerHTML = "";

    if (movies.length === 0) {
        showMessage("Nenhum filme foi encontrado.");
        return;
    }

    showMessage("");

    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        container.appendChild(movieCard);
    });
}

function showMessage(text) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = text;
}

async function init() {
    const inputSearch = document.getElementById("search");
    const btnSearch = document.getElementById("btnSearch");

    const filmesIniciais = await fetchMovies();
    renderMovies(filmesIniciais);

    btnSearch.addEventListener("click", async () => {
        const termoBusca = inputSearch.value.trim();
        const filmesFiltrados = await fetchMovies(termoBusca);
        renderMovies(filmesFiltrados);
    });

    inputSearch.addEventListener("keypress", async (e) => {
        if (e.key === "Enter") {
            const termoBusca = inputSearch.value.trim();
            const filmesFiltrados = await fetchMovies(termoBusca);
            renderMovies(filmesFiltrados);
        }
    });
}

document.addEventListener("DOMContentLoaded", init);