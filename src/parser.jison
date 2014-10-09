%lex

key "$"
id  \w[\w\d_]*
str \"(?:\\[\"bfnrt/\\]|\\[a-fA-F0-9]{4}|[^\"\\])*\"

%%

\s+                  /* skip whitespace */

"."                  return 'DOT'
"&"|"&&"|AND         return 'AND'
"|"|"||"|OR          return 'OR'
"!="                 return 'DIFF'
"<="                 return 'LTE'
">="                 return 'GTE'
"<"                  return 'LT'
">"                  return 'GT'
"!"                  return 'NOT'
"="                  return 'EQ'

"("                  return 'LPAR'
")"                  return 'RPAR'

\d+("."\d+)?\b       return 'NUMBER'
false|true           return 'BOOLEAN'
null                 return 'NULL'
{key}({id}|{str})?   return 'ID'
{id}|{str}           return 'STRING'

<<EOF>>              return 'EOF'
.                    return 'INVALID'

/lex

%left AND OR
%left EQ DIFF LT LTE GT GTE
%left UNOT DOT

%start expressions

%%

expressions
    : EOF
        { return new Token.EmptyQuery(); }
    | e EOF
        { return $1; }
    ;

e
    : e 'AND' e
        { $$ = new Token.And($1, $3); }
    | e 'OR' e
        { $$ = new Token.Or($1, $3); }
    | 'NOT' e %prec 'UNOT'
        { $$ = new Token.Not($2); }
    | e 'EQ' e
        { $$ = new Token.Equals($1, $3); }
    | e 'DIFF' e
        { $$ = new Token.Differs($1, $3); }
    | e 'LT' e
        { $$ = new Token.LessThan($1, $3); }
    | e 'LTE' e
        { $$ = new Token.LessThanEquals($1, $3); }
    | e 'GT' e
        { $$ = new Token.GreaterThan($1, $3); }
    | e 'GTE' e
        { $$ = new Token.GreaterThanEquals($1, $3); }
    | 'LPAR' e 'RPAR'
        { $$ = $2; }
    | id
        { $$ = $1; }}
    | 'NUMBER'
        { $$ = new Token.Number(yytext); }
    | 'STRING'
        {
            var len = yytext.length;
            var str = yytext[0] === '"' && yytext[len - 1] === '"'
                ? yytext.substring(1, yytext.length - 1)
                : yytext;
            $$ = new Token.String(str);
        }
    | 'BOOLEAN'
        { $$ = new Token.Boolean(yytext); }
    | 'NULL'
        { $$ = new Token.Null(); }
    ;

id
    : 'ID'
        {
            var len = yytext.length;
            var id = yytext[1] === '"' && yytext[len - 1] === '"'
                ? yytext.substring(2, yytext.length - 1)
                : yytext.substring(1);
            $$ = new Token.Identifier(id, null);
        }
    | id 'DOT' 'ID'
        {
            var len = $3.length;
            var id = $3[1] === '"' && $3[len - 1] === '"'
                ? $3.substring(2, $3.length - 1)
                : $3.substring(1);
            $$ = new Token.Identifier(id, $1);
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
    throw new SyntaxError(message, hash);
}