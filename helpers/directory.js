const getNewDirectoryName = directory => {
    const dirnameArray = directory.split('/');
    dirnameArray.splice(dirnameArray.length - 2, 2);
    const newDirname = dirnameArray.join('/');
    return newDirname;
};

module.exports = { getNewDirectoryName };
