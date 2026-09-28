import React from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  CheckCircle2,
  FileText,
  Share2,
} from 'lucide-react';
import { ReceiptData } from '../types/receipt';
import { formatarMoedaBRL } from '../utils/numberToWordsPtBr';
import { ReceiptDocument } from './ReceiptDocument';

interface ReceiptViewerPageProps {
  data: ReceiptData;
  receiptRef: React.RefObject<HTMLDivElement | null>;
  onVoltar: () => void;
  onImprimir: () => void;
  onBaixarImagem: () => void;
  isDownloadingImage?: boolean;
}

export const ReceiptViewerPage: React.FC<ReceiptViewerPageProps> = ({
  data,
  receiptRef,
  onVoltar,
  onImprimir,
  onBaixarImagem,
  isDownloadingImage = false,
}) => {
  const [copiado, setCopiado] = React.useState(false);

  const handleCopiarResumo = () => {
    const texto = `RECIBO Nº ${data.numeroRecibo || '---'}
Valor: ${formatarMoedaBRL(data.valor)}
Recebemos de: ${data.igrejaCnpj || '---'}
Referente a: ${data.nomeEvento || '---'}
Data: ${data.dataTextoFormatada}
Signatário: ${data.nomeSignatario} (${data.cargoSignatario})`;

    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* BARRA SUPERIOR DE AÇÕES (Oculta na impressão) */}
      <header className="no-print bg-slate-800/95 border-b border-slate-700/80 sticky top-0 z-40 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
          {/* Voltar e Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onVoltar}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-orange-400" />
              <span>Voltar ao Formulário</span>
            </button>

            <div className="hidden sm:block h-5 w-px bg-slate-700" />

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Recibo Pronto</span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[140px] sm:max-w-xs">
                Nº {data.numeroRecibo || 'Sem número'}
              </span>
            </div>
          </div>

          {/* Botões Principais: Imprimir e Baixar Imagem */}
          <div className="flex items-center gap-2">
            <button
              onClick={onImprimir}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
              title="Envia comando de impressão para o navegador"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={onBaixarImagem}
              disabled={isDownloadingImage}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-70"
              title="Baixar imagem PNG de alta resolução do arquivo visualizado"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>{isDownloadingImage ? 'Baixando Imagem...' : 'Baixar Imagem'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ÁREA PRINCIPAL: VISUALIZADOR REAL DO RECIBO */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-4">
        {/* Faixa com dados resumidos e dica de impressão */}
        <div className="no-print bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="leading-relaxed">
              <strong>Igreja:</strong> {data.igrejaCnpj || 'Não informada'} |{' '}
              <strong>Valor:</strong> {formatarMoedaBRL(data.valor)} |{' '}
              <strong>Data:</strong> {data.dataTextoFormatada}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-[11px] hidden lg:inline">
              Dica: Na janela de impressão você pode escolher <strong>"Salvar como PDF"</strong>.
            </span>
            <button
              onClick={handleCopiarResumo}
              className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-orange-400" />
              <span>{copiado ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>
        </div>

        {/* CONTAINER DO RECIBO VISUALIZADO (100% REAL NO DOM) */}
        <div className="flex-1 w-full flex flex-col items-center justify-start bg-slate-950/70 p-4 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl overflow-x-auto">
          <div className="w-full flex justify-center">
            <ReceiptDocument ref={receiptRef} data={data} />
          </div>

          {/* Barra inferior de atalhos rápidos */}
          <div className="no-print mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onImprimir}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Recibo</span>
            </button>

            <button
              onClick={onBaixarImagem}
              disabled={isDownloadingImage}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm shadow-md transition-colors cursor-pointer disabled:opacity-70"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>{isDownloadingImage ? 'Processando Imagem...' : 'Baixar Imagem (PNG)'}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
