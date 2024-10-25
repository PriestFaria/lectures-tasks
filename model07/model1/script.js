const g = 9.81;

function projectileMotion(v0, angle, height, k) {
    const dt = 0.01; 
    const theta = angle * Math.PI / 180;
    let vx = v0 * Math.cos(theta);
    let vy = v0 * Math.sin(theta);

    let x = 0, y = height, t = 0;
    const positions = { x: [], y: [], time: [], speed: [] };

   
    while (y >= 0) {
        positions.x.push(x); 
        positions.y.push(y); 
        positions.time.push(t); 
        positions.speed.push(Math.sqrt(vx * vx + vy * vy)); 

        
        const v = Math.sqrt(vx * vx + vy * vy);
        const ax = -k * v * vx; 
        const ay = -g - k * v * vy; 


        x += vx * dt;
        y += vy * dt;


        vx += ax * dt;
        vy += ay * dt;

        t += dt; 
    }
    return positions; 
}

function updateSimulation() {

    const v0 = parseFloat(document.getElementById('initialSpeed').value);
    const angle = parseFloat(document.getElementById('launchAngle').value);
    const height = parseFloat(document.getElementById('initialHeight').value);
    const k = parseFloat(document.getElementById('airResistance').value);


    if (isNaN(v0) || isNaN(angle) || isNaN(height) || isNaN(k)) {
        alert("Пожалуйста, введите корректные значения.");
        return;
    }


    const data = projectileMotion(v0, angle, height, k);


    Plotly.newPlot("trajectory", [{
        x: data.x,
        y: data.y,
        mode: 'lines',
        name: 'Траектория',
        line: { color: 'blue' }
    }], { title: 'Траектория движения', xaxis: { title: 'Расстояние (м)' }, yaxis: { title: 'Высота (м)' } });

    Plotly.newPlot("velocity-time", [{
        x: data.time,
        y: data.speed,
        mode: 'lines',
        name: 'Скорость',
        line: { color: 'red' }
    }], { title: 'Скорость vs Время', xaxis: { title: 'Время (с)' }, yaxis: { title: 'Скорость (м/с)' } });

    Plotly.newPlot("x-time", [{
        x: data.time,
        y: data.x,
        mode: 'lines',
        name: 'Координата X',
        line: { color: 'green' }
    }], { title: 'Координата X vs Время', xaxis: { title: 'Время (с)' }, yaxis: { title: 'X (м)' } });

    Plotly.newPlot("y-time", [{
        x: data.time,
        y: data.y,
        mode: 'lines',
        name: 'Координата Y',
        line: { color: 'purple' }
    }], { title: 'Координата Y vs Время', xaxis: { title: 'Время (с)' }, yaxis: { title: 'Y (м)' } });
}


window.onload = updateSimulation;
