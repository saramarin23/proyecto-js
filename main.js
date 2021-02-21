// import getArtist from './search';

const searchButton = document.getElementById('search_btn');
const searchInput = document.getElementById('artist-search');

function getData(data) {
  // Preparar los datos
  const artists = data.artists.items;
  // console.log(artists);
  const suggestions = document.getElementById('suggestions');
  suggestions.innerHTML = '';
  for (let i = 0; i < artists.length; i++) {
    // console.log(artists);
    suggestions.appendChild = `<li>${artists[i]}</li>`;
    console.log(suggestions);
  }
}

function getArtistApi() {
  fetch(`https://api.spotify.com/v1/search?q=${searchInput.value}&type=artist&limit=5`, {
    method: 'GET',
    headers: {
      // Refrescar token
      Authorization: 'Bearer BQDhwlVfa_m0vlKAPXm7ILUPnsxReRAhJFoVn5y3BxAt-MUsIA2vSM9TAUuuvhkesY4BtkJYgUszyh9F87Vh5co_v8N9Wxjd4HjdrK58Z-hHLbE4GIfwNkXpqk4ptof1Hpbkz1nQpgE',
    },
  }).then((response) => response.json()).then((data) => {
    // console.log(data);
    getData(data);
  });
  // .catch((err) => console.log('error', err));
}

searchButton.addEventListener('click', getArtistApi);
