import * as THREE from 'three'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'
import { Water } from 'three/examples/jsm/objects/Water'
import { Sky } from 'three/examples/jsm/objects/Sky'

import disturb from '@/assets/images/disturb.jpg'
import grassland from '@/assets/images/grassland.jpg'
import nx from '@/assets/images/cube/nx.jpg'
import ny from '@/assets/images/cube/ny.jpg'
import nz from '@/assets/images/cube/nz.jpg'
import px from '@/assets/images/cube/px.jpg'
import py from '@/assets/images/cube/py.jpg'
import pz from '@/assets/images/cube/pz.jpg'
import waterNormals from '@/assets/images/waternormals.jpg'

class LightUtil {
  constructor (threeScene, threeCamera) {
    this.threeScene = threeScene
    this.threeCamera = threeCamera
  }

  createSpotLightHandle () {
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
    this.threeScene.add(ambientLight)

    let spotLight = new THREE.SpotLight(0xffffff, 1)
    spotLight.position.set(15, 40, 35)
    spotLight.angle = Math.PI / 4
    spotLight.penumbra = 0.05
    spotLight.decay = 2
    spotLight.distance = 200

    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.camera.near = 10
    spotLight.shadow.camera.far = 200
    this.threeScene.add(spotLight)

    // 用于模拟聚光灯 SpotLight 的锥形辅助对象
    this.lightHelper = new THREE.SpotLightHelper(spotLight)
    this.threeScene.add(this.lightHelper)

    // 用于模拟相机视锥体的辅助对象
    this.shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
    this.threeScene.add(this.shadowCameraHelper)

    // 用于简单模拟3个坐标轴的对象
    this.threeScene.add(new THREE.AxesHelper(10))

    let material = new THREE.MeshPhongMaterial({ color: 0x808080, dithering: true })
    let geometry = new THREE.PlaneBufferGeometry(2000, 2000)
    let mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, -1, 0)
    mesh.rotation.x = -Math.PI * 0.5
    mesh.receiveShadow = true
    this.threeScene.add(mesh)

