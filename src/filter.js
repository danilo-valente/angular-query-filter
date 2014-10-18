var ngModule = angular.module('danilovalente.queryFilter', [
    'ng'
]);

/*
 * queryFilterConfig
 */
var config = {
    defaultGrammar: 'default',
    caseInsensitive: false,
    errorHandler: angular.noop
};

ngModule.value('queryFilterConfig', config);

/*
 * queryFilter
 */
var queryFilter = function (filterFilter) {

    function $$parser(options) {
        parser.lexer = lexers[options.grammar] || lexers[config.defaultGrammar];
        parser.yy.caseInsensitive = options.caseInsensitive || config.caseInsensitive;
        return parser;
    }

    this.addGrammar = function (name, lexer) {
        this.lexers[name] = lexer;
    };

    return function (array, query, options) {
        options = options || {};

        var errorHandler = options.errorHandler || config.errorHandler;

        var result = [];
        var parser = $$parser(options);
        var root;

        try {
            root = parser.parse(angular.isString(query) ? query : '');

            if (root instanceof Ast.Primitive) {
                result = filterFilter(array, root.value);
            } else {
                angular.forEach(array, function (obj) {
                    if (root.evaluate(obj)) {
                        result.push(obj);
                    }
                });
            }

            // Call errorHandler passing no error as argument
            errorHandler(null);

        } catch (err) {
            errorHandler(err);
        }

        return result;
    };
};
queryFilter.$inject = ['filterFilter'];

ngModule.filter('query', queryFilter);