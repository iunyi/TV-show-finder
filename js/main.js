'use strict';

// Arrays globales
let shows = [];
let favorites =[];

// Variables
const button = document.querySelector('.js-button');
const searchBar = document.querySelector('.js-input');
const resultsUl = document.querySelector('.js-results-ul');
const favUl = document.querySelector('.js-fav-ul');
const header = document.querySelector('.header');
const main = document.querySelector('.main')
// 1. Pedir información a la API tras realizar una búsqueda
button.addEventListener('click', removeWelcomeScreen)
searchBar.addEventListener('keyup', removeWelcomeScreen)

function removeWelcomeScreen(){
    header.classList.remove('header-start')
    main.classList.remove('hidden')
    requestData()
}

function requestData(){
    const input = document.querySelector('.js-input').value;
    const url = `http://api.tvmaze.com/search/shows?q=${input}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            shows = data
            getData()
        })
}

function getData(){
    for(let i = 0; i < shows.length; i++){
        const showId = shows[i].show.id
        const showName = shows[i].show.name
        if(shows[i].show.image !== null){
            shows[i].show.image = shows[i].show.image.medium
        } else {
            shows[i].show.image = 'https://via.placeholder.com/210x295/ffffff/666666/?'
        }
    }
    renderShows()
    
}

// 2. Pintar datos en la página
function renderShows(){
    
    let codeHTML = ''
    for(let i = 0; i < shows.length; i++){
        codeHTML += `<li class="js-results-li" id="${shows[i].show.id}">`
        codeHTML += `<img src="${shows[i].show.image}" alt="${shows[i].show.name}"title="${shows[i].show.name}">`
        codeHTML += `<p>${shows[i].show.name}<p>`
        codeHTML += `</li>`
    }
    resultsUl.innerHTML = codeHTML;

    // Comprobar si hay algún resultado marcado previamente como favorito
    for(let j = 0; j < favorites.length; j++){
        const rememberedFav = shows.find(show => show.show.id === favorites[j].show.id)
        if (rememberedFav !== -1){
            const rememberedFavPosition = shows.findIndex(show => show.show.id === favorites[j].show.id)
            const resultsLi = document.querySelectorAll('.js-results-li');

            setInLocalStorage()
          
            for (let i = 0; i < resultsLi.length; i++){
                if (rememberedFavPosition !== -1){
                    resultsLi[rememberedFavPosition].classList.add('highlight');
                    setInLocalStorage()
                    getFromLocalStorage()
                }   
            }  
        }
    }
    addShowsListeners()

    // crear mensaje sin resultados
    const pEmptyResults = document.createElement('p');
    const pEmptyResultsContent = document.createTextNode('There were no shows found ( ˘︹˘ ) ');
    pEmptyResults.appendChild(pEmptyResultsContent);
    resultsUl.appendChild(pEmptyResults);

    if (searchBar.value === ''){
        pEmptyResults.classList.add('hidden')
    } else if (shows.length !== 0){
        pEmptyResults.classList.add('hidden')
    } else {
        pEmptyResults.classList.remove('hidden')
    }
}

// 3. Añadir listeners
function addShowsListeners(){
    const resultsLi = document.querySelectorAll('.js-results-li');

    for(let item of resultsLi){
        item.addEventListener('click', handleClickShow)
    }
}

// 4. Añadir favoritos - función manejadora
function handleClickShow(){
    addFav(event)
    highlightFav(event)
    renderFav()
    setInLocalStorage()
    getFromLocalStorage()
}

// 4.1. Resaltar favoritos de resultados de búsqueda
function highlightFav(event){
    event.currentTarget.classList.toggle('highlight');

    setInLocalStorage()
    getFromLocalStorage()
}

// 4.2. Añadir series al array de favoritos
function addFav(event){
    const index = parseInt(event.currentTarget.id);
    const objectInShow = shows.find(show => show.show.id === index)
    const objectInFav = favorites.find(favorite => favorite.show.id === index)

    if (favorites.indexOf(objectInFav) === -1){
        favorites.push(objectInShow)
    } else {
        let position = favorites.indexOf(objectInFav)
        favorites.splice(position, 1)
    }
}

// 4.3. Pintar en sección de favoritos (página)
function renderFav(){
    let codeHTML = ''
    for(let favorite of favorites){
        codeHTML += `<li class="js-fav-li" id="${favorite.show.id}">`
        codeHTML += `<img src="${favorite.show.image}" alt="${favorite.show.name}"title="${favorite.show.name}">`
        codeHTML += `<p>${favorite.show.name}</p>`
        codeHTML += `</li>`
    }
    favUl.innerHTML = codeHTML;
    if (favorites.length !== 0){
        pEmptyFav.classList.add('hidden')
    } else {
        pEmptyFav.classList.remove('hidden')
    }
}

// 5. Local storage
// 5.1. Guardar en local storage
function setInLocalStorage(){
    localStorage.setItem('Favorites', JSON.stringify(favorites))
}

// 5.2. Recuperar del local storage guardando en un array
const pEmptyFav = document.createElement('p')
const pEmptyFavContent = document.createTextNode('Your favorite-show list is empty ( ·﹏· )')
pEmptyFav.appendChild(pEmptyFavContent)
pEmptyFav.classList.add('small')

function getFromLocalStorage(){
    const data = JSON.parse(localStorage.getItem('Favorites'))
    if (data !== null){
        favorites = data
    } 
    renderFromLocalStorage()

    // 5.3. Pintar favoritos del LS guardados en el array 
    function renderFromLocalStorage(){
        let codeHTML = ''
        for(let item of data){
            codeHTML += `<li class="js-fav-li" id="${item.show.id}">`
            codeHTML += `<div>`
            codeHTML += `<img src="${item.show.image}" alt="${item.show.name}"title="${item.show.name}">`
            codeHTML += `<i class="fas fa-times corner delete"></i>`
            codeHTML += `</div>`
            codeHTML += `<p>${item.show.name}</p>`
            codeHTML += `</li>`
        }
        favUl.innerHTML = codeHTML;

        renderReset()
       
        // 6. Eliminar una serie de la lista de favoritos
        const child = document.querySelectorAll('.fa-times');
        for (const item of child){
            item.addEventListener('click', removeFromFav)
        }

        function removeFromFav(event){
            const father = event.currentTarget.parentElement
            const grandfather = father.parentElement
            const grandfatherId = parseInt(grandfather.id)
            const favToRemove = favorites.findIndex(favorite => favorite.show.id === grandfatherId)

            favorites.splice(favToRemove, 1);

            setInLocalStorage()
            getFromLocalStorage()
            renderShows()
        }
    }
}

// 7. Reset (eliminar lista de favoritos)
// 7.1. Crear botón reset
const favSection = document.querySelector('.fav')
const resetButton = document.createElement('button');
const icon = document.createElement('i')

resetButton.classList.add('button');
icon.classList.add('fas');
icon.classList.add('fa-trash-alt');

resetButton.appendChild(icon);
resetButton.classList.add('reset')

// 7.2. Pintar botón
function renderReset(){
    if (favorites.length !== 0){
        favSection.appendChild(resetButton);
        resetButton.classList.remove('hidden')
        pEmptyFav.classList.add('hidden')
    } else if(favorites.length === 0){
        resetButton.classList.add('hidden')
        pEmptyFav.classList.remove('hidden')
        favSection.appendChild(pEmptyFav)
    }
    addResetListener();
}

// 7.3. Añadir listener a botón de reset
function addResetListener(){
    resetButton.addEventListener('click', resetFavorites)
}

// 7.4. Eliminar lista de favoritos
function resetFavorites(){
    favorites = [];
    renderFav()
    renderShows()
    resetButton.classList.add('hidden')
    favSection.appendChild(pEmptyFav)
    setInLocalStorage()
    getFromLocalStorage()
}

// 8. Eliminar valor del input de búsqueda
const eraseSearchButton = document.querySelector('.js-erase')

function eraseSearchContent(){
    searchBar.value = ''
    shows = []
    renderShows()
}
eraseSearchButton.addEventListener('click', eraseSearchContent)

// 9. Sección favoritos desplegable
const heart = document.querySelectorAll('.fa-heart');
const favSectionMinimized = document.querySelector('.fav-minimized');

function maxMinFav(){
    favSection.classList.toggle('hidden')
    favSectionMinimized.classList.toggle('hidden')
}

for(let item of heart){
    item.addEventListener('click', maxMinFav)
}

const resultsSection = document.querySelector('.results');

// 0. Arrancar página
getFromLocalStorage()

