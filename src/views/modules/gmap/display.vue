<template>
    <div id="container" style="height: 100%"></div>
</template>

<script>
export default {
    name: 'index',
    data () {
        return {
            gaoDeMap: {},
            buildingLayer: {}
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
                this.pitchAnimateHandle()
            })
        })
    },
    methods: {
        createMapHandle () {
            /* eslint-disable */
            this.buildingLayer = new AMap.Buildings({ zIndex: 130, merge: false, sort: false, zooms: [17, 20] })
            /* eslint-disable */
            this.gaoDeMap = new AMap.Map('container', {
                resizeEnable: true,
                rotateEnable: true,
                defaultCursor: 'pointer',
                zooms: [10, 22],
                zoom: 17,
                viewMode: '3D',
                expandZoomRange: true,
                pitch: 0,
                center: [120.182527, 30.324699],
                mapStyle: 'amap://styles/928ad1524556f6cb662af22ab386a5db'
            })
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
                    this.createRegionHandle(data.geoJson)
                }
            })
        },
        // 创建周界
        createRegionHandle (geoJson) {
            this.gaoDeMap.setLayers([new AMap.TileLayer({}), this.buildingLayer])
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
            this.gaoDeMap.add(this.createPolygon(boundaryArray))
        },

        createPolygon (boundaryArray) {
            return new AMap.Polygon({
                bubble: true,
                fillColor: 'green',
                fillOpacity: 0.4,
                strokeWeight: 1,
                path: boundaryArray
            })
        }
    }
}
</script>
