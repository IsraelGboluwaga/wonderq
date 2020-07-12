function randInt(start, end) {
    return Math.floor(Math.random() * (end-start)) + start;
}

function generateRandomChars(len) {
    let text = "";
    let base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (let i = 0; i < randInt(0, len); i++)
        text += base.charAt(randInt(0, base.length));

    return text;
}

module.exports = { randInt, generateRandomChars };