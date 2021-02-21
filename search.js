const searchAPI = 'https://api.spotify.com/v1/search?q=frank%20ocean&type=artist&limit=5';

const getArtist = () => fetch(searchAPI).then((response) => response.json());

export default getArtist;
