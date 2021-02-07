var FormulaParser = require("./formula-parser").Parser;
var parser = new FormulaParser();

parser.setFunction("average", function (p: any) {
  // console.log(p);
  
});

var result = parser.parse("average([1,2,3])");
console.log(result);
