/* eslint-disable camelcase */
const searchButton = document.getElementById("search_btn");
const searchInput = document.getElementById("artist-search");

const input = document.querySelector("input");

function getArtistApi(input_val, token) {
  console.log(input_val, token);
  fetch(
    `https://api.spotify.com/v1/search?q=${input_val}&type=artist&limit=5`,
    {
      method: "GET",
      headers: {
        Authorization:
          "Bearer " + 
          "BQCFwEvUFOfzY_8MKogHdLRsDp9_xg0ZPxZRWTIaIiL5Wpv7JYivJbfhu41DJUp0_Cm2pxNtgIrALiAbjRXmUn58RqHKdKZNMRzAsLcZDvBXRjCvlY4QC1pN7clefZKtzA_GMuW68PU",
      },
    }
  )
    .then(response => response.json())
    .then((data) => {
      getData(data)
    })
    .catch((err) => console.log("error", err));
}

function getData(data, input_val ) {
  const artists_from_spotify = data.artists.items;
  let inputVal = input.value;
  const artists = [];
  for (const artist in artists_from_spotify) {
    let name = artists_from_spotify[artist].name;
    if (name.toLowerCase().includes(inputVal.toLowerCase())) {
      artists.push(artists_from_spotify[artist]);
    } 
  }
  const autocomplete_results = document.getElementById("suggestions");
  autocomplete_results.innerHTML = "";
    
  for (let i = 0; i < artists.length; i++) {
    console.log(artists);
    autocomplete_results.innerHTML += "<li class='artist-list-search'>" + `<img class="artist-image-search" src=${artists[i].images[2].url} />` + `<p>${artists[i].name}</p>`  + "</li>";
  }
}

input.onkeyup = function getArtistInput() {
  const input_val = this.value;
  getArtistApi(input_val);
};

const APIController = () => {
  const clientID = "9e55d70dc1034c18abf8b2168b71b60c";
  const clientSecret = "9169ea0a9f9d47f597b004f77409429a";

  const getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientID + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });
    const data = await result.json();
    const token = data.access_token;
    // getArtistApi(token);
    return token;
  };
  getToken();
};

function getRecommendations(token) {
  fetch(`https://api.spotify.com/v1/recommendations`, {
    method: "GET",
    headers: {
      Authorization: "Bearer" + token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      getData(data);
    });
}

searchButton.addEventListener("click", APIController);
