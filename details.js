async function toggleTab(tab, pokemonId) {
    // Entfernen Sie die Unterstreichung von allen Tabs
    document.querySelectorAll('.details p').forEach((element) => {
        element.classList.remove('underlined-text');
    });

    // Fügen Sie die Unterstreichung zum ausgewählten Tab hinzu
    document.querySelector(`.details p[data-tab="${tab}"]`).classList.add('underlined-text');

    // Zeigen Sie den Inhalt des ausgewählten Tabs an
    let tabContent = document.getElementById(tab);
    if (tabContent) {
        // Verstecken Sie alle Tab-Inhalte
        document.querySelectorAll('.tab-content').forEach((content) => {
            content.style.display = 'none';
        });

        // Zeigen Sie den ausgewählten Tab-Inhalt an
        tabContent.style.display = 'block';

        if (tab === 'about') {
            tabContent.innerHTML = aboutHtml; 
        } else if (tab === 'baseStats') {
            createStatsChart(pokemonId, tabContent);
        } else if (tab === 'evolution') {
            tabContent.innerHTML = evolutionHtml
        } else if (tab === 'moves') {
            tabContent.innerHTML = movesHtml;
        }
    }
}