import * as THREE from 'three'

class LightUtil {
    constructor (threeScene, threeCamera) {
        this.threeScene = threeScene
        this.threeCamera = threeCamera
    }

    createSpotLightHandle () {
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
        this.cameraHelper = new THREE.CameraHelper(this.threeCamera)
        this.threeScene.add(this.cameraHelper)
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
        mesh.position.set(40, 2, 0)
        mesh.castShadow = true
        this.threeScene.add(mesh2)
    }

    createPointLightHandle () {
    }

    createAmbientLightHandle () {
    }

    createRectAreaLightHandle () {
    }

    createDirectionalLightHandle () {
    }

    createHemisphereLightHandle () {
    }
}

export { LightUtil }
