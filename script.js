let allPokemonData = [];
let visiblePokemonCount = 30;
let aboutHtml = '';
let baseStatsHtml = '';
let evolutionHtml = '';
let movesHtml = '';



async function init() {
    await loadAllPokemon();
    renderPokemonList();
    openCard();
    searchPokemon();

    const loadMoreButton = document.getElementById('loadMoreButton');
    loadMoreButton.addEventListener('click', loadMorePokemon);
}


async function loadBaseStatsData(pokemonId) {
    let baseStatsUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    let response = await fetch(baseStatsUrl);
    let data = await response.json();

    let baseStats = data.stats;

    return baseStats;
}


async function loadAllPokemon() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${visiblePokemonCount}`;
    let response = await fetch(url);
    let data = await response.json();
    allPokemonData = data.results;

    await Promise.all(allPokemonData.map(async (pokemon) => {
        let response = await fetch(pokemon.url);
        let details = await response.json();
        pokemon.details = details;
    }));
}


async function loadEvolutions(pokemonId) {
    // Rufen Sie die Evolutionsdaten von der API ab
    const evolutionUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    const response = await fetch(evolutionUrl);
    const data = await response.json();

    // Hier erhalten Sie die relevanten Evolutionsdaten aus dem Datenobjekt
    const evolutionChainUrl = data.evolution_chain.url;
    const evolutionChainResponse = await fetch(evolutionChainUrl);
    const evolutionChainData = await evolutionChainResponse.json();

    // Extrahiere die Namen der Pokémon für die Evolutionen
    const evolution1Name = evolutionChainData.chain.species.name;
    const evolution2Name = evolutionChainData.chain.evolves_to[0]?.species.name || null;
    const evolution3Name = evolutionChainData.chain.evolves_to[0]?.evolves_to[0]?.species.name || null;

    return {
        evolution1Name,
        evolution2Name,
        evolution3Name
    };
}

function getSpriteUrl(pokemonName) {
    const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
    const endpoint = `${pokemonName}/`;
    return `${baseUrl}${endpoint}`;
}


async function loadMoves(pokemonId) {
    const movesUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const response = await fetch(movesUrl);
    const data = await response.json();

    // Hier erhalten Sie die relevanten Moves-Daten aus dem Datenobjekt
    const moves = data.moves;

    return moves;
}


function generatePokemonHTML(pokemon) {
    let html = '';
    html += `<div onclick="openCard(${pokemon.details.id})" data-pokemon-id="${pokemon.details.id}" class="container`;

    if (pokemon.details && pokemon.details.types && pokemon.details.types.length > 0) {
        let firstType = pokemon.details.types[0].type.name.toLowerCase();
        html += ' container' + firstType;
    }

    html += '">';
    html += '<div class="bgColor">';
    html += `<img src="${pokemon.details.sprites.other['official-artwork'].front_default}">`;
    html += '</div>';
    html += `<p class="id">#${pokemon.details.id}</p>`;
    html += `<h2>${pokemon.details.name}</h2>`;
    html += '<div class="flexBox">';

    if (pokemon.details && pokemon.details.types) {
        pokemon.details.types.forEach((type) => {
            let typeName = type.type.name.toLowerCase();
            html += `<p class="type${typeName}">${typeName}</p>`;
        });
        html += '</div>';
    }
    html += '</div>';
    return html;
}


function renderPokemonList() {
    let pokemonListContainer = document.getElementById('pokemonList');
    let html = '';

    allPokemonData.forEach((pokemon) => {
        html += generatePokemonHTML(pokemon);
    });

    pokemonListContainer.innerHTML = html;
}


function setupLoadMoreButton() {
    const loadMoreButton = document.getElementById('loadMoreButton');

    loadMoreButton.addEventListener('click', async () => {
        visiblePokemonCount += 30;
        await loadAllPokemon();
        renderPokemonList();
    });
}


async function loadMorePokemon() {
    visiblePokemonCount += 30;
    await loadAllPokemon();
    renderPokemonList();
}


function closeCardModal() {
    let modal = document.getElementById('pokemonModal');
    modal.style.display = 'none';
}


document.addEventListener('click', (event) => {
    let modal = document.getElementById('pokemonModal');
    if (event.target === modal) {
        closeCardModal();
    }
});


function modalContents(selectedPokemon, aboutHtml, typesHtml) {
    return `
    <div id="test" class="containerCard">
        <h2>${selectedPokemon.details.name}</h2>
        <img src="${selectedPokemon.details.sprites.other['official-artwork'].front_default}">
        <p class="id">#${selectedPokemon.details.id}</p>
        <div class="containerDetails">
            <div id="details" class="details">
                <p class="underlined-text" onclick="toggleTab('about')" data-tab="about"><b>About</b></p>
                <p onclick="toggleTab('baseStats', ${selectedPokemon.details.id})" data-tab="baseStats"><b>Base Stats</b></p>
                <p onclick="toggleTab('evolution')" data-tab="evolution"><b>Evolution</b></p>
                <p onclick="toggleTab('moves')" data-tab="moves"><b>Moves</b></p>
            </div>
            <div id="baseStats" class="tab-content">
            </div>
            <div id="evolution" class="tab-content">
            </div>
            <div id="moves" class="tab-content">
            </div>
            <div id="about" class="tab-content">
                ${aboutHtml}
            </div>
        </div>
        <div class="flexBox">
            ${typesHtml}
        </div>
    </div>
`;
}


function searchPokemon() {
    const input = document.getElementById('searchPokemon');

    input.addEventListener('keyup', (event) => {
        const searchTerm = event.target.value.trim().toLowerCase();
        const containers = document.querySelectorAll('.container');

        containers.forEach((container) => {
            const pokemonName = container.querySelector('h2').textContent.toLowerCase();
            const pokemonId = container.querySelector('.id').textContent.toLowerCase(); // Holen Sie sich die ID des Pokemons im Container

            // Überprüfe, ob der Name des Pokemon im Container oder die ID den Suchbegriff enthält
            if (pokemonName.includes(searchTerm) || pokemonId.includes(searchTerm)) {
                container.style.display = 'block'; // Zeige den Container
            } else {
                container.style.display = 'none'; // Verstecke den Container
            }
        });
    });
}


document.addEventListener("DOMContentLoaded", function() {
    var searchPokemon = document.getElementById("searchPokemon");

    // Das Klickereignis für das "x" abfangen
    searchPokemon.addEventListener("input", function(event) {
      if (event.target.value === "") {
        // Das Input-Feld ist leer, tun Sie hier, was Sie möchten
        renderPokemonList();
      }
    });
  });


function up(){
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Für einen sanften Scroll-Effekt
    });
}