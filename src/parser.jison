%left AND OR
%left LTE GTE LT GT DIFF LIKE EQ IS IN
%left UNOT DOT

%start expressions

%%

expressions
    : EOF
        { return new Ast.EmptyQuery(); }
    | e EOF
        { return $1; }
    ;

e
    : e 'AND' e
        { $$ = new Ast.And($1, $3); }
    | e 'OR' e
        { $$ = new Ast.Or($1, $3); }
    | 'NOT' e %prec 'UNOT'
        { $$ = new Ast.Not($2); }
    | e 'LIKE' e
        { $$ = new Ast.Like($1, $3); }
    | e 'EQ' e
        { $$ = new Ast.Equals($1, $3); }
    | e 'IS' e
        { $$ = new Ast.Is($1, $3); }
    | e 'IN' e
        { $$ = new Ast.In($1, $3); }
    | e 'DIFF' e
        { $$ = new Ast.Differs($1, $3); }
    | e 'LT' e
        { $$ = new Ast.LessThan($1, $3); }
    | e 'LTE' e
        { $$ = new Ast.LessThanEquals($1, $3); }
    | e 'GT' e
        { $$ = new Ast.GreaterThan($1, $3); }
    | e 'GTE' e
        { $$ = new Ast.GreaterThanEquals($1, $3); }
    | 'LPAR' e 'RPAR'
        { $$ = $2; }
    | id
        { $$ = $1; }}
    | 'NUMBER'
        { $$ = new Ast.Number(yytext); }
    | 'STRING'
        {
            var len = yytext.length;
            var str = yytext[0] === '"' && yytext[len - 1] === '"'
                ? yytext.substring(1, yytext.length - 1)
                : yytext;
            $$ = new Ast.String(str);
        }
    | 'BOOLEAN'
        { $$ = new Ast.Boolean(yytext.toLowerCase() === 'true'); }
    | 'NULL'
        { $$ = new Ast.Null(); }
    ;

id
    : 'ID'
        {
            var len = yytext.length;
            var id = yytext[1] === '"' && yytext[len - 1] === '"'
                ? yytext.substring(2, yytext.length - 1)
                : yytext.substring(1);
            $$ = new Ast.Identifier(id, null, yy.caseInsensitive);
        }
    | id 'DOT' 'ID'
        {
            var len = $3.length;
            var id = $3[1] === '"' && $3[len - 1] === '"'
                ? $3.substring(2, $3.length - 1)
                : $3.substring(1);
            $$ = new Ast.Identifier(id, $1, yy.caseInsensitive);
        }
    ;

%%

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