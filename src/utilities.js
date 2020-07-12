module.exports = { convertBytesToJson: convertBytesToJsonString, isNumeric };

function convertBytesToJsonString(bytes) {
    return JSON.parse(Buffer.concat(bytes).toString());
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}