let allPokemonData = [];
let visiblePokemonCount = 30;




async function init() {
    await loadAllPokemon();
    renderPokemonList();

    const loadMoreButton = document.getElementById('loadMoreButton');
    loadMoreButton.addEventListener('click', loadMorePokemon);
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


function renderPokemonList() {
    let pokemonListContainer = document.getElementById('pokemonList');
    let html = '';

    allPokemonData.forEach((pokemon) => {

        html += '<div class="' + ' container '
        
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


init();