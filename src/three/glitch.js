import * as THREE from 'three';
import fragmentShader from '../shaders/fragmentShader.js';
import vertexShader from '../shaders/vertexShader.js';

let scrollable;

let current = 0;
let target = 0;
let ease = 0.075;

// Linear inetepolation used for smooth scrolling and image offset uniform adjustment

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

// init function triggered on page load to set the body height to enable scrolling and EffectCanvas initialised
export function init() {
    scrollable = document.querySelector('.scrollable');
    document.body.style.height = `${scrollable.getBoundingClientRect().height}px`;
    console.log(`${scrollable.getBoundingClientRect().height}px`)
}

// translate the scrollable div using the lerp function for the smooth scrolling effect.
function smoothScroll() {
    target = window.scrollY;
    current = lerp(current, target, ease);
    scrollable.style.transform = `translate3d(0,${-current}px, 0)`;
    // console.log({current, target})
}

export class EffectCanvas {
    constructor() {
        init()
        this.container = document.querySelector('main');
        this.meshItems = []; // Used to store all meshes we will be creating.
        this.setupCamera();
        this.createMeshItems();
        this.render()
    }

    // Getter function used to get screen dimensions used for the camera and mesh materials
    get viewport() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        let aspectRatio = width / height;
        return {
            width,
            height,
            aspectRatio
        };
    }

    setupCamera() {

        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        // Create new scene
        this.scene = new THREE.Scene();

        // Initialize perspective camera

        let perspective = 1000;
        const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI; // see fov image for a picture breakdown of this fov setting.
        this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 1, 1000)
        this.camera.position.set(0, 0, perspective); // set the camera position on the z axis.

        // renderer
        // this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.viewport.width, this.viewport.height); // uses the getter viewport function above to set size of canvas / renderer
        this.renderer.setPixelRatio(window.devicePixelRatio); // Import to ensure image textures do not appear blurred.
        this.container.appendChild(this.renderer.domElement); // append the canvas to the main element
    }

    onWindowResize() {
        init();
        this.camera.aspect = this.viewport.aspectRatio; // readjust the aspect ratio.
        this.camera.updateProjectionMatrix(); // Used to recalulate projectin dimensions.
        this.renderer.setSize(this.viewport.width, this.viewport.height);
    }

    createMeshItems(imgs) {
        // Loop thorugh all images and create new MeshItem instances. Push these instances to the meshItems array.
        imgs?.forEach(image => {
            let meshItem = new MeshItem(image, this.scene);
            this.meshItems.push(meshItem);
        })
    }


    createMeshItem(img) {
        // Loop thorugh all images and create new MeshItem instances. Push these instances to the meshItems array.
            let meshItem = new MeshItem(img, this.scene);
            this.meshItems.push(meshItem);
            console.log(this.meshItems)
            return meshItem;
    }

    // Animate smoothscroll and meshes. Repeatedly called using requestanimationdrame
    render() {
        smoothScroll();
        for (let i = 0; i < this.meshItems.length; i++) {
            this.meshItems[i].render();
        }
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.render.bind(this));
    }
}

class MeshItem {
    // Pass in the scene as we will be adding meshes to this scene.
    constructor(element, scene) {
        this.element = element;
        this.scene = scene;
        this.offset = new THREE.Vector2(0, 0); // Positions of mesh on screen. Will be updated below.
        this.sizes = new THREE.Vector2(0, 0); //Size of mesh on screen. Will be updated below.
        this.createMesh();
        this.mouseRenderFunc = false;
        this.mouseX =0;
        this.mouseY =0;
    }

    getDimensions() {
        const { width, height, top, left } = this.element.getBoundingClientRect();
        this.sizes.set(width, height);
        this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2);
    }

    setMouseRenderFunction(mouse) {
        this.mouseRenderFunc = mouse;
    }

    setMouseXY(x,y) {
        this.mouseX = lerp(this.mouseX, x, ease);
        this.mouseY = lerp(this.mouseY, y, ease);
    }

    createMesh() {
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100);
        this.imageTexture = new THREE.TextureLoader().load(this.element.src);
        this.uniforms = {
            uTexture: {
                //texture data
                value: this.imageTexture
            },
            uOffset: {
                //distortion strength
                value: new THREE.Vector2(0.0, 0.0)
            },
            uAlpha: {
                //opacity
                value: 1.
            }
        };
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            // wireframe: true,
            side: THREE.DoubleSide,
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.getDimensions(); // set offsetand sizes for placement on the scene
        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
        this.scene.add(this.mesh);
        init();
    }

    render() {
        if(this.mouseRenderFunc){
console.log('here')
            this.getDimensions();
            this.mesh.position.set(this.offset.x, this.offset.y, 0)
            this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)
            const x = this.mouseX
            const y = this.mouseY
            this.uniforms.uOffset.value.set(x/500, -y/500)
            console.log(x/1000, y/1000)

        }
        else {
            this.getDimensions();
            this.mesh.position.set(this.offset.x, this.offset.y, 0)
            this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)
            this.uniforms.uOffset.value.set(this.offset.x * 0.0, -(target - current) * 0.0006)
        }
        // this function is repeatidly called for each instance in the aboce 
    } 
    }

export default function glitch() {
    init()
    new EffectCanvas()
}
