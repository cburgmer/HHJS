var promises = require('../promises');

describe('promises', function () {
    var callback;

    beforeEach(function () {
        callback = jasmine.createSpy('callback');
    });

    it('should execute handler', function () {
        promises.fulfilledPromise.then(callback);

        expect(callback).toHaveBeenCalled();
    });
});
