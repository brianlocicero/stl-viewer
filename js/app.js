var pinched = false;
var zooming = false;
var zoomValue = 1;
var zoomInterval;
var container;
var mesh;

// geometry classes
var myCamera = new PCamera(800, 600, 0.1, 20000, 45, [0, 150, 400]);
var myRenderer = new WebGLRenderer(0xEEEEEE, 1.0, true, 800, 600);
var myLight = new SLight(0xFFFFFF, [100, 550, 300], true);
var myFloor = new Floor('img/pebble.jpg', [1000, 1000, 10, 10], Math.PI / 2, -50, 0, true);
var myScene = new Scene(false);
var loader = new THREE.STLLoader();
var group = new THREE.Object3D();

loader.load("assets/Octocat-v2.stl", function (geometry) {
    var material = new THREE.MeshLambertMaterial({color: 0x7777ff});
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -.5 * Math.PI;
    mesh.scale.set(2, 2, 2);
    THREE.GeometryUtils.center(mesh.geometry);
    mesh.position.set(0, 50, 80);
    mesh.castShadow = true;
    myScene.add(mesh);
});

function onSliderChange(event) {
    var myVal = $("#scaleSlider").val();
    mesh.scale.set(myVal, myVal, myVal);
    $("#scaleValue").val("" + myVal + "");
}

function exportSTL() {
    console.log(mesh.geometry);
    console.log( stlFromGeometry(mesh.geometry, {download:true} ) );
}

//skybox get into geometry
var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );   
var materialArray = [];
for (var i = 0; i < 6; i++)
    materialArray.push( new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("img/sky2.jpg"),
        side: THREE.BackSide
    }));
var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
myScene.add( skyBox );

//geometry instances
myCamera.addCamera(myScene);
myLight.addLight(myScene);
myFloor.addFloor(myScene);

//DOM
container = document.getElementById('sceneHolder');
container.appendChild(myRenderer.getRenderer().domElement);

//Three.JS
function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    myRenderer.getRenderer().render(myScene, myCamera.getCamera());
}

//Rotate & Zoom Helpers
function rotateAroundWorldAxis(axis, radians) {
    var rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(mesh.matrix);
    mesh.matrix = rotWorldMatrix;
    mesh.rotation.setFromRotationMatrix(mesh.matrix);
}

function rotateAroundObjectAxis (axis, radians) {
  var rotObjectMatrix = new THREE.Matrix4();
  rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
  mesh.matrix.multiply(rotObjectMatrix);
  mesh.rotation.setFromRotationMatrix(mesh.matrix);
}


function zoomIn() {

    zoomValue -= .01;
    if (zoomValue <= .5) {
        clearInterval(zoomInterval);
        zooming = false;
        return;
    }

    myCamera.getCamera().fov = Math.round(45 * zoomValue);
    myCamera.getCamera().updateProjectionMatrix();
}

function zoomOut() {

    zoomValue += .01;
    if (zoomValue >= 1) {
        clearInterval(zoomInterval);
        zoomValue = 1;
        zooming = false;
        return;
    }

    myCamera.getCamera().fov = Math.round(45 * zoomValue);
    myCamera.getCamera().updateProjectionMatrix();
}

//Hammer Touch Menu
var sceneHolderDrag = Hammer(document.getElementById("sceneHolder")).on("drag", function (event) {
    //problem: cannot access mesh within Hammer, forcing hard-code
    if (event.gesture.direction == "up") {
        var xAxisUp = new THREE.Vector3(1, 0, 0);
        rotateAroundWorldAxis(xAxisUp, -(Math.PI / 180) * 2);
    }

    if (event.gesture.direction == "down") {
        var xAxisDown = new THREE.Vector3(1, 0, 0);
        rotateAroundWorldAxis(xAxisDown, Math.PI / 180 * 2);
    }

    if (event.gesture.direction == "right") {
        var yAxisRight = new THREE.Vector3(0, 1, 0);
        rotateAroundWorldAxis(yAxisRight, Math.PI / 180 * 2);
    }

    if (event.gesture.direction == "left") {
        var yAxisLeft = new THREE.Vector3(0, 1, 0);
        rotateAroundWorldAxis(yAxisLeft, -(Math.PI / 180) * 2);
    }
});

var sceneHolderDoubleTap = Hammer(document.getElementById("sceneHolder")).on("doubletap", function (event) {

    console.log(pinched);

    if (pinched) {
        myCamera.getCamera().fov = 45;
        myCamera.getCamera().updateProjectionMatrix();
        pinched = false;
        return;
    }

    console.log(zoomValue);

    if (!zooming) {
        if (zoomValue === 1) {

            zoomInterval = setInterval(zoomIn, 10);
            zooming = true;
        } else {
            zoomInterval = setInterval(zoomOut, 10);
            zooming = true;
        }
    }
});

var sceneHolderPinchIn = Hammer(document.getElementById("sceneHolder")).on("pinchin", function (event) {
    console.log(event.gesture.scale);
    myCamera.getCamera().fov = Math.floor(45 * event.gesture.scale);
    myCamera.getCamera().updateProjectionMatrix();
    pinched = true;
});

var sceneHolderPinchOut = Hammer(document.getElementById("sceneHolder")).on("pinchout", function (event) {
    if (event.gesture.scale < 2.5) {
    //$("#pinchScale").val( "" + event.gesture.scale + "");
    myCamera.getCamera().fov = Math.floor(45 * event.gesture.scale);
    myCamera.getCamera().updateProjectionMatrix();
    }
    pinched = true;
});

//disable "bounce"
$(document).bind('touchmove', function (e) {
    e.preventDefault();
});

//begin
animate();
