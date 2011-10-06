Spurge.js
=========

This is a work-in-progress 2d javascript/HTML5 game engine. 
Currently it exists as a testbed and learning exercise for me, as I found I was not able to really evaluate existing game engines and frameworks without some hands-on experience with the problems they attempted to solve for me. 

Status
------

One day it will sport demos, and maybe even real games. In the meantime, there are things to watch and play with in the tests/ directory. (Don't let the name mislead, there are no unit tests as yet)

As progress continues, expect the engine and any particular game to be teased apart. Right now stuff that looks like it should be generic is in ./lib, and stuff that layers on top of that in ./game. These distinctions are fluid right now. 

Graphics
--------

This project came out of my son's interest in making a game. So most of the graphics are his. 

Credits
-------

Spurge is using a few 3rd party libraries and code snippets. Credit is due to: 

* Compose.js: Kris Zyp's lib for flexible object composition. Lives at: https://github.com/kriszyp/compose/

* jQuery: May or may not end up as a dependency, is only lightly used in some tests right now. Lives at: http://jquery.com

* Stencyl: I liked the clear organization of objects and roles. While its not unique to Stencyl, I have based some of the architecture on what I saw in StencylWorks (in the UI) so we have Actors, Sprites(Tiles), Behaviors (eventually), etc. Lives at:  http://www.stencyl.com/stencylworks/

* Audio "Sprites": I want to treat audio just like I'd treat images and assemble a small number of files with the various effects I want to play. I'm currently using a gist by remy, from: https://gist.github.com/753003

* Vector.js: Is not actually in use, but I anticipate using something like it eventually. lib/vector.js is an AMD re-packaging of Seb Lee Delisle's Vector2.js from: https://github.com/sebleedelisle/JavaScript-PixelPounding-demos/blob/master/libs/Vector2.js

* curl.js: Spurge is using the Asynchronous Module Pattern for all its bits and pieces. I'm currently using curl.js as the loader, from: https://github.com/unscriptable/curl

