import jsPDF from 'jspdf';
export const downloadPdf = (width, height, canvas, zoomRatio, fileName) => {
    const dataURL = downloadPng(canvas, zoomRatio);
    let pdf;
    width > height
        ? (pdf = new jsPDF('l', 'px', [width, height]))
        : (pdf = new jsPDF('p', 'px', [height, width]));
    width = pdf.internal.pageSize.getWidth();
    height = pdf.internal.pageSize.getHeight();
    pdf.addImage(dataURL, 'PNG', 0, 0, width, height);
    pdf.save(`${fileName}.pdf`);
};
export const downloadJpg = (canvas, zoomRatio) => {
    const dataURL = canvas.toDataURL({
        format: 'jpeg',
        quality: 1,
        multiplier: zoomRatio,
    });
    return dataURL;
};
export const downloadPng = (canvas, zoomRatio) => {
    const dataURL = canvas.toDataURL({
        format: 'png',
        multiplier: zoomRatio,
    });
    return dataURL;
};
