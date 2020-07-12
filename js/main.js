'use strict';

// Arrays globales
let shows = [];
let favorites =[];

// Variables
const button = document.querySelector('.js-button');
const resultsUl = document.querySelector('.js-results-ul');
const favUl = document.querySelector('.js-fav-ul');
const searchBar = document.querySelector('.js-input');

// 1. Pedir información a la API tras realizar una búsqueda
button.addEventListener('click', requestData);
searchBar.addEventListener('keyup', requestData);

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
// TRYING
    let codeHTML = ''
    for(let i = 0; i < shows.length; i++){
        codeHTML += `<li class="js-results-li" id="${shows[i].show.id}">`
        codeHTML += `<img src="${shows[i].show.image}" alt="${shows[i].show.name}"title="${shows[i].show.name}">`
        codeHTML += `<p>${shows[i].show.name}<p>`
        codeHTML += `</li>`
    }

    resultsUl.innerHTML = codeHTML;

    for(let j = 0; j < favorites.length; j++){
        const rememberedFav1 = shows.find(show => show.show.id === favorites[j].show.id)
        if (shows.find(show => show.show.id === favorites[j].show.id) !== -1){
             const rememberedFav1Position = shows.findIndex(show => show.show.id === favorites[j].show.id)
            const resultsLi = document.querySelectorAll('.js-results-li');

            setInLocalStorage()
          
            for (let i = 0; i < resultsLi.length; i++){
                if (rememberedFav1Position !== -1){
                    resultsLi[rememberedFav1Position].classList.add('highlight');
                    setInLocalStorage()
                    getFromLocalStorage()
                }   
            }  
        }
    }
    addShowsListeners()
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
    if (favorites.length !== 0){
        pEmptyFav.classList.add('hidden')
    } else {
        pEmptyFav.classList.remove('hidden')
    }
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
            codeHTML += `<i class="fas fa-times corner"></i>`
            codeHTML += `</div>`
            codeHTML += `<p>${item.show.name}</p>`
            codeHTML += `</li>`
        }
        favUl.innerHTML = codeHTML;

        renderReset()

        if(favorites.length === 0){
            resetButton.classList.add('hidden')
            pEmptyFav.classList.remove('hidden')
            favSection.appendChild(pEmptyFav)
        }
       
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

// 0. Arrancar página
getFromLocalStorage()