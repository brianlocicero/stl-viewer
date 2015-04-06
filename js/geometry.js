var PCamera = (function () {
    function PCamera(screenWidth, screenHeight, near, far, angle, position) {
        this.screenHeight = screenHeight;
        this.screenWidth = screenWidth;
        this.near = near;
        this.far = far;
        this.angle = angle;
        this.position = position;
        this.aspect = screenWidth / screenWidth;
    }
    PCamera.prototype.addCamera = function (scene) {
        this.camera = new THREE.PerspectiveCamera(this.angle, this.aspect, this.near, this.far);
        this.camera.position.set(this.position[0], this.position[1], this.position[2]);
        this.scene = scene;
        this.scene.add(this.camera);
        this.camera.lookAt(this.scene.position);
        this.fov = this.camera.fov;
    };

    PCamera.prototype.getCamera = function () {
        return this.camera;
    };

    PCamera.prototype.getFov = function () {
        return this.camera.fov;
    };

    PCamera.prototype.setFov = function (fov) {
        this.camera.fov = fov;
    };
    return PCamera;
})();

var WebGLRenderer = (function () {
    function WebGLRenderer(color, opacity, shadowMapEnabled, screenWidth, screenHeight) {
        this.color = color;
        this.opacity = opacity;
        this.shadowMapEnabled = shadowMapEnabled;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColorHex(this.color, this.opacity);
        this.renderer.shadowMapEnabled = true;
        this.renderer.setSize(this.screenWidth, this.screenHeight);
    }
    WebGLRenderer.prototype.getRenderer = function () {
        return this.renderer;
    };
    return WebGLRenderer;
})();

var SLight = (function () {
    function SLight(color, position, castShadow) {
        this.color = color;
        this.position = position;
        this.castShadow = castShadow;
        this.light = new THREE.SpotLight(color);
        this.light.position.set(this.position[0], this.position[1], this.position[2]);
        this.light.castShadow = this.castShadow;
    }
    SLight.prototype.addLight = function (scene) {
        this.scene = scene;
        this.scene.add(this.light);
    };

    SLight.prototype.getLight = function () {
        return this.light;
    };
    return SLight;
})();

var Floor = (function () {
    function Floor(texturePath, size, rotationX, positionY, rotationZ, receiveShadow) {
        this.texturePath = texturePath;
        this.size = size;
        this.rotationX = rotationX;
        this.positionY = positionY;
        this.rotationZ = rotationZ;
        this.receiveShadow = receiveShadow;
        this.texture = THREE.ImageUtils.loadTexture(this.texturePath);
        this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(10, 10);
        this.material = new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide });
        this.geometry = new THREE.PlaneGeometry(this.size[0], this.size[1], this.size[2], this.size[3]);
        this.floor = new THREE.Mesh(this.geometry, this.material);
        this.floor.rotation.x = this.rotationX;
        this.floor.position.y = this.positionY;
        this.floor.rotation.z = this.rotationZ;
        this.floor.receiveShadow = this.receiveShadow;
    }
    Floor.prototype.addFloor = function (scene) {
        this.scene = scene;
        this.scene.add(this.floor);
    };

    Floor.prototype.getFloor = function () {
        return this.floor;
    };
    return Floor;
})();

var CGeometry = (function () {
    function CGeometry(cubeVars) {
        this.cubeVars = cubeVars;
        this.cubeGeometry = new THREE.CubeGeometry(100, 100, 100, 1, 1, 1);
        return this.cubeGeometry;
    }
    return CGeometry;
})();

var LMaterial = (function () {
    function LMaterial(materialColor) {
        this.materialColor = materialColor;
        this.lambertMaterial = new THREE.MeshLambertMaterial({ color: this.materialColor });
        return this.lambertMaterial;
    }
    return LMaterial;
})();

var Mesh = (function () {
    function Mesh(geometry, material, castShadow) {
        this.geometry = geometry;
        this.material = material;
        this.castShadow = castShadow;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.castShadow = this.castShadow;
    }
    Mesh.prototype.addMesh = function (scene) {
        this.scene = scene;
        scene.add(this.mesh);
    };

    Mesh.prototype.getMesh = function () {
        return this.mesh;
    };

    Mesh.prototype.setPosition = function (position) {
        this.position = position;
        this.mesh.position.set(position[0], position[1], position[2]);
    };
    return Mesh;
})();

var Scene = (function () {
    function Scene(axesHelper) {
        this.scene = new THREE.Scene();
        this.axesHelper = axesHelper;
        if (axesHelper) {
            this.axes = new THREE.AxisHelper(0);
            this.scene.add(this.axes);
        }
        return this.scene;
    }
    Scene.prototype.addToScene = function (mesh) {
        this.scene.add(mesh);
    };
    return Scene;
})();
