(function (angular) {

    if (!angular) {
        throw new Error('angular-query-filter requires AngularJS');
    }

    var lexers = {};

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
            obj = obj.replace(/[áàãâä]/g, 'a').replace(/[éèẽêë]/g, 'e').replace(/[íìĩîï]/g, 'i').replace(/[óòõôö]/g, 'o').replace(/[úùũûü]/g, 'u').replace(/[çḉ]/g, 'c').replace(/^a-zA-Z_]/g, '');

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
                return isToken(this.value) ? this.value.evaluate(obj) : this.value;
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
    }; /* generated by jison-lex 0.3.4 */
    var defaultLexer = (function () {
        var lexer = ({

            EOF: 1,

            parseError: function parseError(str, hash) {
                if (this.yy.parser) {
                    this.yy.parser.parseError(str, hash);
                } else {
                    throw new Error(str);
                }
            },

            // resets the lexer, sets new input
            setInput: function (input, yy) {
                this.yy = yy || this.yy || {};
                this._input = input;
                this._more = this._backtrack = this.done = false;
                this.yylineno = this.yyleng = 0;
                this.yytext = this.matched = this.match = '';
                this.conditionStack = ['INITIAL'];
                this.yylloc = {
                    first_line: 1,
                    first_column: 0,
                    last_line: 1,
                    last_column: 0
                };
                if (this.options.ranges) {
                    this.yylloc.range = [0, 0];
                }
                this.offset = 0;
                return this;
            },

            // consumes and returns one char from the input
            input: function () {
                var ch = this._input[0];
                this.yytext += ch;
                this.yyleng++;
                this.offset++;
                this.match += ch;
                this.matched += ch;
                var lines = ch.match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno++;
                    this.yylloc.last_line++;
                } else {
                    this.yylloc.last_column++;
                }
                if (this.options.ranges) {
                    this.yylloc.range[1]++;
                }

                this._input = this._input.slice(1);
                return ch;
            },

            // unshifts one char (or a string) into the input
            unput: function (ch) {
                var len = ch.length;
                var lines = ch.split(/(?:\r\n?|\n)/g);

                this._input = ch + this._input;
                this.yytext = this.yytext.substr(0, this.yytext.length - len);
                //this.yyleng -= len;
                this.offset -= len;
                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                this.match = this.match.substr(0, this.match.length - 1);
                this.matched = this.matched.substr(0, this.matched.length - 1);

                if (lines.length - 1) {
                    this.yylineno -= lines.length - 1;
                }
                var r = this.yylloc.range;

                this.yylloc = {
                    first_line: this.yylloc.first_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.first_column,
                    last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                };

                if (this.options.ranges) {
                    this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                }
                this.yyleng = this.yytext.length;
                return this;
            },

            // When called from action, caches matched text and appends it on next action
            more: function () {
                this._more = true;
                return this;
            },

            // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
            reject: function () {
                if (this.options.backtrack_lexer) {
                    this._backtrack = true;
                } else {
                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });

                }
                return this;
            },

            // retain first n characters of the match
            less: function (n) {
                this.unput(this.match.slice(n));
            },

            // displays already matched input, i.e. for error messages
            pastInput: function () {
                var past = this.matched.substr(0, this.matched.length - this.match.length);
                return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
            },

            // displays upcoming input, i.e. for error messages
            upcomingInput: function () {
                var next = this.match;
                if (next.length < 20) {
                    next += this._input.substr(0, 20 - next.length);
                }
                return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
            },

            // displays the character position where the lexing error occurred, i.e. for error messages
            showPosition: function () {
                var pre = this.pastInput();
                var c = new Array(pre.length + 1).join("-");
                return pre + this.upcomingInput() + "\n" + c + "^";
            },

            // test the lexed token: return FALSE when not a match, otherwise return token
            test_match: function (match, indexed_rule) {
                var token, lines, backup;

                if (this.options.backtrack_lexer) {
                    // save context
                    backup = {
                        yylineno: this.yylineno,
                        yylloc: {
                            first_line: this.yylloc.first_line,
                            last_line: this.last_line,
                            first_column: this.yylloc.first_column,
                            last_column: this.yylloc.last_column
                        },
                        yytext: this.yytext,
                        match: this.match,
                        matches: this.matches,
                        matched: this.matched,
                        yyleng: this.yyleng,
                        offset: this.offset,
                        _more: this._more,
                        _input: this._input,
                        yy: this.yy,
                        conditionStack: this.conditionStack.slice(0),
                        done: this.done
                    };
                    if (this.options.ranges) {
                        backup.yylloc.range = this.yylloc.range.slice(0);
                    }
                }

                lines = match[0].match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno += lines.length;
                }
                this.yylloc = {
                    first_line: this.yylloc.last_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.last_column,
                    last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
                };
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                if (this.options.ranges) {
                    this.yylloc.range = [this.offset, this.offset += this.yyleng];
                }
                this._more = false;
                this._backtrack = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
                if (this.done && this._input) {
                    this.done = false;
                }
                if (token) {
                    return token;
                } else if (this._backtrack) {
                    // recover context
                    for (var k in backup) {
                        this[k] = backup[k];
                    }
                    return false; // rule action called reject() implying the next rule should be tested instead.
                }
                return false;
            },

            // return next match in input
            next: function () {
                if (this.done) {
                    return this.EOF;
                }
                if (!this._input) {
                    this.done = true;
                }

                var token, match, tempMatch, index;
                if (!this._more) {
                    this.yytext = '';
                    this.match = '';
                }
                var rules = this._currentRules();
                for (var i = 0; i < rules.length; i++) {
                    tempMatch = this._input.match(this.rules[rules[i]]);
                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                        match = tempMatch;
                        index = i;
                        if (this.options.backtrack_lexer) {
                            token = this.test_match(tempMatch, rules[i]);
                            if (token !== false) {
                                return token;
                            } else if (this._backtrack) {
                                match = false;
                                continue; // rule action called reject() implying a rule MISmatch.
                            } else {
                                // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                                return false;
                            }
                        } else if (!this.options.flex) {
                            break;
                        }
                    }
                }
                if (match) {
                    token = this.test_match(match, rules[index]);
                    if (token !== false) {
                        return token;
                    }
                    // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                    return false;
                }
                if (this._input === "") {
                    return this.EOF;
                } else {
                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });
                }
            },

            // return next match that has a token
            lex: function lex() {
                var r = this.next();
                if (r) {
                    return r;
                } else {
                    return this.lex();
                }
            },

            // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
            begin: function begin(condition) {
                this.conditionStack.push(condition);
            },

            // pop the previously active lexer condition state off the condition stack
            popState: function popState() {
                var n = this.conditionStack.length - 1;
                if (n > 0) {
                    return this.conditionStack.pop();
                } else {
                    return this.conditionStack[0];
                }
            },

            // produce the lexer rule set which is active for the currently active lexer condition state
            _currentRules: function _currentRules() {
                if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                } else {
                    return this.conditions["INITIAL"].rules;
                }
            },

            // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
            topState: function topState(n) {
                n = this.conditionStack.length - 1 - Math.abs(n || 0);
                if (n >= 0) {
                    return this.conditionStack[n];
                } else {
                    return "INITIAL";
                }
            },

            // alias for begin(condition)
            pushState: function pushState(condition) {
                this.begin(condition);
            },

            // return the number of states currently on the stack
            stateStackSize: function stateStackSize() {
                return this.conditionStack.length;
            },
            options: {
                "case-insensitive": true,
                "moduleName": "defaultLexer",
                "moduleType": "js"
            },
            performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                var YYSTATE = YY_START;
                switch ($avoiding_name_collisions) {
                case 0:
                    /* skip whitespace */
                    break;
                case 1:
                    return 'DOT'
                    break;
                case 2:
                    return 'AND'
                    break;
                case 3:
                    return 'OR'
                    break;
                case 4:
                    return 'LTE'
                    break;
                case 5:
                    return 'GTE'
                    break;
                case 6:
                    return 'LT'
                    break;
                case 7:
                    return 'GT'
                    break;
                case 8:
                    return 'DIFF'
                    break;
                case 9:
                    return 'LIKE'
                    break;
                case 10:
                    return 'IS'
                    break;
                case 11:
                    return 'EQ'
                    break;
                case 12:
                    return 'IN'
                    break;
                case 13:
                    return 'NOT'
                    break;
                case 14:
                    return 'START_EXPR'
                    break;
                case 15:
                    return 'END_EXPR'
                    break;
                case 16:
                    return 'START_ARR'
                    break;
                case 17:
                    return 'END_ARR'
                    break;
                case 18:
                    return 'ITEM_DLM'
                    break;
                case 19:
                    return 'NUMBER'
                    break;
                case 20:
                    return 'BOOLEAN'
                    break;
                case 21:
                    return 'NULL'
                    break;
                case 22:
                    var t = yy_.yytext;
                    var len = t.length;
                    yy_.yytext = t[1] === '"' && t[len - 1] === '"' ? t.substring(2, len - 1) : t.substring(1);
                    return 'ID';

                    break;
                case 23:
                    var t = yy_.yytext;
                    var len = t.length;
                    yy_.yytext = t[0] === '"' && t[len - 1] === '"' ? t.substring(1, len - 1) : t;
                    return 'STRING';

                    break;
                case 24:
                    return 'EOF'
                    break;
                case 25:
                    return 'INVALID'
                    break;
                }
            },
            rules: [/^(?:\s+)/i, /^(?:\.)/i, /^(?:&&|&|AND\b)/i, /^(?:\|\||\||OR\b)/i, /^(?:<=)/i, /^(?:>=)/i, /^(?:<)/i, /^(?:>)/i, /^(?:!=)/i, /^(?:~=|LIKE\b)/i, /^(?:==|IS\b)/i, /^(?:=)/i, /^(?:IN\b)/i, /^(?:!)/i, /^(?:\()/i, /^(?:\))/i, /^(?:\[)/i, /^(?:\])/i, /^(?:,)/i, /^(?:\d+(\.\d+)?\b)/i, /^(?:false|true\b)/i, /^(?:null\b)/i, /^(?:(\$)((\w[\w\d_]*)|("(?:\\[\"bfnrt/\\]|\\[a-f0-9]{4}|[^\"\\])*"))?)/i, /^(?:(\w[\w\d_]*)|("(?:\\[\"bfnrt/\\]|\\[a-f0-9]{4}|[^\"\\])*"))/i, /^(?:$)/i, /^(?:.)/i],
            conditions: {
                "INITIAL": {
                    "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
                    "inclusive": true
                }
            }
        });
        lexers['default'] = lexer;;
        return lexer;
    })(); /* generated by jison-lex 0.3.4 */
    var sqlLexer = (function () {
        var lexer = ({

            EOF: 1,

            parseError: function parseError(str, hash) {
                if (this.yy.parser) {
                    this.yy.parser.parseError(str, hash);
                } else {
                    throw new Error(str);
                }
            },

            // resets the lexer, sets new input
            setInput: function (input, yy) {
                this.yy = yy || this.yy || {};
                this._input = input;
                this._more = this._backtrack = this.done = false;
                this.yylineno = this.yyleng = 0;
                this.yytext = this.matched = this.match = '';
                this.conditionStack = ['INITIAL'];
                this.yylloc = {
                    first_line: 1,
                    first_column: 0,
                    last_line: 1,
                    last_column: 0
                };
                if (this.options.ranges) {
                    this.yylloc.range = [0, 0];
                }
                this.offset = 0;
                return this;
            },

            // consumes and returns one char from the input
            input: function () {
                var ch = this._input[0];
                this.yytext += ch;
                this.yyleng++;
                this.offset++;
                this.match += ch;
                this.matched += ch;
                var lines = ch.match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno++;
                    this.yylloc.last_line++;
                } else {
                    this.yylloc.last_column++;
                }
                if (this.options.ranges) {
                    this.yylloc.range[1]++;
                }

                this._input = this._input.slice(1);
                return ch;
            },

            // unshifts one char (or a string) into the input
            unput: function (ch) {
                var len = ch.length;
                var lines = ch.split(/(?:\r\n?|\n)/g);

                this._input = ch + this._input;
                this.yytext = this.yytext.substr(0, this.yytext.length - len);
                //this.yyleng -= len;
                this.offset -= len;
                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                this.match = this.match.substr(0, this.match.length - 1);
                this.matched = this.matched.substr(0, this.matched.length - 1);

                if (lines.length - 1) {
                    this.yylineno -= lines.length - 1;
                }
                var r = this.yylloc.range;

                this.yylloc = {
                    first_line: this.yylloc.first_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.first_column,
                    last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                };

                if (this.options.ranges) {
                    this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                }
                this.yyleng = this.yytext.length;
                return this;
            },

            // When called from action, caches matched text and appends it on next action
            more: function () {
                this._more = true;
                return this;
            },

            // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
            reject: function () {
                if (this.options.backtrack_lexer) {
                    this._backtrack = true;
                } else {
                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });

                }
                return this;
            },

            // retain first n characters of the match
            less: function (n) {
                this.unput(this.match.slice(n));
            },

            // displays already matched input, i.e. for error messages
            pastInput: function () {
                var past = this.matched.substr(0, this.matched.length - this.match.length);
                return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
            },

            // displays upcoming input, i.e. for error messages
            upcomingInput: function () {
                var next = this.match;
                if (next.length < 20) {
                    next += this._input.substr(0, 20 - next.length);
                }
                return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
            },

            // displays the character position where the lexing error occurred, i.e. for error messages
            showPosition: function () {
                var pre = this.pastInput();
                var c = new Array(pre.length + 1).join("-");
                return pre + this.upcomingInput() + "\n" + c + "^";
            },

            // test the lexed token: return FALSE when not a match, otherwise return token
            test_match: function (match, indexed_rule) {
                var token, lines, backup;

                if (this.options.backtrack_lexer) {
                    // save context
                    backup = {
                        yylineno: this.yylineno,
                        yylloc: {
                            first_line: this.yylloc.first_line,
                            last_line: this.last_line,
                            first_column: this.yylloc.first_column,
                            last_column: this.yylloc.last_column
                        },
                        yytext: this.yytext,
                        match: this.match,
                        matches: this.matches,
                        matched: this.matched,
                        yyleng: this.yyleng,
                        offset: this.offset,
                        _more: this._more,
                        _input: this._input,
                        yy: this.yy,
                        conditionStack: this.conditionStack.slice(0),
                        done: this.done
                    };
                    if (this.options.ranges) {
                        backup.yylloc.range = this.yylloc.range.slice(0);
                    }
                }

                lines = match[0].match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno += lines.length;
                }
                this.yylloc = {
                    first_line: this.yylloc.last_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.last_column,
                    last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
                };
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                if (this.options.ranges) {
                    this.yylloc.range = [this.offset, this.offset += this.yyleng];
                }
                this._more = false;
                this._backtrack = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
                if (this.done && this._input) {
                    this.done = false;
                }
                if (token) {
                    return token;
                } else if (this._backtrack) {
                    // recover context
                    for (var k in backup) {
                        this[k] = backup[k];
                    }
                    return false; // rule action called reject() implying the next rule should be tested instead.
                }
                return false;
            },

            // return next match in input
            next: function () {
                if (this.done) {
                    return this.EOF;
                }
                if (!this._input) {
                    this.done = true;
                }

                var token, match, tempMatch, index;
                if (!this._more) {
                    this.yytext = '';
                    this.match = '';
                }
                var rules = this._currentRules();
                for (var i = 0; i < rules.length; i++) {
                    tempMatch = this._input.match(this.rules[rules[i]]);
                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                        match = tempMatch;
                        index = i;
                        if (this.options.backtrack_lexer) {
                            token = this.test_match(tempMatch, rules[i]);
                            if (token !== false) {
                                return token;
                            } else if (this._backtrack) {
                                match = false;
                                continue; // rule action called reject() implying a rule MISmatch.
                            } else {
                                // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                                return false;
                            }
                        } else if (!this.options.flex) {
                            break;
                        }
                    }
                }
                if (match) {
                    token = this.test_match(match, rules[index]);
                    if (token !== false) {
                        return token;
                    }
                    // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                    return false;
                }
                if (this._input === "") {
                    return this.EOF;
                } else {
                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });
                }
            },

            // return next match that has a token
            lex: function lex() {
                var r = this.next();
                if (r) {
                    return r;
                } else {
                    return this.lex();
                }
            },

            // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
            begin: function begin(condition) {
                this.conditionStack.push(condition);
            },

            // pop the previously active lexer condition state off the condition stack
            popState: function popState() {
                var n = this.conditionStack.length - 1;
                if (n > 0) {
                    return this.conditionStack.pop();
                } else {
                    return this.conditionStack[0];
                }
            },

            // produce the lexer rule set which is active for the currently active lexer condition state
            _currentRules: function _currentRules() {
                if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                } else {
                    return this.conditions["INITIAL"].rules;
                }
            },

            // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
            topState: function topState(n) {
                n = this.conditionStack.length - 1 - Math.abs(n || 0);
                if (n >= 0) {
                    return this.conditionStack[n];
                } else {
                    return "INITIAL";
                }
            },

            // alias for begin(condition)
            pushState: function pushState(condition) {
                this.begin(condition);
            },

            // return the number of states currently on the stack
            stateStackSize: function stateStackSize() {
                return this.conditionStack.length;
            },
            options: {
                "case-insensitive": true,
                "moduleName": "sqlLexer",
                "moduleType": "js"
            },
            performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                var YYSTATE = YY_START;
                switch ($avoiding_name_collisions) {
                case 0:
                    /* skip whitespace */
                    break;
                case 1:
                    return 'DOT'
                    break;
                case 2:
                    return 'AND'
                    break;
                case 3:
                    return 'OR'
                    break;
                case 4:
                    return 'LTE'
                    break;
                case 5:
                    return 'GTE'
                    break;
                case 6:
                    return 'LT'
                    break;
                case 7:
                    return 'GT'
                    break;
                case 8:
                    return 'DIFF'
                    break;
                case 9:
                    return 'LIKE'
                    break;
                case 10:
                    return 'IS'
                    break;
                case 11:
                    return 'EQ'
                    break;
                case 12:
                    return 'IN'
                    break;
                case 13:
                    return 'NOT'
                    break;
                case 14:
                    return 'START_EXPR'
                    break;
                case 15:
                    return 'END_EXPR'
                    break;
                case 16:
                    return 'START_ARR'
                    break;
                case 17:
                    return 'END_ARR'
                    break;
                case 18:
                    return 'ITEM_DLM'
                    break;
                case 19:
                    return 'NUMBER'
                    break;
                case 20:
                    return 'BOOLEAN'
                    break;
                case 21:
                    return 'NULL'
                    break;
                case 22:
                    var t = yy_.yytext;
                    var len = t.length;
                    yy_.yytext = t[1] === '"' && t[len - 1] === '"' ? t.substring(2, len - 1) : t.substring(1);
                    return 'ID';

                    break;
                case 23:
                    var t = yy_.yytext;
                    var len = t.length;
                    yy_.yytext = t[0] === '"' && t[len - 1] === '"' ? t.substring(1, len - 1) : t;
                    return 'STRING';

                    break;
                case 24:
                    return 'EOF'
                    break;
                case 25:
                    return 'INVALID'
                    break;
                }
            },
            rules: [/^(?:\s+)/i, /^(?:\.)/i, /^(?:&&|&|AND\b)/i, /^(?:\|\||\||OR\b)/i, /^(?:<=)/i, /^(?:>=)/i, /^(?:<)/i, /^(?:>)/i, /^(?:!=)/i, /^(?:~=|LIKE\b)/i, /^(?:==|IS\b)/i, /^(?:=)/i, /^(?:IN\b)/i, /^(?:!)/i, /^(?:\()/i, /^(?:\))/i, /^(?:\[)/i, /^(?:\])/i, /^(?:,)/i, /^(?:\d+(\.\d+)?\b)/i, /^(?:false|true\b)/i, /^(?:null\b)/i, /^(?:(\$)((\w[\w\d_]*)|("(?:\\[\"bfnrt/\\]|\\[a-f0-9]{4}|[^\"\\])*"))?)/i, /^(?:(\w[\w\d_]*)|("(?:\\[\"bfnrt/\\]|\\[a-f0-9]{4}|[^\"\\])*"))/i, /^(?:$)/i, /^(?:.)/i],
            conditions: {
                "INITIAL": {
                    "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
                    "inclusive": true
                }
            }
        });
        lexers['default'] = lexer;;
        return lexer;
    })(); /* parser generated by jison 0.4.15 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
    var parser = (function () {
        var o = function (k, v, o, l) {
            for (o = o || {}, l = k.length; l--; o[k[l]] = v);
            return o
        },
            $V0 = [1, 4],
            $V1 = [1, 5],
            $V2 = [1, 10],
            $V3 = [1, 11],
            $V4 = [1, 12],
            $V5 = [1, 13],
            $V6 = [1, 14],
            $V7 = [1, 8],
            $V8 = [1, 16],
            $V9 = [1, 17],
            $Va = [1, 18],
            $Vb = [1, 19],
            $Vc = [1, 20],
            $Vd = [1, 21],
            $Ve = [1, 22],
            $Vf = [1, 23],
            $Vg = [1, 24],
            $Vh = [1, 25],
            $Vi = [1, 26],
            $Vj = [4, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19],
            $Vk = [4, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 32],
            $Vl = [4, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 28, 30],
            $Vm = [28, 30],
            $Vn = [4, 6, 7, 19];
        var parser = {
            trace: function trace() {},
            yy: {},
            symbols_: {
                "error": 2,
                "expressions": 3,
                "EOF": 4,
                "e": 5,
                "AND": 6,
                "OR": 7,
                "NOT": 8,
                "LIKE": 9,
                "EQ": 10,
                "IS": 11,
                "IN": 12,
                "DIFF": 13,
                "LT": 14,
                "LTE": 15,
                "GT": 16,
                "GTE": 17,
                "LPAR": 18,
                "RPAR": 19,
                "id": 20,
                "primitive": 21,
                "array": 22,
                "NUMBER": 23,
                "STRING": 24,
                "BOOLEAN": 25,
                "NULL": 26,
                "array_items": 27,
                "ITEM_DLM": 28,
                "START_ARR": 29,
                "END_ARR": 30,
                "ID": 31,
                "DOT": 32,
                "$accept": 0,
                "$end": 1
            },
            terminals_: {
                2: "error",
                4: "EOF",
                6: "AND",
                7: "OR",
                8: "NOT",
                9: "LIKE",
                10: "EQ",
                11: "IS",
                12: "IN",
                13: "DIFF",
                14: "LT",
                15: "LTE",
                16: "GT",
                17: "GTE",
                18: "LPAR",
                19: "RPAR",
                23: "NUMBER",
                24: "STRING",
                25: "BOOLEAN",
                26: "NULL",
                28: "ITEM_DLM",
                29: "START_ARR",
                30: "END_ARR",
                31: "ID",
                32: "DOT"
            },
            productions_: [0, [3, 1],
                [3, 2],
                [5, 3],
                [5, 3],
                [5, 2],
                [5, 3],
                [5, 3],
                [5, 3],
                [5, 3],
                [5, 3],
                [5, 3],
                [5, 3],
                [5, 3],
                [5, 3],
                [5, 3],
                [5, 1],
                [5, 1],
                [21, 1],
                [21, 1],
                [21, 1],
                [21, 1],
                [21, 1],
                [27, 1],
                [27, 3],
                [22, 2],
                [22, 3],
                [20, 1],
                [20, 3]
            ],
            performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */ , $$ /* vstack */ , _$ /* lstack */ ) { /* this == yyval */

                var $0 = $$.length - 1;
                switch (yystate) {
                case 1:
                    return new Ast.EmptyQuery();
                    break;
                case 2:
                    return $$[$0 - 1];
                    break;
                case 3:
                    this.$ = new Ast.And($$[$0 - 2], $$[$0]);
                    break;
                case 4:
                    this.$ = new Ast.Or($$[$0 - 2], $$[$0]);
                    break;
                case 5:
                    this.$ = new Ast.Not($$[$0]);
                    break;
                case 6:
                    this.$ = new Ast.Like($$[$0 - 2], $$[$0]);
                    break;
                case 7:
                    this.$ = new Ast.Equals($$[$0 - 2], $$[$0]);
                    break;
                case 8:
                    this.$ = new Ast.Is($$[$0 - 2], $$[$0]);
                    break;
                case 9:
                    this.$ = new Ast.In($$[$0 - 2], $$[$0]);
                    break;
                case 10:
                    this.$ = new Ast.Differs($$[$0 - 2], $$[$0]);
                    break;
                case 11:
                    this.$ = new Ast.LessThan($$[$0 - 2], $$[$0]);
                    break;
                case 12:
                    this.$ = new Ast.LessThanEquals($$[$0 - 2], $$[$0]);
                    break;
                case 13:
                    this.$ = new Ast.GreaterThan($$[$0 - 2], $$[$0]);
                    break;
                case 14:
                    this.$ = new Ast.GreaterThanEquals($$[$0 - 2], $$[$0]);
                    break;
                case 15:
                    this.$ = $$[$0 - 1];
                    break;
                case 16:
                case 17:
                    this.$ = $$[$0];
                    break;
                case 18:
                    this.$ = new Ast.Primitive($$[$0]);
                    break;
                case 19:
                    this.$ = new Ast.Primitive(Number(yytext));
                    break;
                case 20:
                    this.$ = new Ast.Primitive(String(yytext));
                    break;
                case 21:
                    this.$ = new Ast.Primitive(Boolean(yytext.toLowerCase() === 'true'));
                    break;
                case 22:
                    this.$ = new Ast.Primitive(null);
                    break;
                case 23:
                    this.$ = [$$[$0]];
                    break;
                case 24:
                    this.$.push($$[$0]);
                    break;
                case 25:
                    this.$ = new Ast.Array([]);
                    break;
                case 26:
                    this.$ = new Ast.Array($$[$0 - 1]);
                    break;
                case 27:
                    this.$ = new Ast.Identifier(yytext, null, yy.caseInsensitive);
                    break;
                case 28:
                    this.$ = new Ast.Identifier(yytext, $$[$0 - 2], yy.caseInsensitive);
                    break;
                }
            },
            table: [{
                3: 1,
                4: [1, 2],
                5: 3,
                8: $V0,
                18: $V1,
                20: 6,
                21: 7,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                29: $V6,
                31: $V7
            },
            {
                1: [3]
            },
            {
                1: [2, 1]
            },
            {
                4: [1, 15],
                6: $V8,
                7: $V9,
                9: $Va,
                10: $Vb,
                11: $Vc,
                12: $Vd,
                13: $Ve,
                14: $Vf,
                15: $Vg,
                16: $Vh,
                17: $Vi
            },
            {
                5: 27,
                8: $V0,
                18: $V1,
                20: 6,
                21: 7,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                29: $V6,
                31: $V7
            },
            {
                5: 28,
                8: $V0,
                18: $V1,
                20: 6,
                21: 7,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                29: $V6,
                31: $V7
            },
            o($Vj, [2, 16], {
                32: [1, 29]
            }), o($Vj, [2, 17]), o($Vk, [2, 27]), o($Vl, [2, 18]), o($Vl, [2, 19]), o($Vl, [2, 20]), o($Vl, [2, 21]), o($Vl, [2, 22]),
            {
                21: 32,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                27: 31,
                29: $V6,
                30: [1, 30]
            },
            {
                1: [2, 2]
            },
            {
                5: 33,
                8: $V0,
                18: $V1,
                20: 6,
                21: 7,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                29: $V6,
                31: $V7
            },
            {
                5: 34,
                8: $V0,
                18: $V1,
                20: 6,
                21: 7,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                29: $V6,
                31: $V7
            },
            {
                5: 35,
                8: $V0,
                18: $V1,
                20: 6,
                21: 7,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                29: $V6,
                31: $V7
            },
            {
                5: 36,
                8: $V0,
                18: $V1,
                20: 6,
                21: 7,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                29: $V6,
                31: $V7
            },
            {
                5: 37,
                8: $V0,
                18: $V1,
                20: 6,
                21: 7,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                29: $V6,
                31: $V7
            },
            {
                5: 38,
                8: $V0,
                18: $V1,
                20: 6,
                21: 7,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                29: $V6,
                31: $V7
            },
            {
                5: 39,
                8: $V0,
                18: $V1,
                20: 6,
                21: 7,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                29: $V6,
                31: $V7
            },
            {
                5: 40,
                8: $V0,
                18: $V1,
                20: 6,
                21: 7,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                29: $V6,
                31: $V7
            },
            {
                5: 41,
                8: $V0,
                18: $V1,
                20: 6,
                21: 7,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                29: $V6,
                31: $V7
            },
            {
                5: 42,
                8: $V0,
                18: $V1,
                20: 6,
                21: 7,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                29: $V6,
                31: $V7
            },
            {
                5: 43,
                8: $V0,
                18: $V1,
                20: 6,
                21: 7,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                29: $V6,
                31: $V7
            },
            o($Vj, [2, 5]),
            {
                6: $V8,
                7: $V9,
                9: $Va,
                10: $Vb,
                11: $Vc,
                12: $Vd,
                13: $Ve,
                14: $Vf,
                15: $Vg,
                16: $Vh,
                17: $Vi,
                19: [1, 44]
            },
            {
                31: [1, 45]
            },
            o($Vl, [2, 25]),
            {
                28: [1, 47],
                30: [1, 46]
            },
            o($Vm, [2, 23]), o($Vn, [2, 3], {
                9: $Va,
                10: $Vb,
                11: $Vc,
                12: $Vd,
                13: $Ve,
                14: $Vf,
                15: $Vg,
                16: $Vh,
                17: $Vi
            }), o($Vn, [2, 4], {
                9: $Va,
                10: $Vb,
                11: $Vc,
                12: $Vd,
                13: $Ve,
                14: $Vf,
                15: $Vg,
                16: $Vh,
                17: $Vi
            }), o($Vj, [2, 6]), o($Vj, [2, 7]), o($Vj, [2, 8]), o($Vj, [2, 9]), o($Vj, [2, 10]), o($Vj, [2, 11]), o($Vj, [2, 12]), o($Vj, [2, 13]), o($Vj, [2, 14]), o($Vj, [2, 15]), o($Vk, [2, 28]), o($Vl, [2, 26]),
            {
                21: 48,
                22: 9,
                23: $V2,
                24: $V3,
                25: $V4,
                26: $V5,
                29: $V6
            },
            o($Vm, [2, 24])],
            defaultActions: {
                2: [2, 1],
                15: [2, 2]
            },
            parseError: function parseError(str, hash) {
                if (hash.recoverable) {
                    this.trace(str);
                } else {
                    throw new Error(str);
                }
            },
            parse: function parse(input) {
                var self = this,
                    stack = [0],
                    tstack = [],
                    vstack = [null],
                    lstack = [],
                    table = this.table,
                    yytext = '',
                    yylineno = 0,
                    yyleng = 0,
                    recovering = 0,
                    TERROR = 2,
                    EOF = 1;
                var args = lstack.slice.call(arguments, 1);
                var lexer = Object.create(this.lexer);
                var sharedState = {
                    yy: {}
                };
                for (var k in this.yy) {
                    if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
                        sharedState.yy[k] = this.yy[k];
                    }
                }
                lexer.setInput(input, sharedState.yy);
                sharedState.yy.lexer = lexer;
                sharedState.yy.parser = this;
                if (typeof lexer.yylloc == 'undefined') {
                    lexer.yylloc = {};
                }
                var yyloc = lexer.yylloc;
                lstack.push(yyloc);
                var ranges = lexer.options && lexer.options.ranges;
                if (typeof sharedState.yy.parseError === 'function') {
                    this.parseError = sharedState.yy.parseError;
                } else {
                    this.parseError = Object.getPrototypeOf(this).parseError;
                }

                function popStack(n) {
                    stack.length = stack.length - 2 * n;
                    vstack.length = vstack.length - n;
                    lstack.length = lstack.length - n;
                }
                _token_stack: function lex() {
                    var token;
                    token = lexer.lex() || EOF;
                    if (typeof token !== 'number') {
                        token = self.symbols_[token] || token;
                    }
                    return token;
                }
                var symbol, preErrorSymbol, state, action, a, r, yyval = {},
                    p, len, newState, expected;
                while (true) {
                    state = stack[stack.length - 1];
                    if (this.defaultActions[state]) {
                        action = this.defaultActions[state];
                    } else {
                        if (symbol === null || typeof symbol == 'undefined') {
                            symbol = lex();
                        }
                        action = table[state] && table[state][symbol];
                    }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                        var errStr = '';
                        expected = [];
                        for (p in table[state]) {
                            if (this.terminals_[p] && p > TERROR) {
                                expected.push('\'' + this.terminals_[p] + '\'');
                            }
                        }
                        if (lexer.showPosition) {
                            errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                        } else {
                            errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                        }
                        this.parseError(errStr, {
                            text: lexer.match,
                            token: this.terminals_[symbol] || symbol,
                            line: lexer.yylineno,
                            loc: yyloc,
                            expected: expected
                        });
                    }
                    if (action[0] instanceof Array && action.length > 1) {
                        throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
                    }
                    switch (action[0]) {
                    case 1:
                        stack.push(symbol);
                        vstack.push(lexer.yytext);
                        lstack.push(lexer.yylloc);
                        stack.push(action[1]);
                        symbol = null;
                        if (!preErrorSymbol) {
                            yyleng = lexer.yyleng;
                            yytext = lexer.yytext;
                            yylineno = lexer.yylineno;
                            yyloc = lexer.yylloc;
                            if (recovering > 0) {
                                recovering--;
                            }
                        } else {
                            symbol = preErrorSymbol;
                            preErrorSymbol = null;
                        }
                        break;
                    case 2:
                        len = this.productions_[action[1]][1];
                        yyval.$ = vstack[vstack.length - len];
                        yyval._$ = {
                            first_line: lstack[lstack.length - (len || 1)].first_line,
                            last_line: lstack[lstack.length - 1].last_line,
                            first_column: lstack[lstack.length - (len || 1)].first_column,
                            last_column: lstack[lstack.length - 1].last_column
                        };
                        if (ranges) {
                            yyval._$.range = [
                            lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
                        }
                        r = this.performAction.apply(yyval, [
                        yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));
                        if (typeof r !== 'undefined') {
                            return r;
                        }
                        if (len) {
                            stack = stack.slice(0, -1 * len * 2);
                            vstack = vstack.slice(0, -1 * len);
                            lstack = lstack.slice(0, -1 * len);
                        }
                        stack.push(this.productions_[action[1]][0]);
                        vstack.push(yyval.$);
                        lstack.push(yyval._$);
                        newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                        stack.push(newState);
                        break;
                    case 3:
                        return true;
                    }
                }
                return true;
            }
        };


        function SyntaxError(message, hash) {
            this.name = 'SyntaxError';
            this.message = message;
            this.hash = hash;
        }
        SyntaxError.prototype = Error.prototype;

        parser.parseError = function (message, hash) {
            if (hash.recoverable) {
                this.trace(str);
            } else {
                throw new SyntaxError(message, hash);
            }
        };

        function Parser() {
            this.yy = {};
        }
        Parser.prototype = parser;
        parser.Parser = Parser;
        return new Parser;
    })();
    var ngModule = angular.module('danilovalente.queryFilter', ['ng']);

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

})(window.angular);