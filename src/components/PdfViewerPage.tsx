import React from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  ExternalLink,
  CheckCircle2,
  FileText,
  Share2,
  RefreshCw,
} from 'lucide-react';
import { ReceiptData } from '../types/receipt';
import { formatarMoedaBRL } from '../utils/numberToWordsPtBr';

interface PdfViewerPageProps {
  pdfUrl: string;
  data: ReceiptData;
  onVoltar: () => void;
  onDownload: () => void;
  onImprimir: () => void;
}

export const PdfViewerPage: React.FC<PdfViewerPageProps> = ({
  pdfUrl,
  data,
  onVoltar,
  onDownload,
  onImprimir,
}) => {
  const [copiado, setCopiado] = React.useState(false);

  const handleCopiarLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* BARRA SUPERIOR DE NAVEGAÇÃO DA PÁGINA DO PDF */}
      <header className="no-print bg-slate-800/95 border-b border-slate-700/80 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Botão de retorno e informações do recibo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onVoltar}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-orange-400" />
              <span>Voltar ao Formulário</span>
            </button>

            <div className="hidden sm:block h-5 w-px bg-slate-700" />

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                PDF Gerado
              </span>
              <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                Recibo Nº {data.numeroRecibo || 'Sem número'}
              </span>
            </div>
          </div>

          {/* Botões de Ação na barra do PDF */}
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar PDF</span>
            </button>

            <button
              onClick={onImprimir}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-medium transition-colors"
              title="Abrir PDF em nova aba do navegador"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">Nova Aba</span>
            </a>
          </div>
        </div>
      </header>

      {/* ÁREA PRINCIPAL: VISUALIZADOR DA PÁGINA COM O PDF INCORPORADO */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-4">
        {/* Faixa informativa */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-400" />
            <span>
              <strong>Igreja:</strong> {data.igrejaCnpj || 'Não informada'} |{' '}
              <strong>Valor:</strong> {formatarMoedaBRL(data.valor)} |{' '}
              <strong>Data:</strong> {data.dataTextoFormatada}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden lg:inline">
              O PDF abaixo está pronto para visualização, impressão e download direto.
            </span>
            <button
              onClick={handleCopiarLink}
              className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiado ? 'Link Copiado!' : 'Copiar Link'}</span>
            </button>
          </div>
        </div>

        {/* CONTAINER DO IFRAME DO PDF */}
        <div className="flex-1 w-full min-h-[75vh] sm:min-h-[82vh] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative flex flex-col">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0`}
            title="Recibo em PDF - Global Youth & GKPN"
            className="w-full h-full flex-1 border-none min-h-[700px] sm:min-h-[800px]"
          />

          {/* Rodapé do visualizador para navegadores móveis com suporte limitado a iframe de PDF */}
          <div className="sm:hidden p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">PDF pronto para visualização</span>
            <a
              href={pdfUrl}
              download={`Recibo_${data.numeroRecibo || 'gkpn'}.pdf`}
              className="px-3 py-1 bg-orange-600 text-white rounded font-bold"
            >
              Baixar Arquivo
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
