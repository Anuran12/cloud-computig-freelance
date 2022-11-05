$(document).ready(function () {
    //your code here
    var makeItRain = function() {
        //clear out everything
        $('.rain').empty();
      
        var increment = 0;
        var drops = "";
        var backDrops = "";
      
        while (increment < 100) {
          //couple random numbers to use for various randomizations
          //random number between 98 and 1
          var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
          //random number between 5 and 2
          var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
          //increment
          increment += randoFiver;
          //add in a new raindrop with various randomizations to certain CSS properties
          drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
          backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
        }
      
        $('.rain.front-row').append(drops);
        $('.rain.back-row').append(backDrops);
      }
      
      makeItRain();
  });



// Necessary GSAP libs:
// * TweenLite.min.js
// * TimelineLite.min.js
// * AttrPlugin.min.js
// * CSSPlugin.min.js
//
// Total size is about 80kB

window.onload = function () {
  // Keep graphics fit the screen for small devices
  mobileScale();

  // Loop timeline
  let tl = new TimelineLite({
      onComplete: function() {
          this.restart();
      }
  });

  // Open the laptop
  tl.to('.laptop-lid', 0.1, {
      fill: '#313638',
      stroke: 'none',
      ease: Linear.easeNone
  }, '+=1');
  tl.to('.laptop-lid', 0.6, {
      attr: {d: 'M 70,240 l 341.643 0 l 0 -215.73 l -341.643 0 l 0 215.73 z M 426,250 l -368.433 0 l 0 -231.663 c 0 -9.87 8.037 -18.048 18.048 -18.048 l 333.606 0 c 9.87 0 18.048 8.037 18.048 18.048 l 0 231.663 z'},
      ease: Power1.easeOut
  }, '-=0.1');

  // Switch on the screen
  tl.to(['.screen-bg'], 0.1, {
      opacity: 1,
      ease: Power1.easeOut
  });

  // Draw emoji
  tl.to('.sad-emoji', 0, {
      x: 9,
      y: 7,
  });
  tl.to('.sad-emoji', 0.5, {
    opacity: 1,
});

  // make boxes fly from the laptop center + fade in the boxs
  const delta = [
      {x: 12, y: 17},
      {x: -15, y: 13},
      {x: -14, y: -13},
      {x: 21, y: 0},
      {x: -3, y: 23},
      {x: -21, y: 11},
      {x: -21, y: 2},
      {x: -20, y: 5},
      {x: 11, y: -27},
      {x: 24, y: -11},
      {x: 21, y: 9}
  ];
  const textBoxes = Array.from(document.getElementsByClassName('text-block'));
  for (idx in delta) {
      tl.fromTo(textBoxes[idx], 2, {
          x: delta[idx].x,
          y: delta[idx].y
      }, {
          x: 0,
          y: 0,
          opacity: 1,
          ease: Power2.easeOut
      }, 2.5);
  }

  // fade out the whole container
  tl.to('.container', 0.5, {
      opacity: 0
  }, '+=1');
};

window.onresize = mobileScale;

// Keep graphics fit the screen for small devices
function mobileScale() {
  scale = Math.min(
      // the container is (577 x 418) px initially
      window.innerWidth / 577,
      window.innerHeight / 418
  );
  if (scale < 1) {
      TweenLite.set('.container', {
          scale: scale,
          transformOrigin: 'center center'
      })
  }
}