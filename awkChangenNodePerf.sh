awk 'BEGIN{
print "let myGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof this !== 'undefined' ? this : {}";
print "let performance = myGlobal.performance"
print "if(performance === undefined) performance = {}"}
     {if(NR>1)print}' ./dist/js-awe.min.js > ./dist/js-awe.min2.js;

rm ./dist/js-awe.min.js
mv ./dist/js-awe.min2.js ./dist/js-awe.min.js