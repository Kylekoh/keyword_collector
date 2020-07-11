function getAddSeperator(num) {
    const regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
}

function getRemoveSeperator(str) {
    return parseFloat(str.replace(/,/g, ''));
}

module.exports = {
    getAddSeperator,
    getRemoveSeperator
}