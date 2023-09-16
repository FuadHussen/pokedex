async function createStatsChart(pokemonId, targetElement) {
  let baseStats = await loadBaseStatsData(pokemonId);

  const baseStatst = [
    baseStats[0].base_stat, // HP
    baseStats[1].base_stat, // Attack
    baseStats[2].base_stat, // Defense
    baseStats[3].base_stat, // Special Attack
    baseStats[4].base_stat, // Special Defense
    baseStats[5].base_stat  // Speed
  ];

  const statLabels = ['HP', 'Attack', 'Defense', 'S. ATT', 'S. DEF', 'Speed'];

  // Erstellen Sie ein Canvas-Element für das Diagramm
  const canvas = document.createElement('canvas');
  canvas.id = 'myChart'; // Verwenden Sie die gleiche ID wie zuvor
  targetElement.innerHTML = ''; // Löschen Sie den vorherigen Inhalt der "baseStats"-div
  targetElement.appendChild(canvas); // Fügen Sie das Canvas-Element in die "baseStats"-div ein

  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: statLabels,
      datasets: [{
        label: '',
        data: baseStatst,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            autoSkip: false, // Deaktiviert automatisches Überspringen von Achsenbeschriftungen
            maxRotation: 0, // Setzt die maximale Drehung auf 0 Grad
            minRotation: 0 // Setzt die minimale Drehung auf 0 Grad
          }
        },
        y: {
          beginAtZero: true
        }
      }
    }
  })};