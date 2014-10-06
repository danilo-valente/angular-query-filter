module.exports = {

    Identifier: function (id, parent) {
        this.id = id;
        this.parent = parent;

        function property(obj, path) {
            if (!path) {
                return obj;
            }
            var key = path.split('.', 1)[0];
            var prop = obj[key];
            var re = new RegExp('^' + key + '\\.?');
            return property(prop, path.replace(re));
        }

        this.evaluate = function (obj) {
            //return property(obj, this.id);
            return this.parent ? this.parent[this.id] : obj[this.id];
        };
    },

    Number: function (value) {
        this.value = Number(value);

        this.evaluate = function () {
            return this.value;
        };
    },

    String: function (value) {
        this.value = String(value);

        this.evaluate = function () {
            return this.value;
        };
    },

    Boolean: function (value) {
        this.value = Boolean(value);

        this.evaluate = function () {
            return this.value;
        };
    },

    Null: function () {
        this.evaluate = function () {
            return null;
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

    Equals: function (left, right) {
        this.left = left;
        this.right = right;

        this.evaluate = function (obj) {
            return this.left.evaluate(obj) == this.right.evaluate(obj);
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