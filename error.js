window.onload = function () {
    // Keep graphics fit the screen for small devices
    mobileScale();
  
    // Loop timeline
    let tl = new TimelineLite({
        onComplete: function() {
            
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
    tl.to('.emoji', 0, {
        x: 9,
        y: 7,
    });
    tl.to('.emoji', 0.5, {
      opacity: 1,
  });
  
   
  
    
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
