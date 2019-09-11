/**
 * 更新Mesh颜色
 * @param meshObject
 * @param meshArray
 * @param color
 * @param selectedColor
 */
export function updateMesh (meshObject, meshArray, color, selectedColor) {
    let mesh = meshArray.find(function (mesh) {
        return mesh === meshObject
    })
    // 重置 Mesh 颜色
    let customColor = rgbaToArray(color) || [0, 1, 1, 0.3]
    let customSelectColor = rgbaToArray(selectedColor) || [100 / 255, 150 / 255, 230 / 255, 0.8]
    meshArray.forEach(mesh => {
        updateMeshColor(mesh, customColor)
    })
    // 更新选中 Mesh 的 vertexColors
    if (mesh) {
        updateMeshColor(mesh, customSelectColor)
    }
}

/**
 * 创建单个MeshLine
 * @param object3DLayer
 * @param boundary
 * @param height
 * @param width
 */
function createMeshLine (object3DLayer, boundary, height, width = 2) {
    /* eslint-disable */
    let customMeshLine = new AMap.Object3D.MeshLine({
        path: boundary,
        height: height,
        color: 'rgba(77, 246, 250, 0.9)',
        width: width
    })
    customMeshLine.transparent = true
    customMeshLine.backOrFront = 'both'
    object3DLayer.add(customMeshLine)
}

/**
 * 更新mesh的颜色
 */
function updateMeshColor (mesh, color) {
    let vertexColors = mesh.geometry.vertexColors
    let len = vertexColors.length
    for (let i = 0; i < len / 4; i++) {
        let r = color[0]
        let g = color[1]
        let b = color[2]
        let a = color[3]
        // 不能重新赋值，只允许修改内容
        vertexColors.splice(i * 4, 4, r, g, b, a)
    }
    mesh.needUpdate = true
    mesh.reDraw()
}

/**
 * 构架建筑物
 * @param object3DLayer
 * @param geoJson
 */
export function createBuildingByGeoJson (object3DLayer, geoJson = {}) {
    let tempObject = analysisGeoJson(geoJson)
    let boundary = tempObject.boundary
    let properties = tempObject.properties
    let layer = tempObject.properties['layer']
    let height = properties['height'] || 100
    for (let i = 0; i < layer; i++) {
        createMesh(object3DLayer, boundary, properties, height * i, height * (i + 1))
        createMeshLine(object3DLayer, boundary, height * (i + 1), 2)
    }
}

/**
 * 创建单个Mesh
 * @param object3DLayer
 * @param boundary
 * @param properties
 * @param bottomHeight
 * @param topHeight
 */
function createMesh (object3DLayer, boundary, properties, bottomHeight, topHeight) {
    let color = rgbaToArray(properties['color']) || [0, 1, 1, 0.9]
    let segment = boundary.length
    /* eslint-disable */
    const customMeshCube = new AMap.Object3D.Mesh()
    let geometry = customMeshCube.geometry
    geometry.customData = properties
    let verticesLength = segment * 2
    let gaoDeMap = object3DLayer.getMap()
    for (let i = 0; i < segment; i++) {
        // 将经纬度坐标转化成平面坐标
        let temp = gaoDeMap.lngLatToGeodeticCoord(boundary[i])
        // 底部顶点
        geometry.vertices.push(temp.x, temp.y, -bottomHeight)
        // 顶部顶点
        geometry.vertices.push(temp.x, temp.y, -topHeight)
        // 底部颜色
        geometry.vertexColors.push.apply(geometry.vertexColors, color)
        // 顶部颜色
        geometry.vertexColors.push.apply(geometry.vertexColors, color)
        // 顶点索引
        let bottomIndex = i * 2
        // 顶点索引
        let topIndex = bottomIndex + 1
        // 顶点索引
        let nextBottomIndex = (bottomIndex + 2) % verticesLength
        // 顶点索引
        let nextTopIndex = (bottomIndex + 3) % verticesLength
        // 侧面三角形1（依据顶点索引构建三角面）
        geometry.faces.push(bottomIndex, topIndex, nextTopIndex)
        // 侧面三角形2（依据顶点索引构建三角面）
        geometry.faces.push(bottomIndex, nextTopIndex, nextBottomIndex)
    }
    // 构建顶面三角形,为了区分顶面点和侧面点使用不一样的颜色,所以需要独立的顶点
    for (let i = 0; i < segment; i += 1) {
        // 底部顶点
        geometry.vertices.push.apply(geometry.vertices, geometry.vertices.slice(i * 6 + 3, i * 6 + 6))
        geometry.vertexColors.push.apply(geometry.vertexColors, color)
    }

    let triangles = AMap.GeometryUtil.triangulateShape(boundary)
    let offset = segment * 2

    for (let v = 0; v < triangles.length; v += 3) {
        geometry.faces.push(triangles[v] + offset, triangles[v + 2] + offset, triangles[v + 1] + offset)
    }
    // 如果使用了透明颜色，请设置true
    customMeshCube.transparent = true
    customMeshCube.backOrFront = 'both'
    object3DLayer.add(customMeshCube)
}

/**
 * rgba转化成数组
 * @param colorString
 * @returns {Array}
 */
function rgbaToArray (colorString) {
    const rgbaJudgeTag = /^rgb[a]*\s*\(([^,]+),([^,]+),([^,]+),([^\)]+)\)$/i
    let temp = rgbaJudgeTag.exec(colorString)
    let returnArray = []
    for (let i = 1; i < temp.length - 1; i++) {
        returnArray.push(Number(temp[i].trim()) / 255)
    }
    returnArray.push(Number(temp[temp.length - 1].trim()))
    return returnArray
}

/**
 * 解构GeoJson数据
 * @param geoJson
 * @returns {{boundary: Array, properties}}
 */
function analysisGeoJson (geoJson) {
    let properties = geoJson.features[0].properties
    let gcj02BoundaryArray = geoJson.features[0].geometry.coordinates[0]
    return {
        boundary: gcj02BoundaryArray,
        properties: properties
    }
}
