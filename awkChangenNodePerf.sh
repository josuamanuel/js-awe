awk 'BEGIN{
print "let myGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof this !== 'undefined' ? this : {}";
print "let performance = myGlobal.performance"
print "if(performance === undefined) performance = {}"}
     {if(NR>1)print}' ./dist/js-awe.js > ./dist/js-awe2.js;

rm ./dist/js-awe.js
mv ./dist/js-awe2.js ./dist/js-awe.js