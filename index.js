import {
  Scene,
  PerspectiveCamera,
  Vector3,
  Object3D,
  SphereGeometry,
  PlaneGeometry
} from 'three'
import TWEEN from '@tweenjs/tween.js'
import {
  CSS3DRenderer,
  CSS3DObject
} from 'three-css3drenderer'
import TrackballControls from 'three-trackballcontrols'

class Periodictable {
  constructor(options = {}) {
    const {
      // container = docuemnt.body,
      container,
      // 页面元素
      elements = [],
      // 元素排序[[row, column], [row, column]]
      positions = [],
      fov = 40,
      layout = 'table'
    } = options
    this.container = container
    this.elements = elements
    this.width = container.clientWidth || window.innerWidth
    this.height = container.clientHeight || window.innerHeight
    this.fov = fov
    this.objects = []
    this.targets = {
      grid: [],
      helix: [],
      table: [],
      sphere: [],
      sphere2: [],
      plane: []
    }
    this.positions = positions
    this.layout = layout === 'table' && positions.length ? 'table' : 'plane'
    this.vector = new Vector3()
    this.init()
  }

  init() {
    this.renderer = new CSS3DRenderer()
    this.renderer.setSize(this.width, this.height)
    const rendererDom = this.renderer.domElement
    rendererDom.style.position = 'absolute'
    this.container.appendChild(rendererDom)
    this.scene = new Scene()
    this.camera = new PerspectiveCamera(this.fov, this.width / this.height, 1, 10000)
    this.camera.position.z = 3000

    this.initControls()
    this.initObjects()
    this._createTableVertices()
    this._createSphereVertices()
    this._createSphere2Vertices()
    this._createPlaneVertices()
    this._createHelixVertices()
    this._createGridVertices()
    this.changeLayout(this.layout)
    this.render()
    this.animation()
    window.addEventListener('resize', () => {
      this.resize()
    }, false)
  }

  initControls() {
    const controls = new TrackballControls(this.camera, this.renderer.domElement)
    controls.rotateSpeed = 1
    controls.staticMoving = true
    controls.minDistance = 500
    controls.maxDistance = 60000
    controls.addEventListener('change', () => {
      this.render()
    })
    this.controls = controls
  }

  initObjects() {
    this.elements.forEach(elem => {
      const object = new CSS3DObject(elem)
      object.position.x = Math.random() * 4000 - 2000
      object.position.y = Math.random() * 4000 - 2000
      object.position.z = Math.random() * 4000 - 2000
      this.scene.add(object)
      this.objects.push(object)
    })
    this.objectLen = this.objects.length
  }

  changeLayout(layout, duration = 2000) {
    TWEEN.removeAll()
    this.objects.forEach((object, index) => {
      const {
        position,
        rotation
      } = this.targets[layout][index]
      new TWEEN.Tween(object.position)
        .to(position, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start()
      new TWEEN.Tween(object.rotation)
        .to({
          x: rotation.x,
          y: rotation.y,
          z: rotation.z
        }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start()
    })

    new TWEEN.Tween({})
      .to({}, duration * 2)
      .onUpdate(() => {
        this.render()
      })
      .start()
  }

  animation() {
    TWEEN.update()
    this.controls.update()
    requestAnimationFrame(() => {
      this.animation()
    })
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  resize() {
    this.width = this.container.clientWidth
    this.height = this.container.clientHeight
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
    this.render()
  }

  _createTableVertices() {
    this.positions.forEach(pos => {
      const object = new Object3D()
      object.position.x = pos[0] * 140 - 1330
      object.position.y = -pos[1] * 180 + 1100
      object.position.z = 0
      this.targets.table.push(object)
    })
  }

  _createSphereVertices() {
    for (let i = 0; i < this.objectLen; i++) {
      const object = new Object3D()
      const phi = Math.acos(-1 + (2 * i) / this.objectLen)
      const theta = Math.sqrt(this.objectLen * Math.PI) * phi
      object.position.setFromSphericalCoords(800, phi, theta)

      // object.position.x = 800 * Math.cos(theta) * Math.sin(phi)
      // object.position.y = 800 * Math.sin(theta) * Math.sin(phi)
      // object.position.z = -800 * Math.cos(phi)
      this.vector.copy(object.position).multiplyScalar(2)
      object.lookAt(this.vector)
      this.targets.sphere.push(object)
    }
  }

  _createSphere2Vertices() {
    const geo = new SphereGeometry(800, 12, 11)
    const vertices = geo.vertices

    for (let i = 0; i < this.objectLen; i++) {
      const object = new Object3D()
      object.position.copy(vertices[i])
      this.vector.copy(object.position).multiplyScalar(2)
      object.lookAt(this.vector)
      this.targets.sphere2.push(object)
    }
  }

  _createPlaneVertices() {
    const geo = new PlaneGeometry(1500, 1800, 11, 10)
    const vertices = geo.vertices
    for (let i = 0; i < this.objectLen; i++) {
      const object = new Object3D()
      object.position.copy(vertices[i])
      this.targets.plane.push(object)
    }
  }

  _createHelixVertices() {
    for (let i = 0; i < this.objectLen; i++) {
      const object = new Object3D()
      object.position.setFromCylindricalCoords(900, i * 0.175 + Math.PI, -(i * 8) + 450)
      // const phi = i * 0.213 + Math.PI
      // object.position.x = 800 * Math.sin(phi)
      // object.position.y = -(i * 8) + 450
      // object.position.z = 800 * Math.cos(phi + Math.PI)
      object.scale.set(1.1, 1.1, 1.1)

      this.vector.x = object.position.x * 2
      this.vector.y = object.position.y
      this.vector.z = object.position.z * 2
      object.lookAt(this.vector)
      this.targets.helix.push(object)
    }
  }

  _createGridVertices() {
    for (let i = 0; i < this.objectLen; i++) {
      const object = new Object3D()
      object.position.x = 400 * (i % 5) - 800
      // >> 0 相当于Math.floor()
      object.position.y = -400 * ((i / 5 >> 0) % 5) + 820
      object.position.z = -700 * (i / 25 >> 0)
      this.targets.grid.push(object)
    }
  }
}

export default Periodictable
