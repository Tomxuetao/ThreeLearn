import * as THREE from 'three'
import threeFont from '@/plugins/three-js/fonts/three.json'
import grassland from '@/plugins/three-js/textures/grassland.jpg'

class LoaderUtil {
    constructor (threeScene) {
        this.threeScene = threeScene
    }

    loaderFont () {
        const font = new THREE.Font(threeFont)
        let xMid, text
        let color = 0x006699
        let matDark = new THREE.LineBasicMaterial({
            color: color,
            side: THREE.DoubleSide
        })

        let matLite = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        })

        let message = 'Three.js\nSimple text.'

        let shapes = font.generateShapes(message, 100)

        let geometry = new THREE.ShapeBufferGeometry(shapes)

        geometry.computeBoundingBox()

        xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)

        geometry.translate(xMid, 0, 0)

        // make shape ( N.B. edge view not visible )

        text = new THREE.Mesh(geometry, matLite)
        text.position.z = -150
        this.threeScene.add(text)

        // make line shape ( N.B. edge view remains visible )

        let holeShapes = []

        for (let i = 0; i < shapes.length; i++) {
            let shape = shapes[i]

            if (shape.holes && shape.holes.length > 0) {
                for (let j = 0; j < shape.holes.length; j++) {
                    let hole = shape.holes[j]
                    holeShapes.push(hole)
                }
            }
        }

        shapes.push.apply(shapes, holeShapes)

        let lineText = new THREE.Object3D()

        for (let i = 0; i < shapes.length; i++) {
            let shape = shapes[i]
            let points = shape.getPoints()
            let geometry = new THREE.BufferGeometry().setFromPoints(points)
            geometry.translate(xMid, 0, 0)
            let lineMesh = new THREE.Line(geometry, matDark)
            lineText.add(lineMesh)
        }
        this.threeScene.add(lineText)
    }

    loaderImage () {
        let loader = new THREE.ImageLoader()

        loader.load(grassland, image => {
            let canvas = document.createElement('canvas')
            let context = canvas.getContext('2d')
            context.drawImage(image, canvas.width, canvas.height)
        }, undefined, onError => {
            return new Error('发生错误')
        })
    }
}

export { LoaderUtil }
