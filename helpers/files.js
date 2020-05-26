const imageExt = mimetype => {
    let ext = '';
    if (mimetype === 'image/jpeg' || mimetype === 'image/jpg' || mimetype === 'image/pjpeg') {
        ext = 'jpg';
    }
    if (mimetype === 'image/svg+xml' || mimetype === 'image/svg') {
        ext = 'svg';
    }
    if (mimetype === 'image/png') {
        ext = 'png';
    }
    return ext;
};
const pdfExt = mimetype => {
    let ext = '';
    if (mimetype === 'application/pdf') {
        ext = 'pdf';
    }
    return ext;
};

module.exports = { imageExt, pdfExt };
