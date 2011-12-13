var wintools = require('../main');

exports.ps = function(test) {
    wintools.ps(function(err, ps) {
        console.log(ps);
        test.ok(!err, err.msg);
        test.ok(ps);
        test.ok(ps && ps.length > 0);
        test.done();
    });
};

exports.kill = function(test) {
    wintools.kill.pid(77777, function(err) {
        test.ok(err);
        test.done();
    });
};

exports.killByImage = function(test) {
    wintools.kill.image('bla.exe', function(err) {
        test.ok(err);
        test.done();
    });
};
