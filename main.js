/* eslint-disable camelcase */
const searchButton = document.getElementById("search_btn");
const input = document.querySelector("input");
const preview_button = document.querySelector(".play-button")
const autocomplete_results = document.getElementById("suggestions");
const suggestedTrack = document.querySelector("#recommendations");

let selectedArtists = [];
let token = '';

const getArtistApi = async (input_val) => {
      await fetch(
        `https://api.spotify.com/v1/search?q=${input_val}&type=artist&limit=5`,
        {
          method: "GET",
          headers: {
            Authorization:
            "Bearer " + token.toString()
          },
        }
        )
        .then(response => response.json())
        .then((data) => {
          getData(data);
        })
        .catch((err) => console.log("error", err));
      }

const getData = (data, token) => {
  const artists_from_spotify = data.artists.items;
  let inputVal = input.value;
  let artists = [];
  for (const artist in artists_from_spotify) {
    let artistName = artists_from_spotify[artist].name;
    if (artistName.toLowerCase().includes(inputVal.toLowerCase())) {
      artists.push(artists_from_spotify[artist]);
    }
  }

  autocomplete_results.innerHTML = "";
  
  for (let i = 0; i < artists.length; i++) {
    autocomplete_results.innerHTML += `<li class='artist-list-search' id="${artists[i].id}">` + `<img class="artist-image-search" src=${artists[i].images[2].url}  />` + `<p class="artist-name-search">${artists[i].name}</p>` + "</li>";
  }
  listenArtistEvent(token, artists);
}

const listenArtistEvent = (token, artists) => {
  const artistsElements = document.querySelectorAll('.artist-list-search');
  for (const favoriteElement of artistsElements) {
    favoriteElement.addEventListener('click', function(){
      handleArtist(token, this, artists);
    });
  }
}

const handleArtist = (token, ev, artists) => {
  autocomplete_results.innerHTML = "";
  input.value = '';
  const selectedCLickedArtist = selectedArtists.find((selectedArtist) => selectedArtist.id === ev.id);
  
  if (selectedCLickedArtist === undefined) {
    const clickedArtist = artists.find((artist) => ev.id === artist.id);
    selectedArtists.push(clickedArtist);
  } else {
      const filteredSelected = artists.filter((artist) => ev.id !== artist.id);
      artists = filteredSelected;
    }
  paintSelectedArtists();
}
  
const paintSelectedArtists = (token) => {
  let htmlCode = `<div class="selected">`;

  for (const selectedArtist of selectedArtists) {
    let selectedID = selectedArtist.id;
    const hasBeenSelected = selectedArtists.find((artistSel) => artistSel.id === selectedID);
    let selClass;
    if (hasBeenSelected === undefined) {
      selClass = '';
    } else {
      selClass = 'selected-artist';
    }
    htmlCode += `<li class="li-selected-artist ${selClass}" id="${selectedArtist.id}" draggable="true"> <img class="img-selected-artist" src=${selectedArtist.images[2].url} /> <p class="name-selected-artist">${selectedArtist.name}</p> <button class="rmv-artist" data-index-number='${selectedArtist.id}' type="reset">X</button> </li>`;
    getRecommendations(selectedArtists);
  }
  htmlCode += '</div>';
  const listSelected = document.querySelector("#selected-artists");
  listSelected.innerHTML = htmlCode;

  const removeArtist = document.querySelectorAll(".rmv-artist");
  for (const removeButton of removeArtist) {
    removeButton.addEventListener("click", function() {
      removeSelectedArtist(this);
      paintSelectedArtists();
    }) 
  }
  listenArtistEvent();
  setSelectedInLocalStorage();
}

function removeSelectedArtist(ev) {
  ev.classList.remove("selected-artist");
  selectedArtists.splice(ev.dataset.indexNumber, 1);
  paintSelectedArtists();
  getRecommendations(selectedArtists);
  listenArtistEvent();
}

const APIController = async () => {
    const clientID = "9e55d70dc1034c18abf8b2168b71b60c";
    const clientSecret = "9169ea0a9f9d47f597b004f77409429a";
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientID + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });
    const data = await response.json();
    token = data.access_token;
   await getArtistApi(token);
    return token;
  }
  catch(err) {
    console.log('fetch failed', err);
  }
};

function debouncer(delay, fn) {
  let temporizador;
  return function (...args) {
    if (temporizador) {
      clearTimeout(temporizador);
    }
    temporizador = setTimeout(() => {
      fn(...args);
      temporizador = null;
    }, delay);
  }
}

input.onkeyup =  debouncer(1000, function() {
  const input_val = input.value;
    getArtistApi(input_val)
  ;
})

const getRecommendations = (selectedArtists) => {
  let arrayArtists = [];
  selectedArtists.map((artist) => {
    arrayArtists.push(artist.id);
  })

  let artistsIdsJoined = arrayArtists.join('%2C');
  if (selectedArtists.length > 0) {
    fetch(`https://api.spotify.com/v1/recommendations?limit=25&market=ES&min_popularity=50&max_popularity=100&seed_artists=${artistsIdsJoined}`, {
      method: "GET",
      headers: {
        Authorization:
        "Bearer " + token
      },
    })
    .then((response) => response.json())
    .then((data) => {
      showRecommendedTracks(data);
    });
  } else {
    suggestedTrack.innerHTML = "";
    return null;
  }
}

const imageObserver = new IntersectionObserver((entries, imageObserver) => {
  entries.forEach((entry) => {
    const lazyImage = entry.target;
    console.log("lazy loading ", lazyImage.dataset.src);
    lazyImage.src = lazyImage.dataset.src;
  })
}, {rootMargin: "0px 0px -50px 0px"});


const showRecommendedTracks = (data) => {
  const tracks = data.tracks;
  let htmlCode = `<div class="recommendation-tracks">`;
  for (const track of tracks) {
      const ms = track.duration_ms;
      const track_duration = formatDuration(ms);
      htmlCode += `<li class="li-track-recommended" id="${track.id}">  <div><img class="img-track-recommended" src="logo.png" data-src=${track.album.images[2].url} /><div> <p class="name-track-recommended">${track.name}</p><p class="name-artist-recommended">${track.artists[0].name}</p></div></div>
      <!--<button class="play-button"><audio class="audioclass"src=${track.preview_url}></audio>Preview</button> -->
      <p class="duration-track-recommended">${track_duration}</p> </li>`;
    }
  htmlCode += '</div>';
  suggestedTrack.innerHTML = htmlCode;
  document.querySelectorAll('.img-track-recommended').forEach(img => { 
    imageObserver.observe(img)});
}


function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


function setSelectedInLocalStorage() {
  localStorage.setItem("Selected artists", JSON.stringify(selectedArtists));
}

function startApp() {
  let localSelected = JSON.parse(localStorage.getItem("Selected artists"));
  if (localSelected !== null) {
    selectedArtists = localSelected;
    paintSelectedArtists();
  }
}

setInterval(APIController, 60*60*1000);
window.addEventListener('load', async() => {
  await APIController();
  startApp();
});