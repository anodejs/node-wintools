var wintools = require('../main');

exports.ps = function(test) {
    wintools.ps(function(err, ps) {
        test.ok(!err, err);
        test.ok(ps);
        test.ok(ps && Object.keys(ps).length > 0);
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

exports.iis = function(test) {
    test.ok(wintools.iis);
    //TODO: write tests
    test.done();
}
