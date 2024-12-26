function calculateCapacitor() {
  // Получаем значения из формы
  let voltage = parseFloat(document.getElementById("voltage").value); // Напряжение (В)
  let distance = parseFloat(document.getElementById("distance").value); // Расстояние между пластинами (м)
  let area = parseFloat(document.getElementById("area").value); // Площадь пластин (м²)
  let dielectric = parseFloat(document.getElementById("dielectric").value); // Относительная проницаемость
  let connection = document.getElementById("connection").value; // Подключен ли к источнику

  // Электрическая постоянная (ε0)
  const epsilon0 = 8.85e-12; // Фарады на метр (Ф/м)

  // Расчет ёмкости (C)
  let capacitance = epsilon0 * dielectric * (area / distance);

  // Расчет напряженности поля (E)
  let electricField = voltage / distance;

  // Если конденсатор подключен к источнику питания
  let charge;
  if (connection === "connected") {
    charge = capacitance * voltage; // Заряд на пластинах, если подключен
  } else {
    charge = capacitance * voltage; // Заряд остается неизменным, если отключен
  }

  // Формирование результата
  let result = `
        Напряженность поля (E): ${electricField.toFixed(2)} В/м<br>
        Ёмкость конденсатора (C): ${capacitance.toFixed(12)} Ф<br>
        Заряд на пластинах (Q): ${charge.toFixed(12)} Кл<br>
    `;

  document.getElementById("result").innerHTML = result;
}
