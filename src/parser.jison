%lex

str \"(?:'\\'[\\"bfnrt/]|'\\u'[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*\"

%%

\s+                    /* skip whitespace */
@[0-9]+("."[0-9]+)?\b  return 'NUMBER'
@str                   return 'STRING'
@(false|true)          return 'BOOLEAN'
@(null)                return 'NULL'
\w[\w\d_]*|str         return 'ID'
"."                    return 'DOT'
"&"                    return 'AND'
"|"                    return 'OR'
"!="                   return 'DIFF'
"<="                   return 'LTE'
">="                   return 'GTE'
"<"                    return 'LT'
">"                    return 'GT'
"!"                    return 'NOT'
"="                    return 'EQ'
"("                    return 'LPAR'
")"                    return 'RPAR'
<<EOF>>                return 'EOF'
.                      return 'INVALID'

/lex

%left AND OR
%left EQ DIFF LT LTE GT GTE
%left NOT
%left DOT

%start expressions

%%

expressions
    : e EOF
        { return $1; }
    ;

e
    : e 'AND' e
        { $$ = new Token.And($1, $3); }
    | e 'OR' e
        { $$ = new Token.Or($1, $3); }
    | 'NOT' e %prec 'NOT'
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
    | 'ID'
        { $$ = new Token.Identifier($1, null); }
    | e 'DOT' 'ID' %prec 'DOT'
        { $$ = new Token.Identifier($3, $1); }
    | 'NUMBER'
        { $$ = new Token.Number(yytext.substr(1)); }
    | 'STRING'
        { $$ = new Token.String(yytext.substr(1, yytext.length - 2)); }
    | 'BOOLEAN'
        { $$ = new Token.Boolean(yytext.substr(1)); }
    | 'NULL'
        { $$ = new Token.Null(); }
    ;

%%

var Token = require('./token');