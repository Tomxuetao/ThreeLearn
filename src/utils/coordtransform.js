// 常量
const constant = {
    x_PI: 3.14159265358979324 * 3000.0 / 180.0,
    PI: 3.1415926535897932384626,
    a: 6378245.0,
    ee: 0.00669342162296594323
}

/**
 * BD09转化为GCJ02
 * @param lng
 * @param lat
 * @returns {number[]}
 */
export function bd09ToGCJ02 (lng, lat) {
    let x = lng - 0.0065
    let y = lat - 0.006
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * constant.x_PI)
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * constant.x_PI)
    let gcj02Lng = z * Math.cos(theta)
    let gcj02Lat = z * Math.sin(theta)
    return [gcj02Lng, gcj02Lat]
}

/**
 * GCJ02转化为BD09
 * @param lng
 * @param lat
 * @returns {number[]}
 */
export function gcj02ToBD09 (lng, lat) {
    let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * constant.x_PI)
    let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * constant.x_PI)
    let bdLng = z * Math.cos(theta) + 0.0065
    let bdLat = z * Math.sin(theta) + 0.006
    return [bdLng, bdLat]
}

/**
 * WGS84转化为GCJ02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function wgs84ToGCJ02 (lng, lat) {
    if (outOfChina(lng, lat)) {
        return [lng, lat]
    } else {
        let dlat = transformLat(lng - 105.0, lat - 35.0)
        let dlng = transformLng(lng - 105.0, lat - 35.0)
        let radlat = lat / 180.0 * constant.PI
        let magic = Math.sin(radlat)
        magic = 1 - constant.ee * magic * magic
        let sqrtmagic = Math.sqrt(magic)
        dlat = (dlat * 180.0) / ((constant.a * (1 - constant.ee)) / (magic * sqrtmagic) * constant.PI)
        dlng = (dlng * 180.0) / (constant.a / sqrtmagic * Math.cos(radlat) * constant.PI)
        let mglat = lat + dlat
        let mglng = lng + dlng
        return [mglng, mglat]
    }
}

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function gcj02ToWGS84 (lng, lat) {
    if (outOfChina(lng, lat)) {
        return [lng, lat]
    } else {
        let dlat = transformLat(lng - 105.0, lat - 35.0)
        let dlng = transformLng(lng - 105.0, lat - 35.0)
        let radlat = lat / 180.0 * constant.PI
        let magic = Math.sin(radlat)
        magic = 1 - constant.ee * magic * magic
        let sqrtmagic = Math.sqrt(magic)
        dlat = (dlat * 180.0) / ((constant.a * (1 - constant.ee)) / (magic * sqrtmagic) * constant.PI)
        dlng = (dlng * 180.0) / (constant.a / sqrtmagic * Math.cos(radlat) * constant.PI)
        let mglat = lat + dlat
        let mglng = lng + dlng
        return [lng * 2 - mglng, lat * 2 - mglat]
    }
}

/**
 * 判断是否在国内
 * @param lng
 * @param lat
 * @returns {boolean}
 */
function outOfChina (lng, lat) {
    // 纬度3.86~53.55,经度73.66~135.05
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55)
}

/**
 * 转化纬度
 * @param lng
 * @param lat
 * @returns {number}
 */
function transformLat (lng, lat) {
    let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
    ret += (20.0 * Math.sin(6.0 * lng * constant.PI) + 20.0 * Math.sin(2.0 * lng * constant.PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(lat * constant.PI) + 40.0 * Math.sin(lat / 3.0 * constant.PI)) * 2.0 / 3.0
    ret += (160.0 * Math.sin(lat / 12.0 * constant.PI) + 320 * Math.sin(lat * constant.PI / 30.0)) * 2.0 / 3.0
    return ret
}

/**
 * 转化纬度
 * @param lng
 * @param lat
 * @returns {*}
 */
function transformLng (lng, lat) {
    let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
    ret += (20.0 * Math.sin(6.0 * lng * constant.PI) + 20.0 * Math.sin(2.0 * lng * constant.PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(lng * constant.PI) + 40.0 * Math.sin(lng / 3.0 * constant.PI)) * 2.0 / 3.0
    ret += (150.0 * Math.sin(lng / 12.0 * constant.PI) + 300.0 * Math.sin(lng / 30.0 * constant.PI)) * 2.0 / 3.0
    return ret
}
