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


function renderPokemonList() {
    let pokemonListContainer = document.getElementById('pokemonList');
    let html = '';

    allPokemonData.forEach((pokemon) => {

        html += `<div onclick="openCard(${pokemon.details.id})" data-pokemon-id="${pokemon.details.id}" class="` + ' container '

        if (pokemon.details && pokemon.details.types && pokemon.details.types.length > 0) {
            let firstType = pokemon.details.types[0].type.name.toLowerCase();
            html += 'container' + firstType + ' ';
        }

        html += '">';
        html += '<div class="' + ' bgColor' + '">';
        html += '<img src="' + pokemon.details.sprites.other['official-artwork'].front_default + '">';
        html += '</div>'
        html += '<p class="id">' + '#' + pokemon.details.id + '</p>'
        html += '<h2>' + pokemon.details.name + '</h2>';
        html += '<div class="flexBox">'

        if (pokemon.details && pokemon.details.types) {
            pokemon.details.types.forEach((type) => {
                let typeName = type.type.name.toLowerCase();
                html += '<p class="type' + typeName + '">' + typeName + '</p>';
            });
            html += '</div>'
        }
        html += '</div>';
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


async function openCard(pokemonId) {
    let selectedPokemon = allPokemonData.find((pokemon) => pokemon.details.id === pokemonId);
    if (selectedPokemon) {
        let modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = '';

        let typesHtml = '';
        if (selectedPokemon.details && selectedPokemon.details.types) {
            selectedPokemon.details.types.forEach((type, index) => {
                let typeName = type.type.name.toLowerCase();
                typesHtml += `<p class="type${typeName}">${typeName}</p>`;
                if (index === 0) {
                    modalContent.className = `modal-content container${typeName}`;
                }
            });
        }
        aboutHtml = `
            <div class="about">
                <p><b>Height:</b> ${selectedPokemon.details.height}</p>
                <p><b>Weight:</b> ${selectedPokemon.details.weight}</p>
                <p><b>Base Experience:</b> ${selectedPokemon.details.base_experience}</p>
            </div>
        `;

        let evolution = await loadEvolutions(pokemonId);

    evolutionHtml = `
        <div class="evolution">
            <img id="evolutionImg" src="${getPokemonImageUrl(evolution.evolution1Name)}">
            <i class="fa-solid fa-angle-right"></i>
            <img id="evolutionImg" src="${getPokemonImageUrl(evolution.evolution2Name)}">
            <i class="fa-solid fa-angle-right"></i>
            <img id="evolutionImg" src="${getPokemonImageUrl(evolution.evolution3Name)}">
        </div>
    `;

        let moves = await loadMoves(pokemonId)
        movesHtml = `
    ${moves.map((move) => `<li>${move.move.name}</li>`).join('')}
    `;

        // Verarbeiten Sie die erhaltenen Evolutionsdaten
        modalContent.innerHTML = modalContents(selectedPokemon, aboutHtml, typesHtml, baseStatsHtml, evolutionHtml, movesHtml);

        let modal = document.getElementById('pokemonModal');
        modal.className = 'modal';

        modal.style.display = 'flex';
    }
}


function getPokemonImageUrl(pokemonName) {
    // Durchsuche dein allPokemonData-Array nach dem passenden Pokémon und erhalte die Bild-URL
    const pokemon = allPokemonData.find((p) => p.details.name === pokemonName);
    if (pokemon) {
        return pokemon.details.sprites.other['official-artwork'].front_default;
    }
    // Wenn das Pokémon nicht gefunden wurde, gib eine Standard-URL oder Fehlerbild-URL zurück
    return 'Standard-Bild-URL';
}


function generateMovesHTML(moves) {
    let movesHtml = '<div class="moves">';
    moves.forEach((move) => {
        movesHtml += `<p>${move.move.name}</p>`;
    });
    movesHtml += '</div>';
    return movesHtml;
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