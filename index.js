let myWatchlist = [];
const text = document.getElementsByClassName("search-bar-text")[0];
const btn = document.getElementsByClassName("search-bar-button")[0];
const movies = document.getElementsByClassName("movies")[0];
const movieListFromLocalStorage = JSON.parse(
    localStorage.getItem("myWatchlist")
);

if (movieListFromLocalStorage) {
    myWatchlist = movieListFromLocalStorage;
}

// Searches all movies that includes the input which user wrote
btn.addEventListener("click", () => {
    fetch(`http://www.omdbapi.com/?apikey=a4d650dc&s=${text.value}`)
        .then((res) => res.json())
        .then((data) => {
            // reset movies
            movies.innerHTML = "";
            // In order to getting more information from movie
            // iterates all movies in array and sending their imdbID to getInfo()
            for (movie of data.Search) {
                getInfo(movie.imdbID);
            }
        })
        .catch((err) => {
            movies.innerHTML = `<p class="no-data"> Unable to find what you’re looking for. Please try another search.</p>`;
        });
});

// Sends info to render()
function getInfo(imdbID) {
    fetch(`http://www.omdbapi.com/?apikey=a4d650dc&i=${imdbID}`)
        .then((res) => res.json())
        .then((data) => {
            render(
                imdbID,
                data.Poster,
                data.Title,
                data.imdbRating,
                data.Runtime,
                data.Genre,
                data.Plot
            );
        });
}

// Render page with given information
function render(imdbID, poster, title, imdbRating, runtime, genre, plot) {
    const movie = document.createElement("div");

    movie.innerHTML = `
        <div class="movie">
            <div class="movie-poster">
                <img src="${poster}">
            </div>
            <div class="movie-info">
                <div class="info-top">
                    <h3 class="movie-title">${title}</h3>
                    <img class="image-star" src="images/star_icon.png" />
                    <p class="movie-score">${imdbRating}</p>
                </div>
                <div class="info-middle">
                    <p class="movie-runtime">${runtime}</p>
                    <p  class="movie-genre">${genre}</p>
                    <div class="movie-add">
                        <input type="image" id="${imdbID}" class="image-plus" onclick="addAndRemove(id)">
                        <p>Watchlist</p>
                    </div>
                </div>
                <div class="info-bottom">
                    <p class="movie-plot">${plot}</p>
                </div>
            </div>
        </div>
        <hr>
    `;
    movies.appendChild(movie);
}

function addAndRemove(imdbID) {
    let currentMovie = document.getElementById(`${imdbID}`);

    // If the movie is already in list remove it and update localStorage otherwise add it
    if (myWatchlist.includes(imdbID)) {
        // If movie is already in myWatchlist and has plus icon alert user
        if (currentMovie.classList.contains("image-plus")) {
            alert("The movie is removed from your watchlist");
        }

        currentMovie.classList.remove("image-minus");
        currentMovie.classList.add("image-plus");
        // Get a new array that does not contain this movie
        myWatchlist = myWatchlist.filter((movie) => movie !== `${imdbID}`);
        localStorage.setItem("myWatchlist", JSON.stringify(myWatchlist));
    } else {
        currentMovie.classList.remove("image-plus");
        currentMovie.classList.add("image-minus");
        myWatchlist.push(imdbID);
        localStorage.setItem("myWatchlist", JSON.stringify(myWatchlist));
    }
}
