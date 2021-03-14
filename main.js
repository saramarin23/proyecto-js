/* eslint-disable camelcase */
const searchButton = document.getElementById("search_btn");
const input = document.querySelector("input");
const preview_button = document.querySelector(".play-button")
const autocomplete_results = document.getElementById("suggestions");

let selectedArtists = []
let token = 'BQDx-UfaVOHDkBV0-8Zuzzr89M-Nh4G2kKXKSJ0NYToTMkoB4nYggOGMiLmeCNj_NCF2b1e6ZAiUaRZfg8xJDpssofJAJBvvEny3Ig8uB8gE7MLnpALnBWOzB8HobLaPR_i3NEO8xYw';


const getArtistApi = async (input_val) => {
  console.log(token, input_val)
  // input_val.onChange(
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
      getData(data)
    })
    .catch((err) => console.log("error", err))
    // )
}

const getData = (data, token) => {
  const artists_from_spotify = data.artists.items;
  let inputVal = input.value;
  let artists = [];
  // console.log(Object.values(artists_from_spotify).map(cat => cat.name));
  // console.log(Object.values(artists_from_spotify).includes(cat => cat.name.toLowerCase() === inputVal.toLocaleLowerCase()))
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
      handleArtist(token, this.id, artists);
  } );
  }
}

const handleArtist = (token, ev, artists) => {
  autocomplete_results.innerHTML = "";
  input.value = '';
  const selectedCLickedArtist = selectedArtists.find((selectedArtist) => selectedArtist.id === ev);
  
  if (selectedCLickedArtist === undefined) {
    const clickedArtist = artists.find((artist) => ev === artist.id);
    selectedArtists.push(clickedArtist);
  } else {
      const filteredSelected = artists.filter((artist) => ev !== artist.id);
      artists = filteredSelected;
    }
  paintSelectedArtists(token);

  const removeArtist = document.querySelectorAll(".rmv-artist");
  for (const removeButton of removeArtist) {
    removeButton.addEventListener("click", removeSelectedArtist);
  }
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
    htmlCode += `<li class="li-selected-artist ${selClass}" id="${selectedArtist.id}"> <img class="img-selected-artist" src=${selectedArtist.images[2].url} /> <p class?"name-selected-artist">${selectedArtist.name}</p> <button class="rmv-artist" type="reset">X</button> </li>`;
    getRecommendations(selectedArtists, token);
  }
  htmlCode += '</div>';
  const listSelected = document.querySelector("#selected-artists")
  listSelected.innerHTML = htmlCode;
}

function handleSelectedArtist() {
  
}

function removeSelectedArtist(ev) {
  ev.currentTarget.classList.remove("selected-artist");
  selectedArtists.splice(ev.currentTarget.id, 1);
  paintSelectedArtists();
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
    let token = data.access_token;
   await getArtistApi(token);
    return token;
  }
  catch(err) {
    console.log('fetch failed', err);
  }
};

// input.onkeyup = await getArtistbyQuery(data.access_token);
input.onkeyup = function() {
  const input_val = input.value;
  // APIController()
  // input.addEventListener('change', function() {
    getArtistApi(input_val)
    // })
  ;
}


const getRecommendations = (selectedArtists) => {
  let arrayArtists = [];
  selectedArtists.map((artist) => {
    arrayArtists.push(artist.id);
  } )
  let artistsIdsJoined = arrayArtists.join('%2C')
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
}

const showRecommendedTracks = (data) => {
  const tracks = data.tracks;
  let htmlCode = `<div class="recommendation-tracks">`;
  for (const track of tracks) {
      const ms = track.duration_ms;
      const track_duration = formatDuration(ms);
      htmlCode += `<li class="li-track-recommended" id="${track.id}">  <div><img class="img-track-recommended" src=${track.album.images[2].url} /><div> <p class="name-track-recommended">${track.name}</p><p class="name-artist-recommended">${track.artists[0].name}</p></div></div>
      <!--<button class="play-button"><audio class="audioclass"src=${track.preview_url}></audio>Preview</button> -->
      <p class="duration-track-recommended">${track_duration}</p> </li>`;
    }
  htmlCode += '</div>';

  const suggestedTrack = document.querySelector("#recommendations");
  suggestedTrack.innerHTML = htmlCode;
}

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// setTimeout(APIController, 0);
// window.onload = APIController