import * as THREE from 'three'
import grassland from '@/plugins/three-js/textures/grassland.jpg'
import crate from  '@/plugins/three-js/textures/crate.gif'

class LoaderUtil {
    constructor (threeScene) {
        this.threeScene = threeScene
    }

    loaderFont () {
        let loader = new THREE.FontLoader()
        loader.load('./json/font.json', font => {
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

            let shapes = font.generateShapes(message, 100, 0)

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
        }, undefined, onError => {
            console.log(onError)
        })
    }

    loaderImage () {
        let loader = new THREE.ImageLoader()

        loader.load(grassland, image => {
            let canvas = document.getElementsByName('canvas')[0]
            let context = canvas.getContext('2d')
            context.drawImage(image, canvas.clientWidth, canvas.clientHeight)
        }, undefined, onError => {
            console.log(onError)
        })
    }

    loaderObject () {
        let ambient = new THREE.AmbientLight(0x444444)
        this.threeScene.add(ambient)
        let directionalLight = new THREE.DirectionalLight(0xffeedd)
        directionalLight.position.set(0, 0, 1).normalize()
        this.threeScene.add(directionalLight)

        let objectLoader = new THREE.ObjectLoader()
        objectLoader.load('./json/teapot.json', object => {
            this.threeScene.add(object)
        })
    }

    loaderTexture () {
        let textureLoader = new THREE.TextureLoader()
        textureLoader.load(crate, texture => {
            let material = new THREE.MeshBasicMaterial({
                map: texture
            })
            let geometry = new THREE.BoxBufferGeometry( 200, 200, 200 )
            let mesh = new THREE.Mesh( geometry, material )
            this.threeScene.add(mesh)
        }, undefined, onError => {
            console.log(onError)
        })
    }
}

export { LoaderUtil }
