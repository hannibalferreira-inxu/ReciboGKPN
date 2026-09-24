import React, { forwardRef } from 'react';
import { ReceiptData } from '../types/receipt';
import { GKPNLogo, GlobalYouthLogo } from './ReceiptLogos';
import { formatarMoedaBRL } from '../utils/numberToWordsPtBr';

interface ReceiptDocumentProps {
  data: ReceiptData;
  scale?: number;
}

export const ReceiptDocument = forwardRef<HTMLDivElement, ReceiptDocumentProps>(
  ({ data }, ref) => {
    const valorFormatado = formatarMoedaBRL(data.valor);
    const dataCompleta = data.cidade
      ? `${data.cidade}, ${data.dataTextoFormatada}`
      : data.dataTextoFormatada;

    return (
      <div
        ref={ref}
        id="receipt-print-area"
        className="w-full max-w-[850px] mx-auto bg-white text-black p-8 sm:p-10 shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-6 print:m-0 print:w-full print:max-w-none"
        style={{
          fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* CABEÇALHO COM LOGOTIPOS IDÊNTICOS AO MODELO */}
        <div className="flex items-center justify-between gap-6 pb-6 px-1">
          {/* Logo 1: Global Youth Movement */}
          <div className="flex-1 flex items-center justify-start">
            {data.logoEsquerdaUrl ? (
              <img
                src={data.logoEsquerdaUrl}
                alt="Global Youth Movement"
                className="max-h-16 w-auto object-contain"
              />
            ) : (
              <GlobalYouthLogo className="h-14 sm:h-16" />
            )}
          </div>

          {/* Logo 2: Global Kingdom Partnerships Network */}
          <div className="flex-1 flex items-center justify-end">
            {data.logoDireitaUrl ? (
              <img
                src={data.logoDireitaUrl}
                alt="Global Kingdom Partnerships Network"
                className="max-h-16 w-auto object-contain"
              />
            ) : (
              <GKPNLogo className="h-14 sm:h-16" />
            )}
          </div>
        </div>

        {/* QUADRO DO RECIBO PRINCIPAL (Bordas pretas sólidas como na imagem) */}
        <div className="border-[2px] border-black bg-white flex flex-col justify-between min-h-[380px] sm:min-h-[420px]">
          {/* LINHA SUPERIOR DIVIDIDA: RECIBO Nº E VALOR */}
          <div className="grid grid-cols-12 border-b-[2px] border-black text-black">
            {/* Coluna Esquerda: Recibo Nº */}
            <div className="col-span-7 sm:col-span-7 px-4 sm:px-6 py-2.5 sm:py-3 border-r-[2px] border-black flex items-center justify-center sm:justify-start">
              <span className="text-lg sm:text-xl font-bold tracking-tight">
                Recibo Nº {data.numeroRecibo || '_________'}
              </span>
            </div>

            {/* Coluna Direita: Valor */}
            <div className="col-span-5 sm:col-span-5 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center sm:justify-start">
              <span className="text-lg sm:text-xl font-bold tracking-tight">
                Valor {valorFormatado || 'R$ 0,00'}
              </span>
            </div>
          </div>

          {/* CORPO DO RECIBO COM AS 3 LINHAS FORMAIS */}
          <div className="p-6 sm:p-8 space-y-6 sm:space-y-7 text-base sm:text-[17px] leading-relaxed">
            {/* Linha 1: Recebemos de Igreja */}
            <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
              <span className="font-semibold text-black whitespace-nowrap">
                Recebemos de Igreja
              </span>
              {data.estiloSublinhado ? (
                <span className="font-semibold border-b border-black px-2 pb-0.5 inline-block min-w-[260px] flex-1 text-black break-words">
                  {data.igrejaCnpj || '______________________________________'}
                </span>
              ) : (
                <span className="font-semibold text-black flex-1 px-1 break-words">
                  {data.igrejaCnpj || '[nome e cnpj]'}
                </span>
              )}
              <span className="text-black font-semibold">,</span>
            </div>

            {/* Linha 2: a quantia de [valor por extenso] */}
            <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
              <span className="font-semibold text-black whitespace-nowrap">
                a quantia de
              </span>
              {data.estiloSublinhado ? (
                <span className="font-semibold border-b border-black px-2 pb-0.5 inline-block min-w-[260px] flex-1 text-black italic break-words">
                  {data.valorExtenso
                    ? `(${data.valorExtenso})`
                    : '____________________________________________________________'}
                </span>
              ) : (
                <span className="font-semibold text-black italic flex-1 px-1 break-words">
                  {data.valorExtenso ? `(${data.valorExtenso})` : '[valor por extenso]'}
                </span>
              )}
            </div>

            {/* Linha 3: referente a inscrição no evento */}
            <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
              <span className="font-semibold text-black whitespace-nowrap">
                referente a inscrição no evento:
              </span>
              {data.estiloSublinhado ? (
                <span className="font-semibold border-b border-black px-2 pb-0.5 inline-block min-w-[220px] flex-1 text-black break-words">
                  {data.nomeEvento || '______________________________'}
                </span>
              ) : (
                <span className="font-semibold text-black flex-1 px-1 break-words">
                  {data.nomeEvento || '[evento]'}
                </span>
              )}
            </div>
          </div>

          {/* RODAPÉ DO RECIBO (Assinatura na esquerda, Data na direita) */}
          <div className="p-6 sm:p-8 pt-4 sm:pt-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            {/* Assinatura do Coordenador */}
            <div className="flex flex-col">
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-black">
                {data.nomeSignatario || 'Elias Dantas'}
              </div>
              <div className="text-sm sm:text-base font-normal text-black">
                {data.cargoSignatario || 'Coordenador Internacional'}
              </div>
            </div>

            {/* Data alinhada à direita */}
            <div className="w-full sm:w-auto text-left sm:text-right">
              <div className="text-sm sm:text-base font-medium text-black">
                {dataCompleta ? `[${dataCompleta}]` : `[${data.dataTextoFormatada}]`}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ReceiptDocument.displayName = 'ReceiptDocument';
