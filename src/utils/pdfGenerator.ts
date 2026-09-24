import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function criarReciboPDFDocument(element: HTMLElement): Promise<jsPDF> {
  // Configuração para captura em alta definição (3x para textos ultra nítidos)
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 1024,
    onclone: (clonedDoc) => {
      // Garante que o elemento clonado esteja com fundo branco e visível
      const clonedElement = clonedDoc.getElementById('receipt-print-area');
      if (clonedElement) {
        clonedElement.style.boxShadow = 'none';
        clonedElement.style.margin = '0 auto';
        clonedElement.style.border = 'none';
        clonedElement.style.width = '850px';
      }
    },
  });

  const imgData = canvas.toDataURL('image/png', 1.0);

  // Formato A4 em paisagem (landscape) ou retrato conforme a proporção
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const aspectRatio = imgWidth / imgHeight;

  // Cria documento PDF em formato A4 Paisagem para encaixar o recibo
  const isLandscape = aspectRatio > 1.2;
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Margem de 15mm
  const margin = 15;
  const maxContentWidth = pageWidth - margin * 2;
  const maxContentHeight = pageHeight - margin * 2;

  let renderWidth = maxContentWidth;
  let renderHeight = renderWidth / aspectRatio;

  if (renderHeight > maxContentHeight) {
    renderHeight = maxContentHeight;
    renderWidth = renderHeight * aspectRatio;
  }

  // Centraliza na página
  const posX = (pageWidth - renderWidth) / 2;
  const posY = (pageHeight - renderHeight) / 2;

  pdf.addImage(imgData, 'PNG', posX, posY, renderWidth, renderHeight, undefined, 'FAST');
  return pdf;
}

export async function gerarReciboPDFBlob(
  element: HTMLElement
): Promise<{ blob: Blob; url: string }> {
  const pdf = await criarReciboPDFDocument(element);
  const blob = pdf.output('blob');
  const url = URL.createObjectURL(blob);
  return { blob, url };
}

export async function gerarReciboPDF(
  element: HTMLElement,
  nomeArquivo: string = 'recibo.pdf'
): Promise<void> {
  const pdf = await criarReciboPDFDocument(element);
  pdf.save(nomeArquivo);
}

export async function baixarReciboImagem(
  element: HTMLElement,
  nomeArquivo: string = 'recibo.png'
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  const link = document.createElement('a');
  link.download = nomeArquivo;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
