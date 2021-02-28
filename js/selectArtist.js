export const listenArtistEvent = () => {
    const artistsElements = document.querySelectorAll('.artist-list-search');
    for (const favoriteElement of artistsElements) {
      favoriteElement.addEventListener('click', handleArtist);
    }
}

export const handleArtist = (ev) => {
    const selectedCLickedArtist = selectedArtists.find((selectedArtist) => selectedArtist.id === ev.currentTarget.id);
    
    if (selectedCLickedArtist === undefined) {
      const clickedArtist = artists.find((artist) => ev.currentTarget.id === artist.id);
      selectedArtists.push(clickedArtist);
    } else {
        const filteredSelected = artists.filter((artist) => ev.currentTarget.id !== artist.id);
        artists = filteredSelected;
    }
    paintSelectedArtists();
  
    const removeArtist = document.querySelectorAll(".rmv-artist");
    for (const removeButton of removeArtist) {
      removeButton.addEventListener("click", removeSelectedArtist);
    }
}

export const paintSelectedArtists = () => {
    let htmlCode = `<div class="selected">`;
  
    for (const selectedArtist of selectedArtists) {
      let selectedID = selectedArtist.id;
      const hasBeenSelected = selectedArtists.find((artistSel) => artistSel.id === selectedID);
      if (hasBeenSelected === undefined) {
        selClass = '';
      } else {
        selClass = 'selected-artist';
      }
      htmlCode += `<li class="li-selected-artist ${selClass}" id="${selectedArtist.id}"> <img class="img-selected-artist" src=${selectedArtist.images[2].url} /> <p class?"name-selected-artist">${selectedArtist.name}</p> <button class="rmv-artist" type="reset">X</button> </li>`;
      getRecommendations(selectedID);
    }
    htmlCode += '</div>';
    const listSelected = document.querySelector("#selected-artists")
    listSelected.innerHTML = htmlCode;
}

export const handleSelectedArtist = () => {
}

export const removeSelectedArtist = (ev) => {
  selectedArtists.splice(ev.currentTarget.id, 1);
  ev.currentTarget.classList.remove("selected-artist");
  console.log(ev.currentTarget);
  paintSelectedArtists();
}