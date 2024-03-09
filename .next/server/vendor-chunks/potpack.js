/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/potpack";
exports.ids = ["vendor-chunks/potpack"];
exports.modules = {

/***/ "(ssr)/./node_modules/potpack/index.js":
/*!***************************************!*\
  !*** ./node_modules/potpack/index.js ***!
  \***************************************/
/***/ (function(module) {

eval("(function (global, factory) {\n true ? module.exports = factory() :\n0;\n})(this, (function () { 'use strict';\n\nfunction potpack(boxes) {\n\n    // calculate total box area and maximum box width\n    var area = 0;\n    var maxWidth = 0;\n\n    for (var i$1 = 0, list = boxes; i$1 < list.length; i$1 += 1) {\n        var box = list[i$1];\n\n        area += box.w * box.h;\n        maxWidth = Math.max(maxWidth, box.w);\n    }\n\n    // sort the boxes for insertion by height, descending\n    boxes.sort(function (a, b) { return b.h - a.h; });\n\n    // aim for a squarish resulting container,\n    // slightly adjusted for sub-100% space utilization\n    var startWidth = Math.max(Math.ceil(Math.sqrt(area / 0.95)), maxWidth);\n\n    // start with a single empty space, unbounded at the bottom\n    var spaces = [{x: 0, y: 0, w: startWidth, h: Infinity}];\n\n    var width = 0;\n    var height = 0;\n\n    for (var i$2 = 0, list$1 = boxes; i$2 < list$1.length; i$2 += 1) {\n        // look through spaces backwards so that we check smaller spaces first\n        var box$1 = list$1[i$2];\n\n        for (var i = spaces.length - 1; i >= 0; i--) {\n            var space = spaces[i];\n\n            // look for empty spaces that can accommodate the current box\n            if (box$1.w > space.w || box$1.h > space.h) { continue; }\n\n            // found the space; add the box to its top-left corner\n            // |-------|-------|\n            // |  box  |       |\n            // |_______|       |\n            // |         space |\n            // |_______________|\n            box$1.x = space.x;\n            box$1.y = space.y;\n\n            height = Math.max(height, box$1.y + box$1.h);\n            width = Math.max(width, box$1.x + box$1.w);\n\n            if (box$1.w === space.w && box$1.h === space.h) {\n                // space matches the box exactly; remove it\n                var last = spaces.pop();\n                if (i < spaces.length) { spaces[i] = last; }\n\n            } else if (box$1.h === space.h) {\n                // space matches the box height; update it accordingly\n                // |-------|---------------|\n                // |  box  | updated space |\n                // |_______|_______________|\n                space.x += box$1.w;\n                space.w -= box$1.w;\n\n            } else if (box$1.w === space.w) {\n                // space matches the box width; update it accordingly\n                // |---------------|\n                // |      box      |\n                // |_______________|\n                // | updated space |\n                // |_______________|\n                space.y += box$1.h;\n                space.h -= box$1.h;\n\n            } else {\n                // otherwise the box splits the space into two spaces\n                // |-------|-----------|\n                // |  box  | new space |\n                // |_______|___________|\n                // | updated space     |\n                // |___________________|\n                spaces.push({\n                    x: space.x + box$1.w,\n                    y: space.y,\n                    w: space.w - box$1.w,\n                    h: box$1.h\n                });\n                space.y += box$1.h;\n                space.h -= box$1.h;\n            }\n            break;\n        }\n    }\n\n    return {\n        w: width, // container width\n        h: height, // container height\n        fill: (area / (width * height)) || 0 // space utilization\n    };\n}\n\nreturn potpack;\n\n}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcG90cGFjay9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBLEtBQTREO0FBQzVELENBQ3NHO0FBQ3RHLENBQUMsdUJBQXVCOztBQUV4Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsb0NBQW9DLG1CQUFtQjtBQUN2RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQ0FBaUMsbUJBQW1COztBQUVwRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsdUNBQXVDOztBQUUxRDtBQUNBOztBQUVBLHNDQUFzQyxxQkFBcUI7QUFDM0Q7QUFDQTs7QUFFQSx3Q0FBd0MsUUFBUTtBQUNoRDs7QUFFQTtBQUNBLDBEQUEwRDs7QUFFMUQsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQSx5Q0FBeUM7O0FBRXpDLGNBQWM7QUFDZCxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxjQUFjO0FBQ2QsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NwYWNlcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL3BvdHBhY2svaW5kZXguanM/NzI5YyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xudHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxudHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbihnbG9iYWwgPSB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWxUaGlzIDogZ2xvYmFsIHx8IHNlbGYsIGdsb2JhbC5wb3RwYWNrID0gZmFjdG9yeSgpKTtcbn0pKHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gcG90cGFjayhib3hlcykge1xuXG4gICAgLy8gY2FsY3VsYXRlIHRvdGFsIGJveCBhcmVhIGFuZCBtYXhpbXVtIGJveCB3aWR0aFxuICAgIHZhciBhcmVhID0gMDtcbiAgICB2YXIgbWF4V2lkdGggPSAwO1xuXG4gICAgZm9yICh2YXIgaSQxID0gMCwgbGlzdCA9IGJveGVzOyBpJDEgPCBsaXN0Lmxlbmd0aDsgaSQxICs9IDEpIHtcbiAgICAgICAgdmFyIGJveCA9IGxpc3RbaSQxXTtcblxuICAgICAgICBhcmVhICs9IGJveC53ICogYm94Lmg7XG4gICAgICAgIG1heFdpZHRoID0gTWF0aC5tYXgobWF4V2lkdGgsIGJveC53KTtcbiAgICB9XG5cbiAgICAvLyBzb3J0IHRoZSBib3hlcyBmb3IgaW5zZXJ0aW9uIGJ5IGhlaWdodCwgZGVzY2VuZGluZ1xuICAgIGJveGVzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGIuaCAtIGEuaDsgfSk7XG5cbiAgICAvLyBhaW0gZm9yIGEgc3F1YXJpc2ggcmVzdWx0aW5nIGNvbnRhaW5lcixcbiAgICAvLyBzbGlnaHRseSBhZGp1c3RlZCBmb3Igc3ViLTEwMCUgc3BhY2UgdXRpbGl6YXRpb25cbiAgICB2YXIgc3RhcnRXaWR0aCA9IE1hdGgubWF4KE1hdGguY2VpbChNYXRoLnNxcnQoYXJlYSAvIDAuOTUpKSwgbWF4V2lkdGgpO1xuXG4gICAgLy8gc3RhcnQgd2l0aCBhIHNpbmdsZSBlbXB0eSBzcGFjZSwgdW5ib3VuZGVkIGF0IHRoZSBib3R0b21cbiAgICB2YXIgc3BhY2VzID0gW3t4OiAwLCB5OiAwLCB3OiBzdGFydFdpZHRoLCBoOiBJbmZpbml0eX1dO1xuXG4gICAgdmFyIHdpZHRoID0gMDtcbiAgICB2YXIgaGVpZ2h0ID0gMDtcblxuICAgIGZvciAodmFyIGkkMiA9IDAsIGxpc3QkMSA9IGJveGVzOyBpJDIgPCBsaXN0JDEubGVuZ3RoOyBpJDIgKz0gMSkge1xuICAgICAgICAvLyBsb29rIHRocm91Z2ggc3BhY2VzIGJhY2t3YXJkcyBzbyB0aGF0IHdlIGNoZWNrIHNtYWxsZXIgc3BhY2VzIGZpcnN0XG4gICAgICAgIHZhciBib3gkMSA9IGxpc3QkMVtpJDJdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSBzcGFjZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBzcGFjZSA9IHNwYWNlc1tpXTtcblxuICAgICAgICAgICAgLy8gbG9vayBmb3IgZW1wdHkgc3BhY2VzIHRoYXQgY2FuIGFjY29tbW9kYXRlIHRoZSBjdXJyZW50IGJveFxuICAgICAgICAgICAgaWYgKGJveCQxLncgPiBzcGFjZS53IHx8IGJveCQxLmggPiBzcGFjZS5oKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgICAgICAgIC8vIGZvdW5kIHRoZSBzcGFjZTsgYWRkIHRoZSBib3ggdG8gaXRzIHRvcC1sZWZ0IGNvcm5lclxuICAgICAgICAgICAgLy8gfC0tLS0tLS18LS0tLS0tLXxcbiAgICAgICAgICAgIC8vIHwgIGJveCAgfCAgICAgICB8XG4gICAgICAgICAgICAvLyB8X19fX19fX3wgICAgICAgfFxuICAgICAgICAgICAgLy8gfCAgICAgICAgIHNwYWNlIHxcbiAgICAgICAgICAgIC8vIHxfX19fX19fX19fX19fX198XG4gICAgICAgICAgICBib3gkMS54ID0gc3BhY2UueDtcbiAgICAgICAgICAgIGJveCQxLnkgPSBzcGFjZS55O1xuXG4gICAgICAgICAgICBoZWlnaHQgPSBNYXRoLm1heChoZWlnaHQsIGJveCQxLnkgKyBib3gkMS5oKTtcbiAgICAgICAgICAgIHdpZHRoID0gTWF0aC5tYXgod2lkdGgsIGJveCQxLnggKyBib3gkMS53KTtcblxuICAgICAgICAgICAgaWYgKGJveCQxLncgPT09IHNwYWNlLncgJiYgYm94JDEuaCA9PT0gc3BhY2UuaCkge1xuICAgICAgICAgICAgICAgIC8vIHNwYWNlIG1hdGNoZXMgdGhlIGJveCBleGFjdGx5OyByZW1vdmUgaXRcbiAgICAgICAgICAgICAgICB2YXIgbGFzdCA9IHNwYWNlcy5wb3AoKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA8IHNwYWNlcy5sZW5ndGgpIHsgc3BhY2VzW2ldID0gbGFzdDsgfVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJveCQxLmggPT09IHNwYWNlLmgpIHtcbiAgICAgICAgICAgICAgICAvLyBzcGFjZSBtYXRjaGVzIHRoZSBib3ggaGVpZ2h0OyB1cGRhdGUgaXQgYWNjb3JkaW5nbHlcbiAgICAgICAgICAgICAgICAvLyB8LS0tLS0tLXwtLS0tLS0tLS0tLS0tLS18XG4gICAgICAgICAgICAgICAgLy8gfCAgYm94ICB8IHVwZGF0ZWQgc3BhY2UgfFxuICAgICAgICAgICAgICAgIC8vIHxfX19fX19ffF9fX19fX19fX19fX19fX3xcbiAgICAgICAgICAgICAgICBzcGFjZS54ICs9IGJveCQxLnc7XG4gICAgICAgICAgICAgICAgc3BhY2UudyAtPSBib3gkMS53O1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJveCQxLncgPT09IHNwYWNlLncpIHtcbiAgICAgICAgICAgICAgICAvLyBzcGFjZSBtYXRjaGVzIHRoZSBib3ggd2lkdGg7IHVwZGF0ZSBpdCBhY2NvcmRpbmdseVxuICAgICAgICAgICAgICAgIC8vIHwtLS0tLS0tLS0tLS0tLS18XG4gICAgICAgICAgICAgICAgLy8gfCAgICAgIGJveCAgICAgIHxcbiAgICAgICAgICAgICAgICAvLyB8X19fX19fX19fX19fX19ffFxuICAgICAgICAgICAgICAgIC8vIHwgdXBkYXRlZCBzcGFjZSB8XG4gICAgICAgICAgICAgICAgLy8gfF9fX19fX19fX19fX19fX3xcbiAgICAgICAgICAgICAgICBzcGFjZS55ICs9IGJveCQxLmg7XG4gICAgICAgICAgICAgICAgc3BhY2UuaCAtPSBib3gkMS5oO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSB0aGUgYm94IHNwbGl0cyB0aGUgc3BhY2UgaW50byB0d28gc3BhY2VzXG4gICAgICAgICAgICAgICAgLy8gfC0tLS0tLS18LS0tLS0tLS0tLS18XG4gICAgICAgICAgICAgICAgLy8gfCAgYm94ICB8IG5ldyBzcGFjZSB8XG4gICAgICAgICAgICAgICAgLy8gfF9fX19fX198X19fX19fX19fX198XG4gICAgICAgICAgICAgICAgLy8gfCB1cGRhdGVkIHNwYWNlICAgICB8XG4gICAgICAgICAgICAgICAgLy8gfF9fX19fX19fX19fX19fX19fX198XG4gICAgICAgICAgICAgICAgc3BhY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB4OiBzcGFjZS54ICsgYm94JDEudyxcbiAgICAgICAgICAgICAgICAgICAgeTogc3BhY2UueSxcbiAgICAgICAgICAgICAgICAgICAgdzogc3BhY2UudyAtIGJveCQxLncsXG4gICAgICAgICAgICAgICAgICAgIGg6IGJveCQxLmhcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzcGFjZS55ICs9IGJveCQxLmg7XG4gICAgICAgICAgICAgICAgc3BhY2UuaCAtPSBib3gkMS5oO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB3OiB3aWR0aCwgLy8gY29udGFpbmVyIHdpZHRoXG4gICAgICAgIGg6IGhlaWdodCwgLy8gY29udGFpbmVyIGhlaWdodFxuICAgICAgICBmaWxsOiAoYXJlYSAvICh3aWR0aCAqIGhlaWdodCkpIHx8IDAgLy8gc3BhY2UgdXRpbGl6YXRpb25cbiAgICB9O1xufVxuXG5yZXR1cm4gcG90cGFjaztcblxufSkpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/potpack/index.js\n");

/***/ })

};
;