function calculatePotentialAndField(charges, gridSize = 50) {
    const grid = Array.from({ length: gridSize }, (_, i) => i / (gridSize - 1) * 10 - 5); // Сетка от -5 до 5
    const potential = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    const Ex = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    const Ey = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const x = grid[j];
            const y = grid[i];
            charges.forEach(([cx, cy, q]) => {
                const dx = x - cx;
                const dy = y - cy;
                const r2 = dx * dx + dy * dy;
                const r = Math.sqrt(r2);

                if (r > 0.01) { // Убираем сингулярности
                    potential[i][j] += q / r;
                    Ex[i][j] += q * dx / (r * r2);
                    Ey[i][j] += q * dy / (r * r2);
                }
            });
        }
    }
    return { grid, potential, Ex, Ey };
}

function plotField() {
    const chargesInput = document.getElementById('charges').value;
    const charges = chargesInput.split(';').map(ch => ch.split(',').map(Number));

    const { grid, potential, Ex, Ey } = calculatePotentialAndField(charges);

    const potentialData = {
        x: grid,
        y: grid,
        z: potential,
        type: 'contour',
        colorscale: 'Electric',
        contours: { coloring: 'heatmap' },
        name: 'Потенциал'
    };

    const vectorField = {
        type: 'scatter',
        mode: 'markers+lines',
        x: [],
        y: [],
        u: [],
        v: [],
        line: { color: 'black', width: 1 },
    };

    const step = 4; // Шаг для упрощения векторного поля
    for (let i = 0; i < grid.length; i += step) {
        for (let j = 0; j < grid.length; j += step) {
            vectorField.x.push(grid[j]);
            vectorField.y.push(grid[i]);
            const scale = 0.5; // Масштаб для стрелок
            vectorField.u.push(Ex[i][j] * scale);
            vectorField.v.push(Ey[i][j] * scale);
        }
    }

    const layout = {
        title: 'Электростатическое поле',
        xaxis: { title: 'X' },
        yaxis: { title: 'Y' },
        height: 600
    };

    Plotly.newPlot('fieldGraph', [potentialData, vectorField], layout);
}
