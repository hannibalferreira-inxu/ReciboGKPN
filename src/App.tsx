import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  Calendar,
  Building2,
  DollarSign,
  FileCheck,
  RotateCcw,
  CheckCircle2,
  Copy,
  Share2,
  Eye,
  Sliders,
  History,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ReceiptData, INITIAL_RECEIPT_DATA } from './types/receipt';
import { ReceiptDocument } from './components/ReceiptDocument';
import {
  valorPorExtenso,
  formatarDataPorExtenso,
  formatarMoedaBRL,
} from './utils/numberToWordsPtBr';
import { gerarReciboPDF, baixarReciboImagem } from './utils/pdfGenerator';

interface HistoricoItem {
  id: string;
  dataSalva: string;
  dados: ReceiptData;
}

export default function App() {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [showConfigAvancada, setShowConfigAvancada] = useState(false);
  const [autoExtenso, setAutoExtenso] = useState(true);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);

  // Inicialização do estado com a data de hoje formatada em pt-BR
  const [receiptData, setReceiptData] = useState<ReceiptData>(() => {
    const hojeIso = new Date().toISOString().split('T')[0];
    const dataFormatada = formatarDataPorExtenso(hojeIso);
    return {
      ...INITIAL_RECEIPT_DATA,
      dataEmissao: hojeIso,
      dataTextoFormatada: dataFormatada,
      valorExtenso: valorPorExtenso(INITIAL_RECEIPT_DATA.valor),
    };
  });

  // Carregar histórico local
  useEffect(() => {
    try {
      const historicoStorage = localStorage.getItem('recibos_gkpn_historico');
      if (historicoStorage) {
        setHistorico(JSON.parse(historicoStorage));
      }
    } catch {
      // Ignora erro de storage
    }
  }, []);

  // Salvar no histórico quando gerar PDF
  const salvarNoHistorico = (dados: ReceiptData) => {
    try {
      const novoItem: HistoricoItem = {
        id: `${dados.numeroRecibo}-${Date.now()}`,
        dataSalva: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        dados: { ...dados },
      };
      const listaAtualizada = [novoItem, ...historico.filter((h) => h.dados.numeroRecibo !== dados.numeroRecibo)].slice(0, 10);
      setHistorico(listaAtualizada);
      localStorage.setItem('recibos_gkpn_historico', JSON.stringify(listaAtualizada));
    } catch {
      // Ignora erro
    }
  };

  const limparHistorico = () => {
    setHistorico([]);
    localStorage.removeItem('recibos_gkpn_historico');
  };

  // Manipulação de mudança de valor com atualização automática do extenso
  const handleValorChange = (novoValorNum: number) => {
    const valorValido = Math.max(0, novoValorNum);
    const novoExtenso = autoExtenso ? valorPorExtenso(valorValido) : receiptData.valorExtenso;
    setReceiptData((prev) => ({
      ...prev,
      valor: valorValido,
      valorExtenso: novoExtenso,
    }));
  };

  // Manipulação de mudança de data
  const handleDataChange = (dataIso: string) => {
    const textoFormatado = formatarDataPorExtenso(dataIso);
    setReceiptData((prev) => ({
      ...prev,
      dataEmissao: dataIso,
      dataTextoFormatada: textoFormatado,
    }));
  };

  // Gerar novo número sequencial de recibo baseado no ano corrente
  const handleGerarNovoNumero = () => {
    const anoAtual = new Date().getFullYear();
    const aleatorio = Math.floor(1000 + Math.random() * 9000);
    const novoNum = `${anoAtual}${aleatorio}`;
    setReceiptData((prev) => ({ ...prev, numeroRecibo: novoNum }));
  };

  // Ação de download do PDF
  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const nomeLimpo = (receiptData.igrejaCnpj || 'igreja')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 20);
      const nomeArquivo = `Recibo_${receiptData.numeroRecibo || 'sem_num'}_${nomeLimpo}.pdf`;
      await gerarReciboPDF(receiptRef.current, nomeArquivo);
      salvarNoHistorico(receiptData);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Ação de download como imagem
  const handleDownloadImagem = async () => {
    if (!receiptRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const nomeArquivo = `Recibo_${receiptData.numeroRecibo || 'recibo'}.png`;
      await baixarReciboImagem(receiptRef.current, nomeArquivo);
      salvarNoHistorico(receiptData);
    } catch (err) {
      console.error('Erro ao baixar imagem:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Ação de impressão nativa do navegador
  const handleImprimir = () => {
    salvarNoHistorico(receiptData);
    window.print();
  };

  // Copiar resumo do recibo para a área de transferência
  const handleCopiarTexto = () => {
    const texto = `RECIBO Nº ${receiptData.numeroRecibo}
VALOR: ${formatarMoedaBRL(receiptData.valor)} (${receiptData.valorExtenso})
RECEBEMOS DE: ${receiptData.igrejaCnpj}
REFERENTE A: ${receiptData.nomeEvento}
DATA: ${receiptData.dataTextoFormatada}
ASSINATURA: ${receiptData.nomeSignatario} - ${receiptData.cargoSignatario}`;

    navigator.clipboard.writeText(texto).then(() => {
      setCopiedAlert(true);
      setTimeout(() => setCopiedAlert(false), 2500);
    });
  };

  // Preencher com dados de exemplo
  const handleCarregarExemplo = () => {
    const hojeIso = new Date().toISOString().split('T')[0];
    setReceiptData({
      numeroRecibo: '2026048',
      valor: 2500,
      valorExtenso: valorPorExtenso(2500),
      igrejaCnpj: 'Comunidade da Graça - CNPJ 43.120.985/0001-22',
      nomeEvento: 'Encontro Nacional de Jovens e Líderes GKPN',
      dataEmissao: hojeIso,
      dataTextoFormatada: formatarDataPorExtenso(hojeIso),
      cidade: 'São Paulo',
      nomeSignatario: 'Elias Dantas',
      cargoSignatario: 'Coordenador Internacional',
      estiloSublinhado: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* BARRA SUPERIOR / HEADER (Oculta na impressão) */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-teal-500 flex items-center justify-center text-white shadow-sm">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Emissor de Recibos
              </h1>
              <p className="text-xs text-slate-500">
                Global Youth Movement & GKPN
              </p>
            </div>
          </div>

          {/* Botões do Topo */}
          <div className="flex items-center gap-2">
            {historico.length > 0 && (
              <button
                onClick={() => setShowHistoricoModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                title="Ver recibos gerados recentemente"
              >
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Recentes ({historico.length})</span>
              </button>
            )}

            <button
              onClick={handleCarregarExemplo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold border border-orange-200 transition-colors"
              title="Preenche o formulário com dados de demonstração"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Exemplo</span>
            </button>

            {/* Alternar abas no mobile */}
            <div className="flex lg:hidden rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'form'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dados
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'preview'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Visualizar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ÁREA DE TRABALHO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* COLUNA ESQUERDA: FORMULÁRIO DE ENTRADA (Oculta na impressão) */}
        <section
          className={`no-print lg:w-[420px] xl:w-[460px] shrink-0 ${
            activeTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Título do Card */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  Preenchimento do Recibo
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Preencha os campos para atualizar em tempo real o documento
                </p>
              </div>
              <button
                onClick={() => {
                  const hojeIso = new Date().toISOString().split('T')[0];
                  setReceiptData({
                    ...INITIAL_RECEIPT_DATA,
                    dataEmissao: hojeIso,
                    dataTextoFormatada: formatarDataPorExtenso(hojeIso),
                    valorExtenso: valorPorExtenso(INITIAL_RECEIPT_DATA.valor),
                  });
                }}
                className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 p-1"
                title="Redefinir formulário"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar</span>
              </button>
            </div>

            {/* Campos do Formulário */}
            <div className="p-5 space-y-4 text-sm">
              {/* Linha 1: Número do Recibo e Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Número do Recibo */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Nº do Recibo
                    </label>
                    <button
                      type="button"
                      onClick={handleGerarNovoNumero}
                      className="text-[11px] text-orange-600 hover:text-orange-800 font-medium cursor-pointer"
                      title="Gerar código aleatório"
                    >
                      Gerar Novo
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={receiptData.numeroRecibo}
                      onChange={(e) =>
                        setReceiptData({ ...receiptData, numeroRecibo: e.target.value })
                      }
                      placeholder="Ex: 2026048"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-sm"
                    />
                  </div>
                </div>

                {/* Data de Emissão */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Data do Recibo
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={receiptData.dataEmissao}
                      onChange={(e) => handleDataChange(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Linha 2: Valor R$ */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Valor Total (R$)
                </label>
                <div className="relative rounded-lg shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={receiptData.valor || ''}
                    onChange={(e) => handleValorChange(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-semibold text-slate-400">
                    BRL
                  </div>
                </div>
              </div>

              {/* Linha 3: Valor por Extenso */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    Valor por Extenso
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                      Automático
                    </span>
                  </label>
                  <label className="text-[11px] text-slate-500 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoExtenso}
                      onChange={(e) => {
                        setAutoExtenso(e.target.checked);
                        if (e.target.checked) {
                          setReceiptData((prev) => ({
                            ...prev,
                            valorExtenso: valorPorExtenso(prev.valor),
                          }));
                        }
                      }}
                      className="rounded text-orange-600 focus:ring-orange-500 w-3 h-3"
                    />
                    <span>Auto-converter</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  value={receiptData.valorExtenso}
                  onChange={(e) => {
                    setAutoExtenso(false);
                    setReceiptData({ ...receiptData, valorExtenso: e.target.value });
                  }}
                  placeholder="Ex: um mil e quinhentos reais"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white resize-none"
                />
              </div>

              {/* Linha 4: Nome da Igreja e CNPJ */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recebemos de (Igreja e CNPJ)
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4 text-orange-500" />
                  </div>
                  <textarea
                    rows={2}
                    value={receiptData.igrejaCnpj}
                    onChange={(e) =>
                      setReceiptData({ ...receiptData, igrejaCnpj: e.target.value })
                    }
                    placeholder="Ex: Igreja Batista da Paz - CNPJ 00.123.456/0001-78"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white resize-none"
                  />
                </div>
              </div>

              {/* Linha 5: Referente a inscrição no evento */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Referente a inscrição no evento
                </label>
                <input
                  type="text"
                  value={receiptData.nomeEvento}
                  onChange={(e) =>
                    setReceiptData({ ...receiptData, nomeEvento: e.target.value })
                  }
                  placeholder="Ex: Conferência Global Youth 2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>

              {/* Configurações Avançadas e Assinatura (Acordeão) */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowConfigAvancada(!showConfigAvancada)}
                  className="w-full flex items-center justify-between text-xs font-medium text-slate-600 hover:text-slate-900 py-1 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-slate-400" />
                    Mais opções (Assinatura, Cidade, Estilo)
                  </span>
                  {showConfigAvancada ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showConfigAvancada && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-3 border border-slate-200">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Cidade (Opcional, para anteceder a data)
                      </label>
                      <input
                        type="text"
                        value={receiptData.cidade}
                        onChange={(e) =>
                          setReceiptData({ ...receiptData, cidade: e.target.value })
                        }
                        placeholder="Ex: São Paulo"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Nome do Signatário
                        </label>
                        <input
                          type="text"
                          value={receiptData.nomeSignatario}
                          onChange={(e) =>
                            setReceiptData({ ...receiptData, nomeSignatario: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Cargo / Função
                        </label>
                        <input
                          type="text"
                          value={receiptData.cargoSignatario}
                          onChange={(e) =>
                            setReceiptData({ ...receiptData, cargoSignatario: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-xs text-slate-600">
                        Linhas sublinhadas nos campos
                      </span>
                      <input
                        type="checkbox"
                        checked={receiptData.estiloSublinhado}
                        onChange={(e) =>
                          setReceiptData({ ...receiptData, estiloSublinhado: e.target.checked })
                        }
                        className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                      />
                    </div>

                    {/* Personalização / Upload de Logotipos */}
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <span className="block text-xs font-semibold text-slate-700">
                        Logos do Cabeçalho (Padrão Oficial Carregado)
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <label className="block text-slate-600 mb-0.5">Logo Global Youth</label>
                          <label className="flex items-center justify-center p-2 bg-white border border-dashed border-slate-300 rounded hover:border-orange-500 cursor-pointer text-slate-600 text-[10px]">
                            <span>{receiptData.logoEsquerdaUrl ? 'Trocar Logo' : 'Enviar Imagem'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    setReceiptData((prev) => ({
                                      ...prev,
                                      logoEsquerdaUrl: reader.result as string,
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          {receiptData.logoEsquerdaUrl && (
                            <button
                              type="button"
                              onClick={() => setReceiptData((prev) => ({ ...prev, logoEsquerdaUrl: undefined }))}
                              className="text-[10px] text-red-600 hover:underline mt-0.5"
                            >
                              Restaurar padrão
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-slate-600 mb-0.5">Logo GKPN</label>
                          <label className="flex items-center justify-center p-2 bg-white border border-dashed border-slate-300 rounded hover:border-orange-500 cursor-pointer text-slate-600 text-[10px]">
                            <span>{receiptData.logoDireitaUrl ? 'Trocar Logo' : 'Enviar Imagem'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    setReceiptData((prev) => ({
                                      ...prev,
                                      logoDireitaUrl: reader.result as string,
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          {receiptData.logoDireitaUrl && (
                            <button
                              type="button"
                              onClick={() => setReceiptData((prev) => ({ ...prev, logoDireitaUrl: undefined }))}
                              className="text-[10px] text-red-600 hover:underline mt-0.5"
                            >
                              Restaurar padrão
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BOTÕES DE AÇÃO PRINCIPAIS */}
              <div className="pt-3 space-y-2.5">
                {/* Botão de Destaque: Gerar e Baixar PDF */}
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPdf}
                  className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isGeneratingPdf ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Gerando documento em PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Gerar e Baixar PDF</span>
                    </>
                  )}
                </button>

                {/* Linha com Imprimir e Opções Rápidas */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleImprimir}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Abre a tela de impressão do navegador ou Salvar como PDF"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir / Salvar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadImagem}
                    disabled={isGeneratingPdf}
                    className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Baixar imagem PNG para WhatsApp ou Email"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Baixar Imagem</span>
                  </button>
                </div>

                {/* Copiar Resumo */}
                <button
                  type="button"
                  onClick={handleCopiarTexto}
                  className="w-full py-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedAlert ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">
                        Dados copiados para a área de transferência!
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar dados resumidos em texto</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Dica para Google Sites */}
          <div className="mt-4 p-3.5 bg-blue-50/80 border border-blue-200/70 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <div className="mt-0.5 w-4 h-4 shrink-0 text-blue-600 font-bold">ℹ</div>
            <div>
              <p className="font-semibold">Pronto para Google Sites:</p>
              <p className="text-blue-800 mt-0.5">
                Esta página é 100% responsiva e pode ser incorporada diretamente
                no Google Sites via opção <em>Inserir &gt; Incorporar por URL</em>.
              </p>
            </div>
          </div>
        </section>

        {/* COLUNA DIREITA: PREVIEW DO RECIBO (Imprime diretamente) */}
        <section
          className={`flex-1 flex flex-col items-center justify-start ${
            activeTab === 'form' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Barra de Ações Superior do Preview */}
          <div className="no-print w-full max-w-[850px] mb-3 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-700">
                Visualização do Documento (Fidelidade 100%)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                className="lg:hidden px-3 py-1.5 bg-orange-600 text-white rounded-lg font-semibold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar PDF
              </button>
              <button
                onClick={handleImprimir}
                className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir
              </button>
            </div>
          </div>

          {/* DOCUMENTO DO RECIBO RENDERIZADO */}
          <div className="w-full flex justify-center overflow-x-auto pb-6">
            <ReceiptDocument ref={receiptRef} data={receiptData} />
          </div>
        </section>
      </main>

      {/* MODAL DE HISTÓRICO DE RECIBOS RECENTES */}
      {showHistoricoModal && (
        <div className="no-print fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-orange-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Recibos Recentes Gerados
                </h3>
              </div>
              <button
                onClick={() => setShowHistoricoModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-4 max-h-[360px] overflow-y-auto space-y-2">
              {historico.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">
                  Nenhum recibo no histórico ainda.
                </p>
              ) : (
                historico.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 hover:bg-orange-50/50 rounded-xl border border-slate-200/80 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 truncate">
                      <div className="font-bold text-slate-900 truncate">
                        Recibo Nº {item.dados.numeroRecibo} - {formatarMoedaBRL(item.dados.valor)}
                      </div>
                      <div className="text-slate-500 truncate mt-0.5">
                        {item.dados.igrejaCnpj || 'Sem identificação'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {item.dados.dataTextoFormatada}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setReceiptData(item.dados);
                        setShowHistoricoModal(false);
                      }}
                      className="px-2.5 py-1 bg-white border border-slate-300 hover:border-orange-500 text-slate-700 hover:text-orange-600 rounded-md font-semibold text-xs transition-colors shrink-0"
                    >
                      Carregar
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              {historico.length > 0 && (
                <button
                  onClick={limparHistorico}
                  className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Limpar lista
                </button>
              )}
              <button
                onClick={() => setShowHistoricoModal(false)}
                className="ml-auto px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
