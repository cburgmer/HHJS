---
author: Christoph Burgmer
title: Hacking a HTML renderer in plain browser-side JS
---
= data-x='1000' data-y='-5000' data-scale='5' data-rotate-z='180'
# Hacking a HTML renderer in plain browser-side JS
# Just because

Christoph Burgmer

[@cburgmer](http://twitter.com/cburgmer), cburgmer@thoughtworks.com

<img src="images/jsconf.jpg" width="50" alt="JSConf 2014">
JSConf 2014

---
= data-x='1000'
# What are we up to?

1. Misuse new browser features
2. Use our JS fu to manipulate SVG, HTML, CSS, DOM and CSSOM
3. Hopefully have some fun on the way

---
= data-x='2000'
# Our task

- Trigger HTML rendering capabilities from JavaScript
  - Get a screenshot from a web page
  - Render HTML on to a canvas
- Provide the missing (i.e. a "prollyfill")

        var ctx = canvas.getContext("2d");
        ctx.drawHTML(htmlString, 0, 0);

Sounds easy?

---
= data-x='3000'
# Quick solution

## In Firefox

    var canvas = document.getElementById('mycanvas');
    var ctx = canvas.getContext("2d");
    ctx.drawWindow(content, 0, 0, w, h, "rgb(0,0,0)");

That was easy

---
= data-x='4000'
# But :(

- Only works with "Chrome privileges" and only in Firefox
- Not executable in a web page
    - Security concerns
    - Would allow any script to read any content
- So much for that

---
= data-x='5000'
# SVG to the rescue

`&lt;foreignObject&gt;` allows to embed foreign content, including (X)HTML

    &lt;svg xmlns="http://www.w3.org/2000/svg"&gt;
        &lt;foreignObject width="100%" height="100%"&gt;
            &lt;html&gt;
                &lt;strong&gt;
                    This is an image containing HTML
                &lt;/strong&gt;
            &lt;/html&gt;
        &lt;/foreignObject&gt;
    &lt;/svg&gt;

Can we build on that?

---
= data-x='6000' data-scale='0.5'
# XHTML

- SVG is XML and only allows XML in `&lt;foreignObject&gt;`
- Firefox

        var doc = document.implementation.createHTMLDocument("");
        doc.documentElement.innerHTML = ourHTML;
        doc.documentElement.setAttribute("xmlns",
            doc.documentElement.namespaceURI);
        var xhtml = (new XMLSerializer())
            .serializeToString(doc.documentElement);

- Need "shim" for Chrome & Safari :(

---
= data-x='7000' data-scale='0.5'
# Inline data

- The future

        var blob = new Blob(["&lt;svg xmlns=...&gt;"],
                {"type": "image/svg+xml"});
        return URL.createObjectURL(blob);

- The present: _data URI_s

        &lt;img src="data:image/svg+xml;charset=utf-8,&lt;svg xmlns='http://www..."/&gt;

---
= data-x='8000' data-scale='0.5'
# Bringing this together

- Now we can render this

        var image = new Image();
        image.src = "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent("&lt;svg xmlns='http://www...'");
        canvas.getContext("2d").drawImage(image, 0, 0);

---
= data-x='9000'
# Congratulations, we are done!

1. We embeded HTML as XHTML using `&lt;foreignObject&gt;` into an SVG
2. ... which we converted into a data URI to yield an `&lt;img&gt;`
3. ... which we drew with the canvas' `drawImage()`.

All good?

---
= data-x='10000'
# SVG + external resources

SVGs are not allowed to include external references.

HTML allows

- `&lt;img&gt;` and `&lt;input type="image"&gt;`
- `&lt;link rel="stylesheet" href="..."&gt;`
- `div { background-img: "url(...)"}`
- `@import url(...)`
- `@font face { src: url(...)}`

We could try embed them.

---
= data-x='11000'
# Finding external elements (1)

- `&lt;img&gt;` and `&lt;input type="image"&gt;` are easy

        var doc = document.implementation.createHTMLDocument("");
        doc.documentElement.innerHTML = "&lt;html&gt;&lt;img src="..."/&gt;&lt;/html&gt;";
        var images = doc.getElementsByTagName("img");

        images.forEach(function (image) {
            loadAndEmbedImageSrc(image.src);
        });

---
= data-x='12000' data-scale='0.5'
# Embedding &lt;img&gt;

    &lt;img src="externalImage.png"/&gt;

- Replace image src with data URI

        &lt;img src="data:image/png;base64,iVBORw0KGgo..."&gt;

- Get the image content via AJAX

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function () {
            image.src = "data:image/png;base64,"
                + btoa(xhr.response); // base64
        });
        xhr.open('GET', "externalImage.png");
        xhr.send();

---
= data-x='13000' data-scale='0.5'
# binary AJAX

- AJAX was designed for XML, i. e. text
- Not designed for binary
- XMLHttpRequest2 knows about binary *blobs*, missing in Safari
- Workaround:

        xhr.addEventListener("load", function () {
            var content = xhr.response,
                binaryContent = "";

            for (var i = 0; i < content.length; i++) {
                binaryContent += String.fromCharCode(
                    content.charCodeAt(i) & 0xFF);
            }
        });

---
= data-x='14000'
# Finding external elements (2)

- How do we embed `background-image`?
- Working on CSS resources needs parsing CSS

        var rules = parseCss("span {" +
            "background-image: url('externalImage.png');" +
        "}");

---
= data-x='15000' data-scale='0.5'
# Our minimal CSS parser

- The browser implements a full-blown CSS parser
- We can access it through the CSSOM

        function parseCss(content) {
            var styleElement = document.createElement("style");

            styleElement.textContent = content;
            // the style will only be parsed once
            //   it is added to a document
            document.implementation.createHTMLDocument("")
                .body.appendChild(styleElement);
            return styleElement.sheet.cssRules;
        }


---
= data-x='16000' data-scale='0.5'
# Putting the CSS stuff together

- We now have our rules

        var rules = parseCss("span {" +
            "background-image: url('externalImage.png');" +
        "}");

- Then iterate over rules

        rules.forEach(function (rule) {
            var backgroundImage = rule.style.getPropertyValue(
                'background-image');
            if (backgroundImage) {
                doInlineImageUrl(backgroundImage);
            }
        });

- Finally same stuff as for our `&lt;img&gt;` before

---
= data-x='17000'
# Finding external elements (3)

- Next up is embedding `&lt;link rel="stylesheet" href="sheetUrl"&gt;`
- Simple at first
    - Load the `sheetUrl` via AJAX
    - Then replace `&lt;link&gt;` with `&lt;style&gt;PUT_CONTENT_HERE&lt;/style&gt;`
- However: relative links inside the stylesheet will break

---
= data-x='18000' data-scale='0.5'
# relative URLs

- Relative resource URLs are relative to the sheet's URL
- Example
    `../images/sprite.png` in `assets/style/default.css` becomes `assets/images/sprite.png` after embedding

- Using the URL parser from Node.js

        fontFaceRules.forEach(function (rule) {
            var url = getFontFaceSrc(rule),
                adaptedUrl = url.resolve(sheetUrl, url);

            updateBackgroundImageSrc(rule, adaptedUrl);
        });

---
= data-x='19000'
# There you go

1. We rendered HTML through SVG's `&lt;foreignObject&gt;`
2. and inlined all external resources
    1. loading binary content through AJAX,
    2. embedding images and fonts through _data URI_s,
    3. parsing CSS for style resources, and
    4. adapting relative paths

---
= data-x='20000' data-rotate-z='360'
# Demo time - click me

<script src="demo/node_modules/rasterizehtml/dist/rasterizeHTML.allinone.js"></script>
<script src="demo/explode.js"></script>

<div style="text-align: center;">
    <canvas id="demo" width="2000" height="1200" style="width: 1000px; height: 600px;">
    </canvas>
</div>
<small>Animation from http://craftymind.com/factory/html5video/CanvasVideo.html</small>

<script>
window.addEventListener("load", function () {
    var demo = document.getElementById('demo');
    rasterizeHTML.drawURL("demo/frontpage.html", {
        executeJs: true
    }).then(function (result) {
        initExplode(result.image, demo);
        demo.onmousedown = function (event) {
            dropBomb(event, demo);
        };
    }, function (e) {
        console.log(e)
    });
});
</script>

---
= data-x='21000'
# Issues

- same-origin policy (work around with CORS)
- Re-reading from a canvas not allowed (Safari & Chrome)
- Waiting for `&lt;foreignObject&gt;` to make it into IE (in development)
- Form inputs don't render
- Performance (Y u no DOM in web worker?!)

---
= data-x='22000'
# Incomplete list of workarounds

* Draw HTML through SVG
* Convert HTML to XHTML (corner cases exist)
* Spider &amp; inline externals
* Execute JS in temporary iframe
* XHR proxy object to fix up urls
* XHR proxy object to notify on finished requests
* Blob fix for old Webkits
* First style rule ignored in Safari
* Background images not always showing

<p></p>

* Binary AJAX
* Gather viewport size from iframe
* DOMParser not parsing HTML
* Detect parse errors for XHR with Document
* Detect MIME type
* Escape closing script tags (buggy)
* Hashing through JSON.stringify
* background-image url() serialization
* CSSFontFaceRule.setCssText()

---
= data-x='22000'
# Outstanding browser issues

<style>
#step-23 ul {
  width: 45%;
  float: left;
  font-size: 80%;
  line-height: 100%;
}
</style>

