<template>
    <div id="container" style="width: 100%;height: 100%"></div>
</template>

<script>
import * as THREE from 'three'
import initSceneMixin from '@/mixin/initSceneMixin'
export default {
    name: 'cone-geometry',
    mixins: [initSceneMixin],
    methods: {
        addSomethingToScene: function () {
            document.getElementById('container').appendChild(this.webGLRenderer.domElement)
            /**
             * ConeBufferGeometry(radius : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
             * radius — 圆锥底部的半径，默认值为1。
             * height — 圆锥的高度，默认值为1。
             * radialSegments — 圆锥侧面周围的分段数，默认为8。
             * heightSegments — 圆锥侧面沿着其高度的分段数，默认值为1。
             * openEnded — 一个Boolean值，指明该圆锥的底面是开放的还是封顶的。默认值为false，即其底面默认是封顶的。
             * thetaStart — 第一个分段的起始角度，默认为0。（three o'clock position）
             * thetaLength — 圆锥底面圆扇区的中心角，通常被称为“θ”（西塔）。默认值是2*Pi，这使其成为一个完整的圆锥。
             * @type {ConeBufferGeometry}
             */
            let geometry = new THREE.ConeBufferGeometry(5, 20, 32)
            let material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
            let mesh = new THREE.Mesh(geometry, material)
            this.threeScene.add(mesh)
            this.threeCamera.position.z = 50
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
