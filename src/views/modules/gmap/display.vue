<template>
    <div id="container" style="height: 100%"></div>
</template>

<script>
import { createCustomMeshWall } from '@/utils/customMeshUtil'
import * as L7 from '@antv/l7'
import { carTravel } from '@/utils/mockData'
export default {
    name: 'index',
    data () {
        return {
            gaoDeMap: {},
            buildingLayer: {},
            object3DLayer: {},
            antScene: {}
        }
    },
    created () {
        if (this.$route.params.gid) {
            this.getGeoJsonById()
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.createMapHandle()
            this.gaoDeMap.on('complete', () => {
                setTimeout(() => {
                    this.pitchAnimateHandle()
                }, 3000)
            })
        })
    },
    methods: {
        createMapHandle () {
            /* eslint-disable */
            this.buildingLayer = new AMap.Buildings({ zIndex: 130, merge: false, sort: false, zooms: [10, 20] })
            this.gaoDeMap = new AMap.Map('container', {
                resizeEnable: true,
                rotateEnable: true,
                defaultCursor: 'pointer',
                labelzIndex: 1500,
                zooms: [10, 22],
                zoom: 17,
                viewMode: '3D',
                expandZoomRange: true,
                pitch: 0,
                showIndoorMap: false,
                center: [120.182527, 30.324699],
                features:['road'],
                layers: [
                    this.buildingLayer,
                    new AMap.TileLayer()
                ],
                mapStyle: 'amap://styles/928ad1524556f6cb662af22ab386a5db'
            })
            this.object3DLayer = new AMap.Object3DLayer()
            this.gaoDeMap.add(this.object3DLayer)
            this.antScene = new L7.Scene({
                map: this.gaoDeMap,
                mapStyle: 'amap://styles/928ad1524556f6cb662af22ab386a5db'
            })
            this.createTravelHandle()
        },
        pitchAnimateHandle (speed = 0.5, maxPitch = 60) {
            const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
            const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
            let pitch = this.gaoDeMap.getPitch()
            if (pitch < maxPitch) {
                const animate = () => {
                    pitch += speed
                    let animateId = requestAnimationFrame(animate)
                    this.gaoDeMap.setPitch(pitch)
                    if (pitch > maxPitch) {
                        cancelAnimationFrame(animateId)
                    }
                }
                animate()
            }
        },
        getGeoJsonById(){
            this.$http({
                url: this.$http.adornUrl('/geo/boundary/geojson'),
                method: 'post',
                data: this.$http.adornData({
                    id: this.$route.params.gid,
                    type: '0'
                })
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    let boundaryArray = data.geoJson.features[0].geometry.coordinates[0]
                    this.gaoDeMap.add(this.createPolyline(boundaryArray))
                    createCustomMeshWall(this.object3DLayer, [boundaryArray])
                    this.createRegionHandle(data.geoJson)
                }
            })
        },
        // 创建周界
        createRegionHandle (geoJson) {
            let boundaryArray = geoJson.features[0].geometry.coordinates[0]
            const options = {
                hideWithoutStyle: true,
                areas: [{ //围栏1
                    rejectTexture: false,
                    color1: 'ff99ff00',
                    color2: 'ff999900',
                    path: boundaryArray
                }]
            }
            this.buildingLayer.setStyle(options)
        },
        createPolyline (boundaryArray) {
            return new AMap.Polyline({
                bubble: true,
                fillColor: 'green',
                fillOpacity: 0.4,
                strokeWeight: 1,
                path: boundaryArray
            })
        },
        
        createTravelHandle () {
            this.antScene.on('loaded', () => {
                this.antScene.LineLayer({
                    zIndex: 2
                }).source(carTravel).size(1).shape('line').color('#00ff02').animate({
                    enable: true,
                    interval: 0.5,
                    duration: 1,
                    trailLength: 0.5
                }).render()
            })
        }
    }
}
</script>

<style>
    .l7-control-container{
        display: none;
    }
</style>
