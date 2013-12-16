Why promises?
-------------

```js
getTweets("jimmy", "MY_API_KEY", function (err, results) {
  // the rest of your code goes here.
});
```

or worse (callback hell, aka "Pyramid of Doom"):

```js
getUserInfo(userId, function (user) {
    getTweets(user.userName, user.apiKey, function (err, results) {
        loadImages(results.userIds, function (images) {
            ...
        });
    });
});
```

How does promises solve my issue?
---------------------------------

```js
var tweetPromise = getTweets("jimmy", "MY_API_KEY");
```

and then

```js
getUserInfo(userId)
    .then(getTweets)
    .then(loadImages)
    .then(function () {
        ...
    })
    .fail(function (err) {
        ...
    });
```

How to make my code promises aware?
-----------------------------------

```js
var ajaxPromised = function (url) {
    var defer = promise.defer(),
        xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.onload = function () {
        if (xhr.status === 200) {
            defer.resolve(xhr.response);
        } else {
            defer.reject(new Error(xhr.statusText));
        }
    };

    xhr.onerror = function () {
        defer.reject(new Error("Network error"));
    };

    xhr.send();

    return defer.promise;
};
```

Read more
---------

- Q: https://github.com/kriskowal/q
- ES6 promises syntax: http://www.html5rocks.com/en/tutorials/es6/promises/
