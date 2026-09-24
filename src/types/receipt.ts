export interface ReceiptData {
  numeroRecibo: string;
  valor: number;
  valorExtenso: string;
  igrejaCnpj: string;
  nomeEvento: string;
  dataEmissao: string; // YYYY-MM-DD
  dataTextoFormatada: string; // ex: "24 de setembro de 2026"
  cidade: string; // ex: "" ou "São Paulo"
  nomeSignatario: string; // default "Elias Dantas"
  cargoSignatario: string; // default "Coordenador Internacional"
  estiloSublinhado: boolean;
  logoEsquerdaUrl?: string;
  logoDireitaUrl?: string;
}

export const INITIAL_RECEIPT_DATA: ReceiptData = {
  numeroRecibo: '2026048',
  valor: 1500,
  valorExtenso: 'um mil e quinhentos reais',
  igrejaCnpj: 'Primeira Igreja Batista - CNPJ 12.345.678/0001-90',
  nomeEvento: 'Conferência Global Youth 2026',
  dataEmissao: new Date().toISOString().split('T')[0],
  dataTextoFormatada: '', // preenchido dinamicamente
  cidade: '',
  nomeSignatario: 'Elias Dantas',
  cargoSignatario: 'Coordenador Internacional',
  estiloSublinhado: true,
};
