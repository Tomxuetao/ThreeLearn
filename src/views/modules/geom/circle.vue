<template>
    <div id="container" style="width: 100%;height: 100%"></div>
</template>

<script>

import * as THREE from 'three'
import initSceneMixin from '@/mixin/initSceneMixin'
export default {
    name: 'circle-geometry',
    mixins: [initSceneMixin],
    methods: {
        addSomethingToScene () {
            document.getElementById('container').appendChild(this.webGLRenderer.domElement)
            /**
             * CircleBufferGeometry(radius : Float, segments : Integer, thetaStart : Float, thetaLength : Float)
             * radius — 圆形的半径，默认值为1
             * segments — 分段（三角面）的数量，最小值为3，默认值为8。
             * thetaStart — 第一个分段的起始角度，默认为0。（three o'clock position）
             * thetaLength — 圆形扇区的中心角，通常被称为“θ”（西塔）。默认值是2*Pi，这使其成为一个完整的圆。
             * @type {CircleBufferGeometry}
             */
            let geometry = new THREE.CircleBufferGeometry(1, 60)
            let material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
            let mesh = new THREE.Mesh(geometry, material)
            this.threeScene.add(mesh)
            this.threeCamera.position.z = 10
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
