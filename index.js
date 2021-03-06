var three = THREE;
var scene = new three.Scene();
var camera = new three.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new three.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var cube = new THREE.Mesh( geometry, material );
cube.rotation.x = Math.PI/4;
cube.rotation.y = Math.PI/4;
scene.add(cube);

camera.position.z = 5;

/* */
var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};

var lastPosition = { x: 0, y: 0 }
var startPosition = null
var movingPosition = null
$(renderer.domElement).on('mousedown', function(e) {
  console.log(e.offsetX, e.offsetY)
    isDragging = true;
    startPosition = { x: e.clientX, y: e.clientY }
})
.on('mousemove', function(e) {
  if (!startPosition) {
    return
  }
  movingPosition = { x: e.clientX, y: e.clientY }

  var deltaMove = {
    x: movingPosition.x - startPosition.x,
    y: movingPosition.y - startPosition.y
  }

    var deltaMove2 = {
        x: e.offsetX-previousMousePosition.x,
        y: e.offsetY-previousMousePosition.y
    };
    console.log(deltaMove, deltaMove2)

    // if(isDragging) {

        var deltaRotationQuaternion = new three.Quaternion()
            .setFromEuler(new three.Euler(
                toRadians(deltaMove.y * 1),
                toRadians(deltaMove.x * 1),
                0,
                'XYZ'
            ));

        cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
    // }

    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    }
    startPosition = { x: e.clientX, y: e.clientY }
});
/* */

$(document).on('mouseup', function(e) {
  if (!startPosition) {
    return
  }
    isDragging = false;
    startPosition = null
});

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var lastFrameTime = new Date().getTime() / 1000;
var totalGameTime = 0;
function update(dt, t) {

    setTimeout(function() {
        var currTime = new Date().getTime() / 1000;
        var dt = currTime - (lastFrameTime || currTime);
        totalGameTime += dt;

        update(dt, totalGameTime);

        lastFrameTime = currTime;
    }, 0);
}


function render() {
    renderer.render(scene, camera);
    requestAnimFrame(render);
}

render();
update(0, totalGameTime);

function toRadians(angle) {
	return angle * (Math.PI / 180);
}

function toDegrees(angle) {
	return angle * (180 / Math.PI);
}
