var fs = require('fs');
var path = require('path');
var parser = require('./parser');

function eval(input, obj) {
    var root = parser.parse(input);
    console.log(JSON.stringify(root));
    return root.evaluate(obj);
}

exports.eval = eval;

exports.main = function (args) {
    if (!args[1] || !args[2]) {
        console.error('Usage: ' + args[0] + ' file object_file');
        process.exit(1);
    }
    var source = fs.readFileSync(path.normalize(args[1]), 'utf8');
    var object = JSON.parse(fs.readFileSync(path.normalize(args[2]), 'utf8'));
    return eval(source, object);
};

if (typeof module !== 'undefined' && require.main === module) {
    console.log(exports.main(process.argv.slice(1)));
}

// foo = bar & foo >= bar & foo <= bar & !(foo != bar)