    let material2 = new THREE.MeshPhongMaterial({ color: 0x4080ff, dithering: true })
    let geometry2 = new THREE.BoxBufferGeometry(3, 1, 2)
    let mesh2 = new THREE.Mesh(geometry2, material2)
    mesh2.position.set(40, 2, 0)
    mesh2.castShadow = true
    this.threeScene.add(mesh2)
  }

  createPointLightHandle () {
    let textureLoader = new THREE.TextureLoader()

    let texture = textureLoader.load(disturb)
    texture.repeat.set(20, 10)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.format = THREE.RGBFormat

    let groundMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture })
    let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(800, 400, 2, 2), groundMaterial)
    mesh.position.y = -5
    mesh.rotation.x = -Math.PI / 2
    this.threeScene.add(mesh)

    const colorArray = [0xff0040, 0x0040ff, 0x80ff80, 0xffaa00, 0x00ffaa, 0xff1100]
    let sphere = new THREE.SphereBufferGeometry(0.25, 16, 8)
    colorArray.forEach(item => {
      let pointLight = new THREE.PointLight(item, 2.5, 100, 2.0)
      pointLight.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: item })))
      this.threeScene.add(pointLight)
    })

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.05)
    directionalLight.position.set(0.5, 1, 0).normalize()
    this.threeScene.add(directionalLight)
  }

  createAmbientLightHandle () {
    this.threeScene.add(new THREE.AmbientLight(0x666666))
    let light = new THREE.DirectionalLight(0xdfebff, 1)
    light.position.set(50, 200, 100)
    light.position.multiplyScalar(1.3)
    light.castShadow = true
    light.shadow.mapSize.width = 1024
    light.shadow.mapSize.height = 1024
    light.shadow.camera.left = -300
    light.shadow.camera.right = 300
    light.shadow.camera.top = 300
    light.shadow.camera.bottom = -300
    light.shadow.camera.far = 1000
    this.threeScene.add(light)

    let groundTexture = new THREE.TextureLoader().load(grassland)
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
    groundTexture.repeat.set(25, 25)
    groundTexture.anisotropy = 16

    let groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture })

    let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial)
    mesh.position.y = -250
    mesh.rotation.x = -Math.PI / 2
    mesh.receiveShadow = true
    this.threeScene.add(mesh)
  }

  createRectAreaLightHandle (rectLight) {
    let ambient = new THREE.AmbientLight(0xffffff, 0.1)
    this.threeScene.add(ambient)

    RectAreaLightUniformsLib.init()

    rectLight.position.set(5, 5, 0)
    this.threeScene.add(rectLight)

    let rectLightMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial({ side: THREE.BackSide }))
    rectLightMesh.scale.x = rectLight.width
    rectLightMesh.scale.y = rectLight.height
    rectLight.add(rectLightMesh)

    let rectLightMeshBack = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial({ color: 0x080808 }))
    rectLightMesh.add(rectLightMeshBack)

    let geoFloor = new THREE.BoxBufferGeometry(2000, 0.1, 2000)
    let matStdFloor = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0, metalness: 0 })
    let mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor)
    this.threeScene.add(mshStdFloor)
  }

  createDirectionalLightHandle (sphereArray) {
    this.threeScene.background = new THREE.CubeTextureLoader().load([px, nx, py, ny, pz, nz])

    let geometry = new THREE.SphereBufferGeometry(100, 32, 16)

    let textureCube = new THREE.CubeTextureLoader().load([px, nx, py, ny, pz, nz])
    textureCube.mapping = THREE.CubeRefractionMapping

    let material = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube, refractionRatio: 0.95 })

    for (let i = 0; i < 500; i++) {
      let mesh = new THREE.Mesh(geometry, material)
      mesh.position.x = Math.random() * 10000 - 5000
      mesh.position.y = Math.random() * 10000 - 5000
      mesh.position.z = Math.random() * 10000 - 5000
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1
      this.threeScene.add(mesh)
      sphereArray.push(mesh)
    }
  }

  createHemisphereLightHandle (light, webGLRenderer) {
    // let light = new THREE.DirectionalLight(0xffffff, 0.8)
    this.threeScene.add(light)

    let waterGeometry = new THREE.PlaneBufferGeometry(10000, 10000)

    this.water = new Water(
      waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(waterNormals, function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        }),
        alpha: 1.0,
        sunDirection: light.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: this.threeScene.fog !== undefined
      }
    )

    this.water.rotation.x = -Math.PI / 2

    this.threeScene.add(this.water)

    // Skybox

    let sky = new Sky()

    let uniforms = sky.material.uniforms

    uniforms['turbidity'].value = 10
    uniforms['rayleigh'].value = 2
    uniforms['mieCoefficient'].value = 0.005
    uniforms['mieDirectionalG'].value = 0.8

    let parameters = {
      distance: 400,
      inclination: 0.49,
      azimuth: 0.205
    }

    const renderTarget = new THREE.WebGLCubeRenderTarget(128, {
      format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter
    })
    const cubeCamera = new THREE.CubeCamera(0.1, 1, renderTarget)
    cubeCamera.renderTarget.texture.generateMipmaps = true
    cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter

    this.threeScene.background = cubeCamera.renderTarget

    let theta = Math.PI * (parameters.inclination - 0.5)
    let phi = 2 * Math.PI * (parameters.azimuth - 0.5)

    light.position.x = parameters.distance * Math.cos(phi)
    light.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta)
    light.position.z = parameters.distance * Math.sin(phi) * Math.cos(theta)

    sky.material.uniforms['sunPosition'].value = light.position.copy(light.position)
    this.water.material.uniforms['sunDirection'].value.copy(light.position).normalize()

    cubeCamera.update(webGLRenderer, sky)

    let geometry = new THREE.IcosahedronBufferGeometry(20, 1)
    let count = geometry.attributes.position.count

    let colors = []
    let color = new THREE.Color()

    for (let i = 0; i < count; i += 3) {
      color.setHex(Math.random() * 0xffffff)
      colors.push(color.r, color.g, color.b)
      colors.push(color.r, color.g, color.b)
      colors.push(color.r, color.g, color.b)
    }

    geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    let material = new THREE.MeshStandardMaterial({
      vertexColors: THREE.VertexColors,
      roughness: 0.0,
      flatShading: true,
      envMap: cubeCamera.renderTarget.texture,
      side: THREE.DoubleSide
    })

    this.sphere = new THREE.Mesh(geometry, material)
    this.threeScene.add(this.sphere)
  }
}

export { LightUtil }
