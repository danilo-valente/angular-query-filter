%options case-insensitive

key "$"
id  \w[\w\d_]*
str \"(?:\\[\"bfnrt/\\]|\\[a-f0-9]{4}|[^\"\\])*\"

%%

\s+                 /* skip whitespace */

"."                 return 'DOT'

"&&"|"&"|AND        return 'AND'
"||"|"|"|OR         return 'OR'

"<="                return 'LTE'
">="                return 'GTE'
"<"                 return 'LT'
">"                 return 'GT'
"!="                return 'DIFF'
"~="|LIKE           return 'LIKE'
"=="|IS             return 'IS'
"="                 return 'EQ'
IN                  return 'IN'
"!"                 return 'NOT'

"("                 return 'START_EXPR'
")"                 return 'END_EXPR'

"["                 return 'START_ARR'
"]"                 return 'END_ARR'
","                 return 'ITEM_DLM'

\d+("."\d+)?\b      return 'NUMBER'
false|true          return 'BOOLEAN'
null                return 'NULL'
{key}({id}|{str})?  {
                        var t = yytext;
                        var len = t.length;
                        yytext = t[1] === '"' && t[len - 1] === '"'
                            ? t.substring(2, len - 1)
                            : t.substring(1);
                        return 'ID';
                    }
{id}|{str}          {
                        var t = yytext;
                        var len = t.length;
                        yytext = t[0] === '"' && t[len - 1] === '"'
                            ? t.substring(1, len - 1)
                            : t;
                        return 'STRING';
                    }

<<EOF>>             return 'EOF'
.                   return 'INVALID'

%%

lexers['default'] = lexer;