* Make canvas drawWindow Web-accessible  :) (https://bugzilla.mozilla.org/show_bug.cgi?id=329693)
* xhr2 responseType='document' fails on local pages  (https://bugzilla.mozilla.org/show_bug.cgi?id=942138)
* History API throws nasty exception when used within an iframe (with no src)  (https://bugzilla.mozilla.org/show_bug.cgi?id=777526)
* Canvas is tainted after drawing SVG including foreignObject (https://code.google.com/p/chromium/issues/detail?id=294129 and https://bugs.webkit.org/show_bug.cgi?id=17352)
* CSSOM backgroundImage incorrectly returns empty url() when created on-the-fly (http://code.google.com/p/chromium/issues/detail?id=161644)
*  Support mutation of CSSFontFaceRule DOM objects from JavaScript (https://bugzilla.mozilla.org/show_bug.cgi?id=443978)
*  context.drawImage() on canvas.toDataURL("image/png") should be idempotent  (https://bugzilla.mozilla.org/show_bug.cgi?id=790468)
* Webkit fails to render SVGs in HTML inside foreignObject (https://github.com/cburgmer/rasterizeHTML.js/issues/39)
* foreignObject not supported (http://status.modern.ie/svgforeignobjectelement)

---
= data-x='23000'
# What is this all about?

<style>
#step-24 ul {
  font-size: 60%;
  line-height: 100%;
}

#step-24 a {
  color: #ccc;
}
</style>

- All this went into [rasterizeHTML.js](http://github.com/cburgmer/rasterizeHTML.js) (and [inlineresources](https://github.com/cburgmer/inlineresources) and [xmlserializer](https://github.com/cburgmer/xmlserializer) and [css-font-face-src](https://github.com/cburgmer/css-font-face-src))
- 248 ppl on Github think it's useful, but for what??!
- My own use case: underlying technique for CSS testing tool: [CSS Critic](http://cburgmer.github.io/csscritic/)

---
= data-x='24000' data-y='2000' data-rotate-z='180'
# Thanks for listening

Oh, and go make something cool with it.

---
# Meta

This presentation was made with

- impress.js
- mdpress
- some homegrown CSS adaptions of the style "obtvse"
