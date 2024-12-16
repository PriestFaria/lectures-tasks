function calculatePotentialAndField(charges, gridSize = 50) {
  const grid = Array.from(
    { length: gridSize },
    (_, i) => (i / (gridSize - 1)) * 10 - 5
  ); // Сетка от -5 до 5
  const potential = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(0));
  const Ex = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(0));
  const Ey = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(0));

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = grid[j];
      const y = grid[i];
      charges.forEach(([cx, cy, q]) => {
        const dx = x - cx;
        const dy = y - cy;
        const r2 = dx * dx + dy * dy;
        const r = Math.sqrt(r2);

        if (r > 0.01) {
          // Убираем сингулярности
          potential[i][j] += q / r;
          Ex[i][j] += (q * dx) / (r * r2);
          Ey[i][j] += (q * dy) / (r * r2);
        }
      });
    }
  }
  return { grid, potential, Ex, Ey };
}

function calculateDipoleForceAndTorque(Ex, Ey, px, py, dipoleMoment) {
  const Fx = dipoleMoment * Ex[px][py];
  const Fy = dipoleMoment * Ey[px][py];
  const torque = dipoleMoment * (Ey[px][py] - Ex[px][py]); // Упрощенная модель
  return { Fx, Fy, torque };
}

function plotFieldWithDipole() {
  const chargesInput = document.getElementById("charges").value;
  const charges = chargesInput
    .split(";")
    .map((ch) => ch.split(",").map(Number));

  const dipolePositionInput = document
    .getElementById("dipolePosition")
    .value.split(",")
    .map(Number);
  const dipoleMomentInput = document
    .getElementById("dipoleMoment")
    .value.split(",")
    .map(Number);
  const [dipoleX, dipoleY] = dipolePositionInput;
  const [dipoleMagnitude, dipoleAngle] = dipoleMomentInput;

  const { grid, potential, Ex, Ey } = calculatePotentialAndField(charges);
  const dipolePx = Math.round(((dipoleX + 5) / 10) * (grid.length - 1));
  const dipolePy = Math.round(((dipoleY + 5) / 10) * (grid.length - 1));

  const { Fx, Fy, torque } = calculateDipoleForceAndTorque(
    Ex,
    Ey,
    dipolePx,
    dipolePy,
    dipoleMagnitude
  );

  // Контурный график потенциала
  const potentialData = {
    x: grid,
    y: grid,
    z: potential,
    type: "contour",
    colorscale: "Electric",
    contours: { coloring: "heatmap" },
    name: "Потенциал",
  };

  // Векторное поле линий напряженности
  const vectorField = {
    type: "scatter",
    mode: "lines+markers",
    x: [],
    y: [],
    line: { color: "black", width: 1 },
    marker: { size: 1 },
    name: "Линии напряженности",
  };

  const step = 4; // Шаг для упрощения векторного поля
  for (let i = 0; i < grid.length; i += step) {
    for (let j = 0; j < grid.length; j += step) {
      const scale = 0.3; // Масштаб для стрелок
      vectorField.x.push(grid[j], grid[j] + Ex[i][j] * scale, null); // null для разрыва линий
      vectorField.y.push(grid[i], grid[i] + Ey[i][j] * scale, null);
    }
  }

  // Диполь
  const dipoleData = {
    type: "scatter",
    mode: "markers+text",
    x: [dipoleX],
    y: [dipoleY],
    marker: { size: 10, color: "red" },
    text: [`F: (${Fx.toFixed(2)}, ${Fy.toFixed(2)}), T: ${torque.toFixed(2)}`],
    textposition: "top center",
    name: "Диполь",
  };

  const layout = {
    title: "Электростатическое поле с диполем",
    xaxis: { title: "X", range: [-5, 5] },
    yaxis: { title: "Y", range: [-5, 5] },
    height: 600,
  };

  Plotly.newPlot(
    "fieldGraph",
    [potentialData, vectorField, dipoleData],
    layout
  );
}
