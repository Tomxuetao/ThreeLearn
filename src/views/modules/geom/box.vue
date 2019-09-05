<template>
    <div id="container" style="width: 100%;height: 100%"></div>
</template>

<script>
import * as THREE from 'three'
import initSceneMixin from '@/mixin/initSceneMixin'
import crateImage from '@/assets/textures/crate.gif'
export default {
    mixins: [initSceneMixin],
    methods: {
        addSomethingToScene () {
            document.getElementById('container').appendChild(this.webGLRenderer.domElement)
            let geometry = new THREE.BoxBufferGeometry(1, 1, 1)
            /**
             * 构造函数
             * TextureLoader( manager : LoadingManager )
             * manager — 加载器使用的loadingManager，默认值为THREE.DefaultLoadingManager.
             * 创建一个新的TextureLoader.
             * @type {Texture}
             */
            let texture = new THREE.TextureLoader().load(crateImage)
            /**
             * MeshBasicMaterial( parameters : Object )
             * parameters - (可选)用于定义材质外观的对象，具有一个或多个属性。材质的任何属性都可以从此处传入(包括从Material继承的任何属性)。
             * 属性color例外，其可以作为十六进制字符串传递，默认情况下为 0xffffff（白色），内部调用Color.set(color)。
             * @type {MeshBasicMaterial}
             */
            let material = new THREE.MeshBasicMaterial({ map: texture })
            let mesh = new THREE.Mesh(geometry, material)
            this.threeScene.add(mesh)
            this.threeCamera.position.z = 5
            const animate = () => {
                requestAnimationFrame(animate)
                mesh.rotation.x += 0.01
                mesh.rotation.y += 0.01
                this.webGLRenderer.render(this.threeScene, this.threeCamera)
            }
            animate()
        }
    }
}
</script>
