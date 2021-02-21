/* eslint-disable camelcase */
const searchButton = document.getElementById("search_btn");
const searchInput = document.getElementById("artist-search");

const input = document.querySelector("input");

function getArtistApi(input_val) {
  //   console.log(input_val);

  fetch(
    `https://api.spotify.com/v1/search?q=${input_val}&type=artist&limit=5`,
    {
      method: "GET",
      headers: {
        Authorization:
          "Bearer " +
          "BQDNNgPRU018GGS859TN2JXyNLyHKarXkFuSVyRljQTETxqD1ywrAbLnAa5agMeo46vfKBKn047KN1JTcz5AaneyUkfhwOQ5tdKOcuax8yrv6mUhRsEpiGqeZYKa2FSmd7PIGPj9JhU",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      getData(data);
    })
    .catch((err) => console.log("error", err));
}

function getData(data, input_val) {
  const artists_from_spotify = data.artists.items;
  //   console.log(data.artists);
  const artists = [];
  for (let i = 0; i < artists.length; i++) {
    if (input_val === artists_from_spotify[i].slice(0, input_val.length)) {
      console.log(artists[i]);
      artists.push(artists[i]);
    }
  }
  return artists;
}

input.onkeyup = function getArtistInput(e) {
  const input_val = this.value;

  getArtistApi(input_val);

  if (input_val.length > 0) {
    const artists_to_show = [];

    const autocomplete_results = document.getElementById("suggestions");
    autocomplete_results.innerHTML = "";
    artists_to_show = getData(input_val);

    for (let i = 0; i < artists_to_show.length; i++) {
      autocomplete_results.innerHTML += "<li>" + artists_to_show[i] + "</li>";
    }
    // console.log(artists_to_show);
  }
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

searchButton.addEventListener("click", getArtistApi);
