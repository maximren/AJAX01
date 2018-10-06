import '../assets/styles/index.scss';

import axios from 'axios';


const content = document.querySelector('#content .row');

const characters = document.getElementById('characters');
const location = document.getElementById('location');
const episode = document.getElementById('episode');
const prevBtn = document.querySelector('.pagination .prev');
const nextBtn = document.querySelector('.pagination .next');
let paginationObj = {
    prev: '',
    next: ''
};

const api = 'https://rickandmortyapi.com/api/';

characters.addEventListener('click', function () {
    location.parentNode.classList.remove('active');
    episode.parentNode.classList.remove('active');
    this.parentNode.classList.add('active');

    axios.get(api + 'character/')
        .then(function (resp) {
            //console.log(resp.data);
            renderElements(resp.data, createCharacterCard);
        })
        .catch(err => {
            console.log(err);
        });
});

location.addEventListener('click', function () {
    characters.parentNode.classList.remove('active');
    episode.parentNode.classList.remove('active');
    this.parentNode.classList.add('active');

    axios.get(api + 'location/')
        .then(function (resp) {
            console.log(resp.data);
            renderElements(resp.data, createLocationCard);
        })
        .catch(err => {
            console.log(err);
        });
});

episode.addEventListener('click', function () {
    location.parentNode.classList.remove('active');
    characters.parentNode.classList.remove('active');
    this.parentNode.classList.add('active');

    axios.get(api + 'episode/')
        .then(function (resp) {
            console.log(resp.data);
            renderElements(resp.data, createEpisodeCard);
        })
        .catch(err => {
            console.log(err);
        });
});

nextBtn.addEventListener('click', function () {
    if (paginationObj.next == '') {
        alert('End of the road!');
        return;
    }
    paginate(paginationObj.next);
});

prevBtn.addEventListener('click', function () {
    console.log(paginationObj);
    if (paginationObj.prev == '') {
        alert('End of the road!');
        return;
    }
    paginate(paginationObj.prev);
});

document.body.addEventListener('click', function (evt) {
    evt.preventDefault();
    const currentTarget = evt.target;

    if (currentTarget.classList.contains('character-link')) {
        axios.get(currentTarget.href)
            .then(function (resp) {
                console.log(resp);
                renderElements(resp.data, createSingleCharacterPage);
            })
            .catch(err => {
                console.log(err);
            });
    }

});

function paginate(url) {
    let splitedLink = url.split('/');
    let linkType = splitedLink[4];
    let functionName = createCharacterCard;
    switch (linkType) {
        case 'character': {
            functionName = createCharacterCard;
            break;
        }
        case 'location': {
            functionName = createLocationCard;
            break;
        }
        case 'episode': {
            functionName = createEpisodeCard;
            break;
        }
    }

    axios.get(url)
        .then(function (resp) {
            renderElements(resp.data, functionName);
        })
        .catch(err => {
            console.log(err);
        });
}

function renderElements(data, elementFunction) {
    content.innerHTML = '';

    if (data.info) {
        paginationObj.prev = data.info.prev;
        paginationObj.next = data.info.next;

        prevBtn.style = 'display:block;'
        nextBtn.style = 'display:block;'
    } else {
        prevBtn.style = 'display:none;'
        nextBtn.style = 'display:none;'
    }

    if (Array.isArray(data.results)) {
        let charactersArr = data.results.map(obj => {
            return elementFunction(obj);
        });

        charactersArr.forEach(function (card) {
            content.append(card);
        })
    } else {
        content.append(elementFunction(data))
    }
}

function laodCharacters() {
    axios.get(api + 'character/')
        .then(function (resp) {
            //console.log(resp.data);
            renderElements(resp.data, createCharacterCard);
        })
        .catch(err => {
            console.log(err);
        });
}

laodCharacters();

function createCharacterCard(character) {
    const cardWrap = document.createElement('div');
    cardWrap.classList.add('col-md-3', 'character-item');

    const card = document.createElement('div');
    card.classList.add('card');
    const image = document.createElement('img');
    image.classList.add('card-image-top');
    image.src = character.image;

    card.append(image);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.innerText = character.name


    const characterLink = document.createElement('a');
    characterLink.classList.add('btn', 'btn-primary', 'character-link');
    characterLink.href = character.url;
    characterLink.innerText = 'I need more!';

    cardBody.append(cardTitle);
    cardBody.append(characterLink);
    card.append(cardBody);
    cardWrap.append(card);
    return cardWrap;
}

function createLocationCard(location) {
    const cardWrap = document.createElement('div');
    cardWrap.classList.add('col-md-3', 'location-item');

    const card = document.createElement('div');
    card.classList.add('card');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.innerText = `Location: ${location.name}`;

    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.innerHTML = `<hr>
		Type: ${location.type} <hr>
		Dimension: ${location.dimension}
	`;

    cardBody.append(cardTitle);
    cardBody.append(cardText);
    card.append(cardBody);
    cardWrap.append(card);
    return cardWrap;
}

function createEpisodeCard(episode) {
    const cardWrap = document.createElement('div');
    cardWrap.classList.add('col-md-3', 'episode-item');

    const card = document.createElement('div');
    card.classList.add('card');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.innerText = `Episode: ${episode.name}`;

    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.innerHTML = `<hr>
		Episode: ${episode.episode} <hr>
		Air date: ${episode.air_date}
	`;

    cardBody.append(cardTitle);
    cardBody.append(cardText);
    card.append(cardBody);
    cardWrap.append(card);
    return cardWrap;
}

function createSingleCharacterPage(character) {
    const singleCharacterWrap = document.createElement('div');
    singleCharacterWrap.classList.add('character-wrap', 'row', 'col-12')

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap', 'col-md-4');

    const image = document.createElement('img');
    image.classList.add('card-image-top');
    image.src = character.image;

    imageWrap.append(image);

    const characterInfoWrap = document.createElement('div');
    characterInfoWrap.classList.add('col-md-8', 'character-info-wrap');
    const characterCreationTime = new Date(character.created);

    characterInfoWrap.innerHTML = `
		<h1>${character.name}</h1>
		<hr>
		<p>Species: ${character.species}</p>
		<hr>
		<p>Gender: ${character.gender}</p>
		<hr>
		<p>Status: ${character.status}</p>
		<hr>
		<p>Origin: ${character.origin.name}</p>
		<hr>
		<p>Location: ${character.location.name}</p>
		<hr>
		<p>Created: ${characterCreationTime}</p>
	`;

    singleCharacterWrap.append(imageWrap);
    singleCharacterWrap.append(characterInfoWrap);

    return singleCharacterWrap;
}