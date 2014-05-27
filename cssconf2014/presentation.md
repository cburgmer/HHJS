---
author: Christoph Burgmer
title: If your CSS is happy and you know it clap your hands
---
= data-x='1000' data-y='-5000' data-scale='5' data-rotate-z='180'
# If your CSS is happy and you know it ...
# ... clap your hands

Christoph Burgmer

[@cburgmer](http://twitter.com/cburgmer), cburgmer@thoughtworks.com

<img src="images/cssconf.png" width="50" alt="CSSConf 2014">
CSSConf 2014

---
# Your CSS

<img src="images/acid2.png" width="420">
<img src="images/acid2_unhappy.png" width="420" style="float:right">

Happy
<span style="float: right">... or sad?</span>


---
# Or worse?


<img src="images/acid2_broken.png" style="width: 85%">
<small style="display: block;">Source: http://en.wikipedia.org/wiki/File:Ie7acid2.png</small>

Do you know?


---
#We users notice

<div class="tile">
    <img src="images/bugs/facebook_sort.jpg">
    <small>http://kaizentesting.wordpress.com/2012/08/04/different-facets-of-testing-web-applications%C2%AC-and-facebook-bugs/</small>
</div>

<div class="tile">
    <img src="images/bugs/github_notifications.png">
</div>

<div class="tile">
    <img src="images/bugs/google_advanced_search.png">
    <small>http://www.seroundtable.com/google-advanced-search-bug-17091.html</small>
</div>

<div class="tile">
    <img src="images/bugs/sofia_valley.png">
    <small>http://atodorov.org/blog/2013/06/02/sofiavalley-ui-bug/</small>
</div>

---
#We users notice (2)

<div class="tile" style="width: 100%;">
    <img src="images/bugs/twitter_backwards.png">
</div>

---

<div class="paper">
    <h1>Missing! Reward!</h1>
    <h2>Safety net</h2>

    <img src="images/tightropewalker.png" style="width: 400px;">
    <small style="display: block;">Source: http://en.wikipedia.org/wiki/File:Wonderland_Walker_2.jpg</small>

    <p>We need our safety net to safely develop and refactor with confidence.</p>
    <p>Missing since <em>the web exists</em>.<p>
    <p>Please call 812-4711-4221.</p>
</div>

---

# Professionalism

## We want high quality

But

- growing <em>complexity</em> in CSS as a language
- being <em>responsive</em>
- on <em>larger pages</em>
- that are shown on a <em>growing number of devices</em>
- in <em>multiple browsers</em>.

## Help!

---

# Testing, testing, testing

<img src="images/webstack.jpg" style="width: 600px; margin-left: 50px; float: right; border: 1px solid grey;">

Developers are using testing tools since for ever.

    assertThat(
        returnedStatusCode,
        is(200)
    );

---

# We have been missing CSS test tooling all along

<img src="images/webstack.jpg" style="height: 300px; margin-left: 50px; border: 1px solid grey; opacity: 0.4;">
<img src="images/webstack_missing.jpg" style="height: 300px; border: 1px solid grey; margin: 0 auto;">

---

# We can fix this!

<div style="color: #ccc">
Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time Demo time
</div>

---

# So?

* We can check for changes to CSS
* Screenshots are one way of doing this
* Tests are just a "change" notification
* Automated vs. manual regression checking

---

# Tooling

* Screenshot based comparison
    * CSSCritic
    * Wraith
    * PhantomCSS
* Computed style checks
    * Hardy

A longer list on [http://csste.st](http://csste.st/).

---

# Experiences

* You learn a lot about your UI components
* Drive out UI from a test
* Screenshots can be flaky
    * content changes
    * renderings are unique snowflakes
* Different solutions to different problems

### Find out what works for you!

---

# Thanks for listening.

Make your CSS happy! <img class="turn" src="images/acid2.png" style="width: 504px; vertical-align: middle; margin-left: 40px;">

---

# Meta

This presentation was made with

- impress.js
- mdpress
- some homegrown CSS adaptions of the style "obtvse"
