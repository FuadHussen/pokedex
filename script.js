/*
let allPokemon = []; // Eine Liste für alle geladenen Pokémon
let nextUrl = 'https://pokeapi.co/api/v2/pokemon/';

function init() {
    loadAllPokemon();
}

async function loadAllPokemon() {
    while (nextUrl) {
        let response = await fetch(nextUrl);
        let data = await response.json();

        allPokemon = allPokemon.concat(data.results);

        nextUrl = data.next;
    }

    renderAllPokemon();
}

async function loadPokemonDetails(url, nameElement, imageElement) {
    let response = await fetch(url);
    let pokemon = await response.json();

    nameElement.textContent = pokemon.name;
    imageElement.src = pokemon.sprites.other.home.front_default;
}

function renderAllPokemon() {
    let infoContainer = document.getElementById('infoContainer');

    for (let i = 0; i < 30; i++) {
        let pokemonName = allPokemon[i].name;

        let pokemonContainer = document.createElement('div');
        let nameElement = document.createElement('h2');
        let imageElement = document.createElement('img');

        nameElement.textContent = pokemonName;
        pokemonContainer.classList.add('container');

        loadPokemonDetails(allPokemon[i].url, nameElement, imageElement);

        pokemonContainer.appendChild(nameElement);
        pokemonContainer.appendChild(imageElement);
        infoContainer.appendChild(pokemonContainer);
    }
}

init();
*/


let allPokemonData = [];

async function init() {
    await loadAllPokemon();
    renderPokemonList();
}

async function loadAllPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=100'; // Load the first 100 Pokemon
    let response = await fetch(url);
    let data = await response.json();

    // Store the data for all Pokemon in allPokemonData array
    allPokemonData = data.results;

    // Clear the previous Pokemon list if any
    document.getElementById('pokemonList').innerHTML = '';

    // Load details for each Pokemon
    await Promise.all(allPokemonData.map(async (pokemon) => {
        let response = await fetch(pokemon.url);
        let details = await response.json();
        pokemon.details = details;
    }));
}

function renderPokemonList() {
    let pokemonListContainer = document.getElementById('pokemonList');

    allPokemonData.forEach((pokemon) => {
        let pokemonContainer = document.createElement('div');
        let nameElement = document.createElement('h2');
        let imageElement = document.createElement('img');

        nameElement.textContent = pokemon.details.name;
        imageElement.src = pokemon.details.sprites.other['official-artwork'].front_default;

        pokemonContainer.appendChild(nameElement);
        pokemonContainer.appendChild(imageElement);

        pokemonListContainer.appendChild(pokemonContainer);
    });
}

init();