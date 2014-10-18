%options case-insensitive

key "$"
id  \w[\w\d_]*
str \"(?:\\[\"bfnrt/\\]|\\[a-f0-9]{4}|[^\"\\])*\"

%%

\s+                  /* skip whitespace */

"."                  return 'DOT'

"&"|"&&"|AND         return 'AND'
"|"|"||"|OR          return 'OR'

"<="                 return 'LTE'
">="                 return 'GTE'
"<"                  return 'LT'
">"                  return 'GT'
"!="                 return 'DIFF'
"~="|LIKE            return 'LIKE'
"=="|IS              return 'IS'
"="                  return 'EQ'
IN                   return 'IN'
"!"                  return 'NOT'

"("                  return 'LPAR'
")"                  return 'RPAR'

\d+("."\d+)?\b       return 'NUMBER'
false|true           return 'BOOLEAN'
null                 return 'NULL'
{key}({id}|{str})?   return 'ID'
{id}|{str}           return 'STRING'

<<EOF>>              return 'EOF'
.                    return 'INVALID'

%%

lexers['default'] = lexer;