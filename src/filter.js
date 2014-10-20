var ngModule = angular.module('danilovalente.queryFilter', [
    'ng'
]);

/*
 * queryFilterConfig
 */
var queryFilterConfig = {
    defaultGrammar: 'default',
    caseInsensitive: false,
    errorHandler: angular.noop
};

ngModule.value('queryFilterConfig', queryFilterConfig);

/*
 * queryFilter
 */
var queryFilter = function (filterFilter, queryFilterConfig) {

    function $$parser(options) {
        var grammar = options.grammar || queryFilterConfig.defaultGrammar;
        parser.lexer = angular.isString(grammar) ? lexers[grammar] : grammar;
        parser.yy.caseInsensitive = options.caseInsensitive || queryFilterConfig.caseInsensitive;
        return parser;
    }

    this.addGrammar = function (name, lexer) {
        this.lexers[name] = lexer;
    };

    return function (array, query, options) {
        options = options || {};

        var errorHandler = options.errorHandler || queryFilterConfig.errorHandler;

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
queryFilter.$inject = ['filterFilter', 'queryFilterConfig'];

ngModule.filter('query', queryFilter);