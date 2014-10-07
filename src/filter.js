var ngModule = angular.module('danilovalente.queryFilter', []);

var queryFilter = function () {
    return function (array, query) {
        var result = [];
        try {
            var root = parser.parse(query);
            angular.forEach(array, function (obj) {
                if (root.evaluate(obj)) {
                    result.push(obj);
                }
            });
        } catch (ex) {
            // Do nothing
        }
        return result;
    };
};

ngModule.filter('query', queryFilter);