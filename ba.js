var aa = require('./aa');

module.exports = {
    b: function(x) {
        return 'b('+x+'): '+aa.a(x);
    }
};