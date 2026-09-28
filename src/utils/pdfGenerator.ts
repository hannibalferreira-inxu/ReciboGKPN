import html2canvas from 'html2canvas-pro';

/**
 * Captura a visualização direta do recibo em alta definição (PNG)
 * e dispara o download do arquivo de imagem sem corromper.
 */
export async function baixarReciboImagem(
  element: HTMLElement,
  nomeArquivo: string = 'recibo.png'
): Promise<void> {
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 1024,
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.getElementById('receipt-print-area');
      if (clonedElement) {
        clonedElement.style.boxShadow = 'none';
        clonedElement.style.margin = '0 auto';
        clonedElement.style.border = 'none';
        clonedElement.style.backgroundColor = '#ffffff';
        clonedElement.style.color = '#000000';
      }
    },
  });

  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.download = nomeArquivo;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
