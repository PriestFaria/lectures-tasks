// Функция для расчета тока в схеме
function calculateCurrent() {
  // Получаем данные от пользователя
  let numResistors = document.getElementById("numResistors").value;
  let numSources = document.getElementById("sources").value;
  let circuitConfig = document.getElementById("circuit").value;

  // Получаем параметры для каждого резистора и источника
  let resistances = [];
  let voltages = [];

  for (let i = 0; i < numResistors; i++) {
    let resistance = parseFloat(
      prompt("Введите сопротивление R" + (i + 1) + " (Ом):")
    );
    resistances.push(resistance);
  }

  for (let i = 0; i < numSources; i++) {
    let voltage = parseFloat(
      prompt("Введите ЭДС источника E" + (i + 1) + " (В):")
    );
    voltages.push(voltage);
  }

  // Простая модель: используем закон Ома для расчета тока
  // Примерная схема: ток в схеме с источниками и резисторами
  // Предположим, что все элементы соединены последовательно

  let totalResistance = resistances.reduce((acc, val) => acc + val, 0); // Суммируем сопротивления
  let totalVoltage = voltages.reduce((acc, val) => acc + val, 0); // Суммируем ЭДС

  let current = totalVoltage / totalResistance; // Закон Ома: I = V / R

  // Выводим результаты
  let result = `Ток в цепи: ${current.toFixed(2)} А<br>`;
  result += `Суммарное сопротивление: ${totalResistance.toFixed(2)} Ом<br>`;
  result += `Суммарная ЭДС: ${totalVoltage.toFixed(2)} В<br>`;
  result += `Конфигурация схемы: ${circuitConfig}`;

  document.getElementById("result").innerHTML = result;
}
