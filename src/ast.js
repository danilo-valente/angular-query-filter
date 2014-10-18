function isToken(obj) {
    return obj && angular.isFunction(obj.evaluate);
}

function lower(obj) {
    if (angular.isString(obj)) {
        obj = obj.trim().toLowerCase();
    }
    return obj;
}

function normalize(obj) {
    obj = lower(obj);
    if (angular.isString(obj)) {
        obj = obj
            .replace(/[áàãâä]/g, 'a')
            .replace(/[éèẽêë]/g, 'e')
            .replace(/[íìĩîï]/g, 'i')
            .replace(/[óòõôö]/g, 'o')
            .replace(/[úùũûü]/g, 'u')
            .replace(/[çḉ]/g, 'c')
            .replace(/^a-zA-Z_]/g, '');

    }
    return obj;
}

function like(a, b) {
    a = normalize(a);
    b = normalize(b);
    return a.indexOf(b) !== -1;
}

function equals(a, b) {
    if (angular.isArray(a) && angular.isArray(b)) {
        var len = a.length;
        if (len !== b.length) {
            return false;
        }

        var i;
        for (i = 0; i < len; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }

        return true;
    }

    return a == b;
}

// TODO: Improve operators logic
var Ast = {

    EmptyQuery: function () {
        this.evaluate = function () {
            return true;
        };
    },

    Identifier: function (id, parent, caseInsensitive) {
        this.id = id;
        this.parent = parent;
        this.caseInsensitive = caseInsensitive;

        this.evaluate = function (obj) {
            if (this.parent) {
                obj = this.parent.evaluate(obj);
            }

            if (angular.isUndefined(obj) || obj === null) {
                return null;
            }

            if (!this.id) {
                return obj;
            }

            if (!this.caseInsensitive) {
                return obj[this.id];
            }

            for (var key in obj) {
                if (key.toLowerCase() === this.id.toLowerCase()) {
                    return obj[key];
                }
            }

            return null;
        };
    },

    Array: function (items) {
        this.items = items;

        this.evaluate = function (obj) {
            var items = [];
            angular.forEach(this.items, function (item) {
                var value = isToken(item) ? item.evaluate(obj) : item;
                items.push(value);
            });

            return items;
        };
    },

    Primitive: function (value) {
        this.value = value;

        this.evaluate = function (obj) {
            return isToken(this.value)
                ? this.value.evaluate(obj)
                : this.value;
        };
    },

    And: function (left, right) {
        this.left = left;
        this.right = right;

        this.evaluate = function (obj) {
            return this.left.evaluate(obj) && this.right.evaluate(obj);
        };
    },

    Or: function (left, right) {
        this.left = left;
        this.right = right;

        this.evaluate = function (obj) {
            return this.left.evaluate(obj) || this.right.evaluate(obj);
        };
    },

    Not: function (id) {
        this.id = id;

        this.evaluate = function (obj) {
            return !this.id.evaluate(obj);
        };
    },

    Like: function (string, pattern) {
        this.string = string;
        this.pattern = pattern;

        this.evaluate = function (obj) {
            return like(this.string.evaluate(obj), this.pattern.evaluate(obj))
        };
    },

    Equals: function (left, right) {
        this.left = left;
        this.right = right;

        this.evaluate = function (obj) {
            var left = lower(this.left.evaluate(obj));
            var right = lower(this.right.evaluate(obj));
            return equals(left, right);
        };
    },

    Is: function (left, right) {
        this.left = left;
        this.right = right;

        this.evaluate = function (obj) {
            return this.left.evaluate(obj) === this.right.evaluate(obj);
        };
    },

    In: function (object, collection) {
        this.object = object;
        this.collection = collection;

        this.evaluate = function (obj) {
            var object = this.object.evaluate(obj);
            var collection = this.collection.evaluate(obj);

            if (angular.isString(collection)) {
                return like(collection, object);
            }

            if (angular.isArray(collection)) {
                return collection.indexOf(object) !== -1;
            }

            if (angular.isObject(collection)) {
                return collection.hasOwnProperty(object);
            }

            return false;
        };
    },

    Differs: function (left, right) {
        this.left = left;
        this.right = right;

        this.evaluate = function (obj) {
            return this.left.evaluate(obj) !== this.right.evaluate(obj);
        };
    },

    LessThan: function (left, right) {
        this.left = left;
        this.right = right;

        this.evaluate = function (obj) {
            return this.left.evaluate(obj) < this.right.evaluate(obj);
        };
    },

    LessThanEquals: function (left, right) {
        this.left = left;
        this.right = right;

        this.evaluate = function (obj) {
            return this.left.evaluate(obj) <= this.right.evaluate(obj);
        };
    },

    GreaterThan: function (left, right) {
        this.left = left;
        this.right = right;

        this.evaluate = function (obj) {
            return this.left.evaluate(obj) > this.right.evaluate(obj);
        };
    },

    GreaterThanEquals: function (left, right) {
        this.left = left;
        this.right = right;

        this.evaluate = function (obj) {
            return this.left.evaluate(obj) >= this.right.evaluate(obj);
        };
    }
};