/**
 * Converte um valor numérico monetário (BRL) para sua representação por extenso em Português do Brasil.
 * Exemplo: 1500 -> "um mil e quinhentos reais"
 * Exemplo: 2540.35 -> "dois mil quinhentos e quarenta reais e trinta e cinco centavos"
 */

const UNIDADES = [
  '',
  'um',
  'dois',
  'três',
  'quatro',
  'cinco',
  'seis',
  'sete',
  'oito',
  'nove',
  'dez',
  'onze',
  'doze',
  'treze',
  'quatorze',
  'quinze',
  'dezesseis',
  'dezessete',
  'dezoito',
  'dezenove',
];

const DEZENAS = [
  '',
  '',
  'vinte',
  'trinta',
  'quarenta',
  'cinquenta',
  'sessenta',
  'setenta',
  'oitenta',
  'noventa',
];

const CENTENAS = [
  '',
  'cento',
  'duzentos',
  'trezentos',
  'quatrocentos',
  'quinhentos',
  'seiscentos',
  'setecentos',
  'oitocentos',
  'novecentos',
];

function converterGrupoCentenas(n: number): string {
  if (n === 0) return '';
  if (n === 100) return 'cem';

  const partes: string[] = [];
  const c = Math.floor(n / 100);
  const resto = n % 100;

  if (c > 0) {
    partes.push(CENTENAS[c]);
  }

  if (resto > 0) {
    if (resto < 20) {
      partes.push(UNIDADES[resto]);
    } else {
      const d = Math.floor(resto / 10);
      const u = resto % 10;
      partes.push(DEZENAS[d]);
      if (u > 0) {
        partes.push(UNIDADES[u]);
      }
    }
  }

  return partes.join(' e ');
}

export function valorPorExtenso(valor: number): string {
  if (isNaN(valor) || valor === null || valor === undefined) {
    return '';
  }

  const valorAbsoluto = Math.abs(valor);
  const inteiro = Math.floor(valorAbsoluto);
  const centavos = Math.round((valorAbsoluto - inteiro) * 100);

  if (inteiro === 0 && centavos === 0) {
    return 'zero reais';
  }

  const partesExtenso: string[] = [];

  if (inteiro > 0) {
    const bilhoes = Math.floor(inteiro / 1_000_000_000);
    const milhoes = Math.floor((inteiro % 1_000_000_000) / 1_000_000);
    const milhares = Math.floor((inteiro % 1_000_000) / 1_000);
    const unidades = inteiro % 1_000;

    const grupos: { valor: number; singular: string; plural: string }[] = [
      { valor: bilhoes, singular: 'bilhão', plural: 'bilhões' },
      { valor: milhoes, singular: 'milhão', plural: 'milhões' },
      { valor: milhares, singular: 'mil', plural: 'mil' },
      { valor: unidades, singular: '', plural: '' },
    ];

    const extensoGrupos: string[] = [];

    for (let i = 0; i < grupos.length; i++) {
      const { valor: grupoValor, singular, plural } = grupos[i];
      if (grupoValor > 0) {
        let textoGrupo = '';
        if (i === 2 && grupoValor === 1) {
          // Em português tradicional para recibos, usa-se 'um mil' ou 'mil'
          textoGrupo = 'um mil';
        } else {
          textoGrupo = converterGrupoCentenas(grupoValor);
        }

        if (singular && plural) {
          const sufixo = grupoValor === 1 ? singular : plural;
          extensoGrupos.push(`${textoGrupo} ${sufixo}`);
        } else {
          extensoGrupos.push(textoGrupo);
        }
      }
    }

    let textoInteiro = '';
    if (extensoGrupos.length === 1) {
      textoInteiro = extensoGrupos[0];
    } else if (extensoGrupos.length > 1) {
      // Regra de conexão 'e' para português
      const ultimo = extensoGrupos.pop()!;
      // Se o último grupo for menor que 100 ou centena redonda, junta com 'e'
      textoInteiro = `${extensoGrupos.join(' ')} e ${ultimo}`;
    }

    const moeda = inteiro === 1 ? 'real' : 'reais';

    // Regra gramatical: se terminar em milhão/bilhão sem resto de milhares ou unidades, adiciona 'de reais'
    if ((milhoes > 0 || bilhoes > 0) && milhares === 0 && unidades === 0) {
      partesExtenso.push(`${textoInteiro} de ${moeda}`);
    } else {
      partesExtenso.push(`${textoInteiro} ${moeda}`);
    }
  }

  if (centavos > 0) {
    const textoCentavos = converterGrupoCentenas(centavos);
    const moedaCentavos = centavos === 1 ? 'centavo' : 'centavos';
    partesExtenso.push(`${textoCentavos} ${moedaCentavos}`);
  }

  return partesExtenso.join(' e ');
}

export function formatarMoedaBRL(valor: number): string {
  if (isNaN(valor)) return 'R$ 0,00';
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatarDataPorExtenso(dataStr?: string): string {
  const data = dataStr ? new Date(dataStr + 'T12:00:00') : new Date();
  
  const dia = data.getDate();
  const meses = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];
  const mes = meses[data.getMonth()];
  const ano = data.getFullYear();

  return `${dia} de ${mes} de ${ano}`;
}
