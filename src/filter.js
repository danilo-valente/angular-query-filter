var ngModule = angular.module('danilovalente.queryFilter', []);

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
var queryFilter = function () {

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

        var result = [];
        var parser = $$parser(options);
        var root;

        try {
            root = parser.parse(angular.isString(query) ? query : '');

            angular.forEach(array, function (obj) {
                if (root.evaluate(obj)) {
                    result.push(obj);
                }
            });
        } catch (err) {
            (options.errorHandler || config.errorHandler)(err);
        }

        return result;
    };
};

ngModule.filter('query', queryFilter);