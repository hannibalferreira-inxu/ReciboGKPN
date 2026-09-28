import React, { useRef } from 'react';
import { Image, Upload, Link2, Trash2, CheckCircle2 } from 'lucide-react';

interface LogosManagerProps {
  logoEsquerdaUrl?: string;
  logoDireitaUrl?: string;
  onAtualizarLogoEsquerda: (url?: string) => void;
  onAtualizarLogoDireita: (url?: string) => void;
}

export const LogosManager: React.FC<LogosManagerProps> = ({
  logoEsquerdaUrl,
  logoDireitaUrl,
  onAtualizarLogoEsquerda,
  onAtualizarLogoDireita,
}) => {
  const fileInputEsquerdaRef = useRef<HTMLInputElement>(null);
  const fileInputDireitaRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Image className="w-4 h-4 text-orange-600" />
          <h3 className="font-bold text-slate-800 text-sm">
            Logotipos Oficiais do Recibo (GYM e GKPN)
          </h3>
        </div>
        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Salvo automaticamente
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Para garantir fidelidade total sem nenhuma recriação, insira o{' '}
        <strong>link direto da imagem</strong> ou clique em{' '}
        <strong>enviar arquivo</strong> para selecionar os logos originais do seu computador.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LOGO ESQUERDO: GLOBAL YOUTH MOVEMENT (GYM) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                1. Logo GYM (Global Youth)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Lado Esquerdo
              </span>
            </div>

            {/* Pré-visualização da imagem */}
            <div className="h-16 w-full bg-white border border-slate-200 rounded-lg flex items-center justify-center p-2 mb-3 overflow-hidden">
              {logoEsquerdaUrl ? (
                <img
                  src={logoEsquerdaUrl}
                  alt="Logo GYM"
                  className="max-h-12 w-auto object-contain"
                />
              ) : (
                <span className="text-slate-400 text-xs italic">
                  Nenhum logo carregado ainda
                </span>
              )}
            </div>

            {/* Campo de Link / URL */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                <Link2 className="w-3 h-3 text-orange-500" />
                <span>Link da Imagem (URL):</span>
              </label>
              <input
                type="url"
                placeholder="Ex: https://i.imgur.com/exemplo.png"
                value={logoEsquerdaUrl?.startsWith('data:') ? '' : (logoEsquerdaUrl || '')}
                onChange={(e) => onAtualizarLogoEsquerda(e.target.value.trim() || undefined)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono text-slate-700"
              />
            </div>
          </div>

          {/* Botões de Ação do Logo Esquerdo */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-200/80">
            <input
              ref={fileInputEsquerdaRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, (url) => onAtualizarLogoEsquerda(url))}
            />
            <button
              type="button"
              onClick={() => fileInputEsquerdaRef.current?.click()}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-orange-500" />
              <span>Enviar Arquivo</span>
            </button>

            {logoEsquerdaUrl && (
              <button
                type="button"
                onClick={() => onAtualizarLogoEsquerda(undefined)}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Remover logotipo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* LOGO DIREITO: GLOBAL KINGDOM PARTNERSHIPS NETWORK (GKPN) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                2. Logo GKPN (Global Kingdom)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Lado Direito
              </span>
            </div>

            {/* Pré-visualização da imagem */}
            <div className="h-16 w-full bg-white border border-slate-200 rounded-lg flex items-center justify-center p-2 mb-3 overflow-hidden">
              {logoDireitaUrl ? (
                <img
                  src={logoDireitaUrl}
                  alt="Logo GKPN"
                  className="max-h-12 w-auto object-contain"
                />
              ) : (
                <span className="text-slate-400 text-xs italic">
                  Nenhum logo carregado ainda
                </span>
              )}
            </div>

            {/* Campo de Link / URL */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                <Link2 className="w-3 h-3 text-orange-500" />
                <span>Link da Imagem (URL):</span>
              </label>
              <input
                type="url"
                placeholder="Ex: https://i.imgur.com/exemplo.png"
                value={logoDireitaUrl?.startsWith('data:') ? '' : (logoDireitaUrl || '')}
                onChange={(e) => onAtualizarLogoDireita(e.target.value.trim() || undefined)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono text-slate-700"
              />
            </div>
          </div>

          {/* Botões de Ação do Logo Direito */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-200/80">
            <input
              ref={fileInputDireitaRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, (url) => onAtualizarLogoDireita(url))}
            />
            <button
              type="button"
              onClick={() => fileInputDireitaRef.current?.click()}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-orange-500" />
              <span>Enviar Arquivo</span>
            </button>

            {logoDireitaUrl && (
              <button
                type="button"
                onClick={() => onAtualizarLogoDireita(undefined)}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Remover logotipo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
