async function toggleTab(tab, pokemonId) {
    // Entfernen Sie die Unterstreichung von allen Tabs
    removeUnderlineFromTabs();

    // Fügen Sie die Unterstreichung zum ausgewählten Tab hinzu
    addUnderlineToTab(tab);

    // Zeigen Sie den Inhalt des ausgewählten Tabs an
    showTabContent(tab, pokemonId);
}

function removeUnderlineFromTabs() {
    document.querySelectorAll('.details p').forEach((element) => {
        element.classList.remove('underlined-text');
    });
}

function addUnderlineToTab(tab) {
    document.querySelector(`.details p[data-tab="${tab}"]`).classList.add('underlined-text');
}

function showTabContent(tab, pokemonId) {
    // Verstecken Sie alle Tab-Inhalte
    hideAllTabContents();

    // Zeigen Sie den ausgewählten Tab-Inhalt an
    const tabContent = document.getElementById(tab);
    if (tabContent) {
        tabContent.style.display = 'block';

        if (tab === 'about') {
            tabContent.innerHTML = aboutHtml;
        } else if (tab === 'baseStats') {
            createStatsChart(pokemonId, tabContent);
        } else if (tab === 'evolution') {
            tabContent.innerHTML = evolutionHtml;
        } else if (tab === 'moves') {
            tabContent.innerHTML = movesHtml;
        }
    }
}

function hideAllTabContents() {
    document.querySelectorAll('.tab-content').forEach((content) => {
        content.style.display = 'none';
    });
}

async function openCard(pokemonId) {
    const selectedPokemon = getSelectedPokemon(pokemonId);

    if (selectedPokemon) {
        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = '';

        const typesHtml = getTypesHtml(selectedPokemon);
        aboutHtml = getAboutHtml(selectedPokemon);
        evolutionHtml = await getEvolutionHtml(pokemonId);
        movesHtml = await getMovesHtml(pokemonId);

        modalContent.innerHTML = modalContents(selectedPokemon, aboutHtml, typesHtml, baseStatsHtml, evolutionHtml, movesHtml);

        const modal = document.getElementById('pokemonModal');
        modal.className = 'modal';
        modal.style.display = 'flex';
    }
}

function getSelectedPokemon(pokemonId) {
    return allPokemonData.find((pokemon) => pokemon.details.id === pokemonId);
}

function getTypesHtml(selectedPokemon) {
    let typesHtml = '';
    if (selectedPokemon.details && selectedPokemon.details.types) {
        selectedPokemon.details.types.forEach((type, index) => {
            let typeName = type.type.name.toLowerCase();
            typesHtml += `<p class="type${typeName}">${typeName}</p>`;
            if (index === 0) {
                modalContent.className = `container${typeName}`;
            }
        });
    }
    return typesHtml;
}

function getAboutHtml(selectedPokemon) {
    return `
        <div class="about">
            <p><b>Height:</b> ${selectedPokemon.details.height}</p>
            <p><b>Weight:</b> ${selectedPokemon.details.weight}</p>
            <p><b>Base Experience:</b> ${selectedPokemon.details.base_experience}</p>
        </div>
    `;
}

async function getEvolutionHtml(pokemonId) {
    const evolution = await loadEvolutions(pokemonId);

    return `
        <div class="evolution">
            <img id="evolutionImg" src="${getPokemonImageUrl(evolution.evolution1Name)}">
            <i class="fa-solid fa-angle-right"></i>
            <img id="evolutionImg" src="${getPokemonImageUrl(evolution.evolution2Name)}">
            <i class="fa-solid fa-angle-right"></i>
            <img id="evolutionImg" src="${getPokemonImageUrl(evolution.evolution3Name)}">
        </div>
    `;
}

async function getMovesHtml(pokemonId) {
    const moves = await loadMoves(pokemonId);

    return `
        ${moves.map((move) => `<li>${move.move.name}</li>`).join('')}
    `;
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
