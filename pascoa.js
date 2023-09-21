const moment = require('moment-timezone');

function calcularDataPascoa(ano) {
  if (ano < 1583 || ano > 4099) {
    throw new Error("O cálculo da Páscoa é válido apenas para o período entre 1583 e 4099.");
  }

  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;

  return { dia, mes };
}

function getAnoAtualBrasilia() {
  const dataAtualBrasilia = moment.tz("America/Sao_Paulo");
  return dataAtualBrasilia.year();
}

const anoAtualBrasilia = getAnoAtualBrasilia();

const { dia, mes } = calcularDataPascoa(anoAtualBrasilia);

function calcularDiaDasMaes() {
  const dataAtualBrasilia = moment.tz("America/Sao_Paulo");
  const ano = dataAtualBrasilia.year();

  const dataMaio = moment.tz([ano, 4, 1], "America/Sao_Paulo"); // O mês começa do zero (0 = janeiro, 1 = fevereiro, ...), então maio é representado por 4
  const primeiroDomingo = dataMaio.day() === 0 ? 1 : 7 - dataMaio.day() + 1;
  const segundoDomingo = primeiroDomingo + 7;

  const dataDiaDasMaes = moment.tz([ano, 4, segundoDomingo], "America/Sao_Paulo");
  const dia = dataDiaDasMaes.date();
  const mes = dataDiaDasMaes.month() + 1; // Adicionando 1, pois o mês começa do zero

  return { dia, mes };
}

const { dia: diaDasMaes, mes: mesDasMaes } = calcularDiaDasMaes();

function calcularDiaDosPais() {
  const dataAtualBrasilia = moment.tz("America/Sao_Paulo");
  const ano = dataAtualBrasilia.year();

  const dataAgosto = moment.tz([ano, 7, 1], "America/Sao_Paulo"); // O mês começa do zero (0 = janeiro, 1 = fevereiro, ...), então agosto é representado por 7
  const primeiroDomingo = dataAgosto.day() === 0 ? 1 : 7 - dataAgosto.day() + 1;
  const segundoDomingo = primeiroDomingo + 7;

  const dataDiaDosPais = moment.tz([ano, 7, segundoDomingo], "America/Sao_Paulo");
  const dia = dataDiaDosPais.date();
  const mes = dataDiaDosPais.month() + 1; // Adicionando 1, pois o mês começa do zero

  return { dia, mes };
}

const { dia: diaDosPais, mes: mesDosPais } = calcularDiaDosPais();

module.exports = { calcularDataPascoa, getAnoAtualBrasilia, calcularDiaDasMaes, calcularDiaDosPais };
