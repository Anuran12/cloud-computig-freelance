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
    tl.to('.feel-bad-emoji', 0, {
        x: 9,
        y: 7,
    });
    tl.to('.feel-bad-emoji', 0.5, {
      opacity: 1,
  });
  
    // make boxes fly from the laptop center + fade in the boxs
    const delta = [
        {x: 12, y: 17},
        {x: -15, y: 13},
       
        
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












  class LeafScene {
    constructor(el) {
        this.viewport = el;
        this.world = document.createElement('div');
        this.leaves = [];

        this.options = {
            numLeaves: 20,
            wind: {
                magnitude: 1.2,
                maxSpeed: 12,
                duration: 300,
                start: 0,
                speed: 0
            },
        };

        this.width = this.viewport.offsetWidth;
        this.height = this.viewport.offsetHeight;

        // animation helper
        this.timer = 0;

        this._resetLeaf = function (leaf) {

            // place leaf towards the top left
            leaf.x = this.width * 2 - Math.random() * this.width * 1.75;
            leaf.y = -10;
            leaf.z = Math.random() * 200;
            if (leaf.x > this.width) {
                leaf.x = this.width + 10;
                leaf.y = Math.random() * this.height / 2;
            }
            // at the start, the leaf can be anywhere
            if (this.timer == 0) {
                leaf.y = Math.random() * this.height;
            }

            // Choose axis of rotation.
            // If axis is not X, chose a random static x-rotation for greater variability
            leaf.rotation.speed = Math.random() * 10;
            var randomAxis = Math.random();
            if (randomAxis > 0.5) {
                leaf.rotation.axis = 'X';
            } else if (randomAxis > 0.25) {
                leaf.rotation.axis = 'Y';
                leaf.rotation.x = Math.random() * 180 + 90;
            } else {
                leaf.rotation.axis = 'Z';
                leaf.rotation.x = Math.random() * 360 - 180;
                // looks weird if the rotation is too fast around this axis
                leaf.rotation.speed = Math.random() * 3;
            }

            // random speed
            leaf.xSpeedVariation = Math.random() * 0.8 - 0.4;
            leaf.ySpeed = Math.random() + 1.5;

            return leaf;
        };

        this._updateLeaf = function (leaf) {
            var leafWindSpeed = this.options.wind.speed(this.timer - this.options.wind.start, leaf.y);

            var xSpeed = leafWindSpeed + leaf.xSpeedVariation;
            leaf.x -= xSpeed;
            leaf.y += leaf.ySpeed;
            leaf.rotation.value += leaf.rotation.speed;

            var t = 'translateX( ' + leaf.x + 'px ) translateY( ' + leaf.y + 'px ) translateZ( ' + leaf.z + 'px )  rotate' + leaf.rotation.axis + '( ' + leaf.rotation.value + 'deg )';
            if (leaf.rotation.axis !== 'X') {
                t += ' rotateX(' + leaf.rotation.x + 'deg)';
            }
            leaf.el.style.webkitTransform = t;
            leaf.el.style.MozTransform = t;
            leaf.el.style.oTransform = t;
            leaf.el.style.transform = t;

            // reset if out of view
            if (leaf.x < -10 || leaf.y > this.height + 10) {
                this._resetLeaf(leaf);
            }
        };

        this._updateWind = function () {
            // wind follows a sine curve: asin(b*time + c) + a
            // where a = wind magnitude as a function of leaf position, b = wind.duration, c = offset
            // wind duration should be related to wind magnitude, e.g. higher windspeed means longer gust duration
            if (this.timer === 0 || this.timer > (this.options.wind.start + this.options.wind.duration)) {

                this.options.wind.magnitude = Math.random() * this.options.wind.maxSpeed;
                this.options.wind.duration = this.options.wind.magnitude * 50 + (Math.random() * 20 - 10);
                this.options.wind.start = this.timer;

                var screenHeight = this.height;

                this.options.wind.speed = function (t, y) {
                    // should go from full wind speed at the top, to 1/2 speed at the bottom, using leaf Y
                    var a = this.magnitude / 2 * (screenHeight - 2 * y / 3) / screenHeight;
                    return a * Math.sin(2 * Math.PI / this.duration * t + (3 * Math.PI / 2)) + a;
                };
            }
        };
    }
    init() {

        for (var i = 0; i < this.options.numLeaves; i++) {
            var leaf = {
                el: document.createElement('div'),
                x: 0,
                y: 0,
                z: 0,
                rotation: {
                    axis: 'X',
                    value: 0,
                    speed: 0,
                    x: 0
                },
                xSpeedVariation: 0,
                ySpeed: 0,
                path: {
                    type: 1,
                    start: 0,
                },
                image: 1
            };
            this._resetLeaf(leaf);
            this.leaves.push(leaf);
            this.world.appendChild(leaf.el);
        }

        this.world.className = 'leaf-scene';
        this.viewport.appendChild(this.world);

        // set perspective
        this.world.style.webkitPerspective = "400px";
        this.world.style.MozPerspective = "400px";
        this.world.style.oPerspective = "400px";
        this.world.style.perspective = "400px";

        // reset window height/width on resize
        var self = this;
        window.onresize = function (event) {
            self.width = self.viewport.offsetWidth;
            self.height = self.viewport.offsetHeight;
        };
    }
    render() {
        this._updateWind();
        for (var i = 0; i < this.leaves.length; i++) {
            this._updateLeaf(this.leaves[i]);
        }

        this.timer++;

        requestAnimationFrame(this.render.bind(this));
    }
}



  // start up leaf scene
  var leafContainer = document.querySelector('.falling-leaves'),
      leaves = new LeafScene(leafContainer);

  leaves.init();
  leaves.render();