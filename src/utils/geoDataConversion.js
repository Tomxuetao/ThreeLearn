/**
 * 数据库默认存储WGS84的数据
 */
import { gcj02ToWGS84 } from './coordtransform'

/**
 * 将获取的多边形轮廓线节点数组，转化成GeomText,坐标系使用WGS84
 * @param path
 * @returns {string}
 */
export function convertAMapPath2WGS84GeomText (path = []) {
    let geomText = ''
    path.forEach(item => {
        let coord = gcj02ToWGS84(item.lng, item.lat)
        geomText += coord[0] + ' ' + coord[1] + ','
    })
    let last = gcj02ToWGS84(path[0].lng, path[0].lat)
    geomText += last[0] + ' ' + last[1]
    return 'POLYGON((' + geomText + '))'
}

/**
 * 将获取的多边形轮廓线节点数组，转化成GeomText,坐标系使用火星系
 * @param path
 * @returns {string}
 */
export function convertAMapPath2GCJ02GeomText (path = []) {
    let geomText = ''
    path.forEach(item => {
        geomText += item.lng + ' ' + item.lat + ','
    })
    geomText += path[0].lng + ' ' + path[0].lat
    return 'POLYGON((' + geomText + '))'
}
