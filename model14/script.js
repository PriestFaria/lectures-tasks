// Функция вычисления выходных величин
function computeRefraction(epsilon1, epsilon2, E1, theta1Deg) {
  // Переводим угол в радианы
  const theta1 = (Math.PI / 180) * theta1Deg;

  // Угол преломления из соотношения tan(theta2) = (eps2 / eps1) * tan(theta1)
  const tanTheta2 = (epsilon2 / epsilon1) * Math.tan(theta1);
  const theta2 = Math.atan(tanTheta2);

  // Через тангенциальную компоненту E_1: E2 = (E1 sin(theta1)) / sin(theta2)
  let E2 = 0;
  const sinTheta2 = Math.sin(theta2);
  if (Math.abs(sinTheta2) > 1e-12) {
    E2 = (E1 * Math.sin(theta1)) / sinTheta2;
  }

  return {
    theta1, // рад
    theta2, // рад
    E2,
  };
}

function plotRefraction(epsilon1, epsilon2, E1, theta1Deg) {
  // 1) Считаем результат
  const { theta1, theta2, E2 } = computeRefraction(
    epsilon1,
    epsilon2,
    E1,
    theta1Deg
  );

  // 2) Координаты векторов
  //    Граница - y=0,
  //    Среда 1 - y < 0, среда 2 - y > 0
  //    Угол theta1/theta2 отсчитывается от OY (нормали к границе).
  const x1 = -E1 * Math.sin(theta1);
  const y1 = -E1 * Math.cos(theta1);
  const x2 = E2 * Math.sin(theta2);
  const y2 = E2 * Math.cos(theta2);

  // 3) Формируем данные для Plotly
  const traceE1 = {
    x: [0, x1],
    y: [0, y1],
    mode: "lines+markers",
    name: "Вектор E₁",
    line: { color: "blue", width: 3 },
    marker: { size: 5, color: "blue" },
  };

  const traceE2 = {
    x: [0, x2],
    y: [0, y2],
    mode: "lines+markers",
    name: "Вектор E₂",
    line: { color: "red", width: 3 },
    marker: { size: 5, color: "red" },
  };

  // Линия границы
  const traceBoundary = {
    x: [-2, 2],
    y: [0, 0],
    mode: "lines",
    name: "Граница",
    line: { color: "black", width: 2, dash: "dot" },
  };

  const maxX = Math.max(Math.abs(x1), Math.abs(x2), 2);
  const maxY = Math.max(Math.abs(y1), Math.abs(y2), 2);

  const layout = {
    title: "Преломление E на границе",
    xaxis: {
      range: [-1.2 * maxX, 1.2 * maxX],
      zeroline: true,
      title: "x",
    },
    yaxis: {
      range: [-1.2 * maxY, 1.2 * maxY],
      zeroline: true,
      title: "y",
      scaleanchor: "x",
      scaleratio: 1,
    },
    legend: { x: 0, y: 1 },
    showlegend: true,
  };

  const data = [traceBoundary, traceE1, traceE2];
  Plotly.newPlot("plot", data, layout);
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("updatePlot");

  // При загрузке страницы сразу строим график
  plotRefraction(
    parseFloat(document.getElementById("epsilon1").value),
    parseFloat(document.getElementById("epsilon2").value),
    parseFloat(document.getElementById("E1").value),
    parseFloat(document.getElementById("theta1").value)
  );

  // При нажатии кнопки обновляем
  btn.addEventListener("click", () => {
    const epsilon1 = parseFloat(document.getElementById("epsilon1").value);
    const epsilon2 = parseFloat(document.getElementById("epsilon2").value);
    const E1 = parseFloat(document.getElementById("E1").value);
    const theta1 = parseFloat(document.getElementById("theta1").value);

    plotRefraction(epsilon1, epsilon2, E1, theta1);
  });
});
