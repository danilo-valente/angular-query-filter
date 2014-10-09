var Token = {

    EmptyQuery: function () {
        this.evaluate = function () {
            return true;
        };
    },

    // TODO: add support to multi-level properties, like 'foo.bar'
    Identifier: function (id, parent) {
        this.id = id;
        this.parent = parent;

        this.evaluate = function (obj) {
            if (this.parent) {
                obj = this.parent.evaluate(obj);
            }
            return angular.isDefined(obj) && obj !== null ? obj[this.id] : obj;
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