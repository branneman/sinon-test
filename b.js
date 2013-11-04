var a = require('./a');
module.exports = function(x) {
    return 'b('+x+'): '+a(x);
};