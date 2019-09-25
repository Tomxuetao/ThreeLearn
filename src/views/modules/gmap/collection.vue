<template>
    <div style="height: 100%">
        <div id="container" class="mod-home" style="height: 100%"></div>
        <add-or-update v-if="addBoundaryVisible" ref="addBoundary" @refreshDataList="removeBoundary" :geomText="geomText"></add-or-update>
    </div>
</template>

<script>
import { convertAMapPath2GCJ02GeomText } from '@/utils/geoDataConversion'
import AddOrUpdate from './boundary-add-or-update'

export default {
    data () {
        return {
            gaoDeMap: {},
            mouseTool: {},
            addBoundaryVisible: false,
            geomText: '',
            geoJson: {},
            polyline: {},
            pid: 0,
            type: 0,
            level: 7
        }
    },
    components: {
        AddOrUpdate
    },
    mounted () {
        this.$nextTick(function () {
            this.createMapHandle()
            this.gaoDeMap.on('complete', () => {
                /* eslint-disable */
                    AMap.plugin('AMap.MouseTool', () => {
                        /* eslint-disable */
                        this.mouseTool = new AMap.MouseTool(this.gaoDeMap)
                        this.mouseTool.on('draw', this.drawEndHandle)
                        this.mouseTool.polygon({
                            fillColor: '#00b0ff',
                            strokeColor: '#80d8ff'
                        })
                    })
                })
            })
        },
    
        activated () {
            if (this.$route.params.gid) {
                this.getGeoJsonById(this.$route.params.gid)
                this.type = this.$route.params.type
                this.level = this.$route.params.level
                this.pid = this.$route.params.gid
            }
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
            },
            
            /**
             * 绘制结束操作
             */
            drawEndHandle (e) {
                this.geomText = convertAMapPath2GCJ02GeomText(e.obj.getPath())
                this.addBoundaryVisible = true
                this.$nextTick(() => {
                    this.$refs.addBoundary.init(null, this.type, this.level, this.pid)
                })
            },
            
            /**
             * 清除绘制结果
             */
            removeBoundary () {
                this.gaoDeMap.clearMap()
            },
            
            getGeoJsonById (id) {
                this.$http({
                    url: this.$http.adornUrl('/geo/boundary/json'),
                    method: 'post',
                    data: this.$http.adornData({
                        id: id
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.geoJson = data.geoJson
                        this.addHouseBoundary()
                    }
                })
            },
            
            addHouseBoundary () {
                if (Object.keys(this.geoJson).length > 0) {
                    this.gaoDeMap.remove(this.polyline)
                    /* eslint-disable */
                    this.polyline = new AMap.Polyline({
                        path: this.geoJson.features[0].geometry.coordinates[0],
                        strokeColor: '#3366FF',
                        strokeOpacity: 1,
                        strokeWeight: 2,
                        strokeStyle: 'solid',
                    })
                    this.gaoDeMap.add(this.polyline)
                    this.gaoDeMap.setFitView(this.polyline)
                }
            }
        }
    }
</script>
<style>
    .amap-logo, .amap-copyright {
        display: none !important;
    }
</style>
