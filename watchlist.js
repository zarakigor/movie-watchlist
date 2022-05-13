let myWatchlist = [];
const watchlist = document.getElementsByClassName("watchlist")[0];
const movieListFromLocalStorage = JSON.parse(
    localStorage.getItem("myWatchlist")
);

if (movieListFromLocalStorage) {
    myWatchlist = movieListFromLocalStorage;
}

// Iterate myWatchlist array and get information with their imdbID
for (imdbID of myWatchlist) {
    getInfo(imdbID);
}

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

function render(imdbID, poster, title, imdbRating, runtime, genre, plot) {
    watchlist.innerHTML += `
        <div class="movie" id="${imdbID}">
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
                        <input type="image" id="${imdbID}" class="image-minus" onclick="removeFromWatchlist(id)">
                        <p>Remove</p>
                    </div>
                </div>
                <div class="info-bottom">
                    <p class="movie-plot">${plot}</p>
                </div>
            </div>
        </div>
    `;
}

function removeFromWatchlist(imdbID) {
    // Remove movie from myWatchlist and update localStorage
    myWatchlist = myWatchlist.filter((movie) => movie !== `${imdbID}`);
    localStorage.setItem("myWatchlist", JSON.stringify(myWatchlist));

    // Remove movie from page
    document.getElementById(imdbID).remove();
}
