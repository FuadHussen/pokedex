let allPokemonData = [];


async function init() {
    await loadAllPokemon();
    renderPokemonList();
}


async function loadAllPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=50'; // Load the first 100 Pokemon
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
    let html = '';
    let containerCount = 1;

    allPokemonData.forEach((pokemon) => {

        html += '<div class="' + ' container ';
        
        if (pokemon.details && pokemon.details.types && pokemon.details.types.length > 0) {
            let firstType = pokemon.details.types[0].type.name.toLowerCase(); // Erster Typname in Kleinbuchstaben
            // Hier fügen wir die Klasse des ersten Typs dem äußeren Container hinzu
            html += 'container' + firstType + ' ';
        }
        
        html += '">';
        html += '<img src="' + pokemon.details.sprites.other['official-artwork'].front_default + '">';
        html += '<p class="id">' + '#' + pokemon.details.id + '</p>'
        html += '<h2>' + pokemon.details.name + '</h2>';
        html += '<div class="flexBox">'

        if (pokemon.details && pokemon.details.types) {
            // Durchlaufen Sie die Typen und fügen Sie jedem Typ eine Klasse hinzu
            pokemon.details.types.forEach((type, index) => {
                let typeName = type.type.name.toLowerCase(); // Typname in Kleinbuchstaben
                // Hier setzen wir die Klassenbasis auf 'type' gefolgt vom Typnamen
                html += '<p class="type' + typeName + '">' + typeName + '</p>';
            });
            html += '</div>'
        }
        html += '</div>';
    });
    pokemonListContainer.innerHTML = html;
}


init();