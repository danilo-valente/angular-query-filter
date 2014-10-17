var ngModule = angular.module('danilovalente.queryFilter', []);

var queryFilter = function () {

    this.lexers = lexers;

    this.getParser = function (grammar) {
        var p = new ParserFactory.Parser();
        p.lexer = lexers[grammar] || defaultLexer;
        return p;
    };

    var self = this;
    return function (array, query, options) {
        options = options || {};

        query = angular.isString(query) ? query : '';

        var result = [];
        try {
            var parser = self.getParser(options.grammar);
            var root = parser.parse(query);
            angular.forEach(array, function (obj) {
                if (root.evaluate(obj)) {
                    result.push(obj);
                }
            });
        } catch (ex) {
            console.error(ex);
        }

        return result;
    };
};

ngModule.filter('query', queryFilter);