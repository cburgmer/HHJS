var promises = require('../promises');

describe('promises', function () {
    var callback;

    beforeEach(function () {
        callback = jasmine.createSpy('callback');
    });

    it('should execute handler', function () {
        var defer = promises.defer();
        defer.resolve();
        defer.promise.then(callback);

        expect(callback).toHaveBeenCalled();
    });

    describe('resolve', function () {
        it('should not execute handler if not resolved', function () {
            var defer = promises.defer();
            defer.promise.then(callback);

            expect(callback).not.toHaveBeenCalled();
        });

        it('should execute handler (after resolve)', function () {
            var defer = promises.defer();
            defer.promise.then(callback);
            defer.resolve();

            expect(callback).toHaveBeenCalled();
        });

        it('should execute only once', function () {
            var defer = promises.defer();
            defer.resolve();
            defer.promise.then(callback);
            defer.resolve();

            expect(callback.callCount).toEqual(1);
        });
    });

    describe('value passing', function () {
        it('should pass resolved value to handler', function () {
            var defer = promises.defer();
            defer.promise.then(callback);
            defer.resolve(42);

            expect(callback).toHaveBeenCalledWith(42);
        });

        it('should pass resolved value to handler', function () {
            var defer = promises.defer();
            defer.resolve(42);
            defer.promise.then(callback);

            expect(callback).toHaveBeenCalledWith(42);
        });
    });
});
