function calculateEnergy(mass, k, b, totalTime, dt) {
    const timeSteps = Math.floor(totalTime / dt);
    const t = Array.from({ length: timeSteps }, (_, i) => i * dt);
    const kineticEnergy = [];
    const potentialEnergy = [];
    const totalEnergy = [];

    let position = 1; // начальное смещение
    let velocity = 0; // начальная скорость
    const dampingFactor = b / (2 * mass);
    const angularFrequency = Math.sqrt(k / mass);

    for (let i = 0; i < timeSteps; i++) {
        // Считаем потенциальную и кинетическую энергию
        const U = 0.5 * k * position * position; // потенциальная энергия
        const K = 0.5 * mass * velocity * velocity; // кинетическая энергия

        kineticEnergy.push(K);
        potentialEnergy.push(U);
        totalEnergy.push(K + U);

        // Обновляем положение и скорость (численный метод Эйлера)
        velocity -= (dampingFactor * velocity + (k / mass) * position) * dt; // уравнение движения
        position += velocity * dt; // обновление положения
    }

    return { t, kineticEnergy, potentialEnergy, totalEnergy };
}

function startSimulation() {
    const mass = parseFloat(document.getElementById('mass').value);
    const springConstant = parseFloat(document.getElementById('springConstant').value);
    const damping = parseFloat(document.getElementById('damping').value);
    const totalTime = 10; // общее время симуляции (с)
    const dt = 0.01; // шаг по времени (с)

    const { t, kineticEnergy, potentialEnergy, totalEnergy } = calculateEnergy(mass, springConstant, damping, totalTime, dt);

    const data = [
        {
            x: t,
            y: kineticEnergy,
            type: 'scatter',
            mode: 'lines',
            name: 'Кинетическая энергия',
            line: { color: 'blue' }
        },
        {
            x: t,
            y: potentialEnergy,
            type: 'scatter',
            mode: 'lines',
            name: 'Потенциальная энергия',
            line: { color: 'red' }
        },
        {
            x: t,
            y: totalEnergy,
            type: 'scatter',
            mode: 'lines',
            name: 'Полная механическая энергия',
            line: { color: 'green' }
        }
    ];

    const layout = {
        title: 'Энергетические превращения',
        xaxis: { title: 'Время (с)' },
        yaxis: { title: 'Энергия (Дж)' },
        height: 600
    };

    Plotly.newPlot('energyGraph', data, layout);
}
