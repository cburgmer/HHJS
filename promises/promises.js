module.exports.defer = function () {
    var resolved, resolveCallback, result;
    return {
        resolve: function (value) {
            result = value;
            resolved = true;
            if (resolveCallback) {
                resolveCallback(value);
            }
        },
        promise: {
            then: function (callback) {
                if (resolved) {
                    callback(result);
                } else {
                    resolveCallback = callback;
                }
            }
        }
    };
};
