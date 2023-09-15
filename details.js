let lastClickedElement = null;



function toggleTab(tab, pokemonId) {
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
            // Stellen Sie hier den Code ein, um die "About"-Daten anzuzeigen
            tabContent.innerHTML = aboutHtml; // Fügen Sie die "About"-Daten hier ein
        } else if (tab === 'baseStats') {
            // Rufen Sie die displayBaseStats-Funktion auf, wenn das "Base Stats"-Tab ausgewählt ist
            tabContent.innerHTML = baseStatsHtml; // Fügen Sie die "Base Stats"-Daten hier ein
        } else if (tab === 'evolution') {
            // Zeigen Sie die Evolution-Daten an, wenn das "Evolution"-Tab ausgewählt ist
            tabContent.innerHTML = evolutionHtml; tabContent.innerHTML = evolutionHtml;
        }
    }
}
