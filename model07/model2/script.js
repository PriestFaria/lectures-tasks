function gravitationalPotentialEnergy(y, g, m) {
    return m * g * y; 
}

function elasticPotentialEnergy(x, k, x0) {
    return 0.5 * k * Math.pow(x - x0, 2); 
}

function calculatePotentialField(width, height, g, k, mass, scenario) {
    const U = [];
    const x0 = 0; 


    for (let j = 0; j <= height; j += 0.1) { 
        const row = [];
        for (let i = 0; i <= width; i += 0.1) { 
            let totalU = 0;

           
            totalU += gravitationalPotentialEnergy(j, g, mass); 


            if (scenario === "both") {
                const U_spring = elasticPotentialEnergy(i, k, x0);
                totalU += U_spring;
            }

            row.push(totalU);
        }
        U.push(row);
    }

    return U;
}

function updateSimulation() {
    const g = parseFloat(document.getElementById('gravity').value);
    const k = parseFloat(document.getElementById('springConstant').value);
    const mass = parseFloat(document.getElementById('mass').value);
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    const scenario = document.getElementById('scenario').value;

    const U = calculatePotentialField(width, height, g, k, mass, scenario);

    const x = Array.from({ length: (width / 0.1) + 1 }, (_, i) => i * 0.1); 
    const y = Array.from({ length: (height / 0.1) + 1 }, (_, j) => j * 0.1); 

    const data = [{
        z: U, 
        x: x,
        y: y,
        type: 'heatmap',
        colorscale: 'Viridis',
        colorbar: {
            title: 'Потенциальная энергия (Дж)',
            titleside: 'right',
            tickvals: [0, Math.max(...U.flat())],
            ticktext: ['0', Math.round(Math.max(...U.flat())) + ' Дж'],
        }
    }];

    const layout = {
        title: 'Распределение потенциальной энергии',
        xaxis: { title: 'X (м)' },
        yaxis: { title: 'Y (м)' },
        autosize: true,
        height: 600
    };

    Plotly.newPlot('potentialField', data, layout);
}
