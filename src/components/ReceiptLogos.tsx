import React from 'react';

/**
 * Logotipos ajustados com máxima fidelidade visual baseados nas imagens fornecidas:
 *
 * 1. Global Youth Movement:
 *    - Tipografia característica "Global", "youth" e "movement"
 *    - Globo oval aramado na cor laranja viva (#FF5900), com elipse externa horizontal,
 *      linha do equador, linha do meridiano central e arcos laterais que convergem nos polos.
 *
 * 2. Global Kingdom Partnerships Network:
 *    - Emblema circular com degradê em tons de verde-mar/turquesa (#7ec4b8 -> #3b7a70)
 *    - Ilustração interna de mãos entrelaçadas em trama de cooperação/parceria
 *    - Tipografia "GLOBAL KINGDOM" em fonte serifada clássica romana
 *    - Linha divisória horizontal em turquesa suave
 *    - "PARTNERSHIPS" em grafite escuro e "NETWORK" em tom ciano/turquesa
 */

export const GlobalYouthLogo: React.FC<{ className?: string }> = ({ className = 'h-14 sm:h-16' }) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Bloco de Texto */}
      <div className="flex flex-col justify-center leading-none">
        {/* Global */}
        <span
          className="text-[26px] sm:text-[28px] font-black tracking-[-0.03em] text-black"
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          Global
        </span>
        {/* youth com o 'y' característico */}
        <span
          className="text-[27px] sm:text-[29px] font-black tracking-[-0.04em] text-black -mt-1"
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          youth
        </span>
        {/* movement */}
        <span
          className="text-[10px] sm:text-[11px] font-semibold tracking-[0.08em] text-black uppercase -mt-0.5 pl-0.5"
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          movement
        </span>
      </div>

      {/* Globo Oval Aramado Laranja */}
      <svg
        viewBox="0 0 130 90"
        className="h-full w-auto max-h-[64px] shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Elipse Oval Externa */}
        <ellipse
          cx="65"
          cy="45"
          rx="58"
          ry="40"
          stroke="#FF5500"
          strokeWidth="6"
        />

        {/* Linha Horizontal do Equador */}
        <line
          x1="7"
          y1="45"
          x2="123"
          y2="45"
          stroke="#FF5500"
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        {/* Linha Vertical do Meridiano Central */}
        <line
          x1="65"
          y1="5"
          x2="65"
          y2="85"
          stroke="#FF5500"
          strokeWidth="5.5"
        />

        {/* Arco Meridiano Esquerdo */}
        <path
          d="M 65 5 C 38 18, 38 72, 65 85"
          stroke="#FF5500"
          strokeWidth="5.5"
          fill="none"
        />

        {/* Arco Meridiano Direito */}
        <path
          d="M 65 5 C 92 18, 92 72, 65 85"
          stroke="#FF5500"
          strokeWidth="5.5"
          fill="none"
        />
      </svg>
    </div>
  );
};

