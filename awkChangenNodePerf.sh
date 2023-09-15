awk 'BEGIN{
print "let myGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof this !== 'undefined' ? this : {}";
print "let performance = myGlobal.performance"
print "if(performance === undefined) performance = {}"}
     {if(NR>0)print}' ./dist/browser/js-awe.js > ./dist/browser/js-awe2.js;

rm ./dist/browser/js-awe.js
mv ./dist/browser/js-awe2.js ./dist/browser/js-awe.js