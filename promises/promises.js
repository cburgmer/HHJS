module.exports.defer = function () {
    var resolved, resolveCallback;
    return {
        resolve: function () {
            resolved = true;
            if (resolveCallback) {
                resolveCallback();
            }
        },
        promise: {
            then: function (callback) {
                if (resolved) {
                    callback();
                } else {
                    resolveCallback = callback;
                }
            }
        }
    };
};