export const GKPNLogo: React.FC<{ className?: string }> = ({ className = 'h-14 sm:h-16' }) => {
  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* Emblema Circular Turquesa com Mãos Entrelaçadas */}
      <svg
        viewBox="0 0 100 100"
        className="w-14 h-14 sm:w-16 sm:h-16 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradiente sutil verde-azulado/turquesa fiel à imagem */}
          <linearGradient id="gkpn-hands-grad" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#7ec4b8" />
            <stop offset="45%" stopColor="#5ea79c" />
            <stop offset="80%" stopColor="#438d82" />
            <stop offset="100%" stopColor="#35756b" />
          </linearGradient>

          {/* Máscara circular para os braços/mãos */}
          <clipPath id="circle-clip">
            <circle cx="50" cy="50" r="47" />
          </clipPath>
        </defs>

        {/* Fundo do Círculo */}
        <circle cx="50" cy="50" r="47" fill="url(#gkpn-hands-grad)" />

        {/* Desenho das mãos entrelaçadas em padrão de cooperação */}
        <g clipPath="url(#circle-clip)" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Mão e Pulso Superior Esquerdo */}
          <path d="M 28 8 L 38 24 L 46 20 L 36 4 Z" fill="rgba(255,255,255,0.06)" />
          {/* Mão e Pulso Superior Direito */}
          <path d="M 72 8 L 62 24 L 54 20 L 64 4 Z" fill="rgba(255,255,255,0.06)" />

          {/* Trama central: 4 pulsos e mãos segurando os pulsos uns dos outros */}
          {/* Pulso descendo da esquerda */}
          <path d="M 22 34 L 40 46" />
          <path d="M 16 42 L 34 54" />
          {/* Dedos segurando o pulso adjacente */}
          <path d="M 37 44 C 42 46, 43 51, 40 55 C 37 57, 33 55, 34 50" />
          <line x1="39" y1="46" x2="35" y2="49" />
          <line x1="41" y1="48" x2="37" y2="52" />

          {/* Pulso descendo da direita */}
          <path d="M 78 34 L 60 46" />
          <path d="M 84 42 L 66 54" />
          {/* Dedos direita */}
          <path d="M 63 44 C 58 46, 57 51, 60 55 C 63 57, 67 55, 66 50" />
          <line x1="61" y1="46" x2="65" y2="49" />
          <line x1="59" y1="48" x2="63" y2="52" />

          {/* Mão subindo de baixo esquerda */}
          <path d="M 34 84 L 46 66" />
          <path d="M 42 90 L 54 72" />
          {/* Dedos inferiores */}
          <path d="M 44 63 C 46 58, 51 57, 55 60 C 57 63, 55 67, 50 66" />
          <line x1="46" y1="61" x2="49" y2="65" />
          <line x1="48" y1="59" x2="52" y2="63" />

          {/* Mão subindo de baixo direita */}
          <path d="M 66 84 L 54 66" />
          <path d="M 58 90 L 46 72" />

          {/* Trama perimetral de união (braços que entram no círculo) */}
          <line x1="4" y1="28" x2="26" y2="42" />
          <line x1="96" y1="28" x2="74" y2="42" />
          <line x1="4" y1="72" x2="26" y2="58" />
          <line x1="96" y1="72" x2="74" y2="58" />

          {/* Quadrado entrelaçado central */}
          <rect x="42" y="42" width="16" height="16" transform="rotate(45 50 50)" strokeWidth="1.8" stroke="#ffffff" fill="rgba(255,255,255,0.12)" />
        </g>

        {/* Borda refinada externa */}
        <circle cx="50" cy="50" r="47" stroke="#3b7a70" strokeWidth="1.2" strokeOpacity="0.4" />
      </svg>

      {/* Tipografia Oficial GKPN com Linha Divisória */}
      <div className="flex flex-col justify-center">
        {/* GLOBAL KINGDOM (em fonte serifada elegante) */}
        <div
          className="text-[17px] sm:text-[19px] font-semibold tracking-[0.03em] text-[#1c2430] uppercase leading-none pb-1"
          style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
        >
          GLOBAL KINGDOM
        </div>

        {/* Linha Divisória em Verde-Água / Turquesa suave */}
        <div className="h-[1.5px] bg-[#7abcb0] w-full my-0.5" />

        {/* PARTNERSHIPS NETWORK */}
        <div className="flex items-center gap-1.5 pt-0.5 leading-none">
          <span
            className="text-[12.5px] sm:text-[13.5px] font-medium tracking-[0.05em] text-[#242b35] uppercase"
            style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
          >
            PARTNERSHIPS
          </span>
          <span
            className="text-[12.5px] sm:text-[13.5px] font-medium tracking-[0.06em] text-[#4d978e] uppercase"
            style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
          >
            NETWORK
          </span>
        </div>
      </div>
    </div>
  );
};
