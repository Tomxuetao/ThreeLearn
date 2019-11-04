import * as THREE from 'three'

class HelperUtil {
    constructor (threeScene, threeCamera) {
        this.threeScene = threeScene
        this.threeCamera = threeCamera
    }

    vertexNormalsHelper () {
        let geometry = new THREE.BoxBufferGeometry(200, 200, 200, 2, 2, 2)
        let material = new THREE.MeshBasicMaterial({ color: 0xfefefe, wireframe: true, opacity: 0.5 })
        geometry.computeBoundingSphere()
        let scaleFactor = 160 / geometry.boundingSphere.radius
        geometry.scale(scaleFactor, scaleFactor, scaleFactor)
        let mesh = new THREE.Mesh(geometry, material)
        this.threeScene.add(mesh)
        let vertexNormalsHelper = new THREE.VertexNormalsHelper(mesh, 10)
        mesh.add(vertexNormalsHelper)
    }

    cameraHelper () {
        let perspectiveCamera = new THREE.PerspectiveCamera(50, this.threeCamera.aspect, 150, 1000)

        let cameraHelper = new THREE.CameraHelper(perspectiveCamera)
        this.threeScene.add(cameraHelper)
        perspectiveCamera.rotation.y = Math.PI

        let cameraRig = new THREE.Group()
        cameraRig.add(perspectiveCamera)
        this.threeScene.add(cameraRig)

        let mesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(100, 16, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
        )
        this.threeScene.add(mesh)

        let mesh2 = new THREE.Mesh(
            new THREE.SphereBufferGeometry(50, 16, 8),
            new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
        )
        mesh2.position.y = 150
        mesh.add(mesh2)

        let mesh3 = new THREE.Mesh(
            new THREE.SphereBufferGeometry(5, 16, 8),
            new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
        )
        mesh3.position.z = 150
        cameraRig.add(mesh3)
        /**
         * 构建背景（点信息）
         */
        let geometry = new THREE.BufferGeometry()
        let vertices = []
        for (let i = 0; i < 10000; i++) {
            vertices.push(THREE.Math.randFloatSpread(2000))
            vertices.push(THREE.Math.randFloatSpread(2000))
            vertices.push(THREE.Math.randFloatSpread(2000))
        }
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
        let particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x888888 }))
        this.threeScene.add(particles)
    }
}

export { HelperUtil }
