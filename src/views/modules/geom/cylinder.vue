<template>
    <div id="container" style="width: 100%;height: 100%"></div>
</template>

<script>
import * as THREE from 'three'
import initSceneMixin from '@/mixin/initSceneMixin'
export default {
    name: 'cylinder',
    mixins: [initSceneMixin],
    methods: {
        addSomethingToScene () {
            document.getElementById('container').appendChild(this.webGLRenderer.domElement)
            /**
             * CylinderBufferGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
             * radiusTop — 圆柱的顶部半径，默认值是1。
             * radiusBottom — 圆柱的底部半径，默认值是1。
             * height — 圆柱的高度，默认值是1。
             * radialSegments — 圆柱侧面周围的分段数，默认为8。
             * heightSegments — 圆柱侧面沿着其高度的分段数，默认值为1。
             * openEnded — 一个Boolean值，指明该圆锥的底面是开放的还是封顶的。默认值为false，即其底面默认是封顶的。
             * thetaStart — 第一个分段的起始角度，默认为0。（three o'clock position）
             * thetaLength — 圆柱底面圆扇区的中心角，通常被称为“θ”（西塔）。默认值是2*Pi，这使其成为一个完整的圆柱。
             * @type {CylinderBufferGeometry}
             */
            let geometry = new THREE.CylinderBufferGeometry(5, 5, 20, 32)
            let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
            let mesh = new THREE.Mesh(geometry, material)
            this.threeScene.add(mesh)
            this.threeCamera.position.z = 100
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

<style scoped>

</style>
