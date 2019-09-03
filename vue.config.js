// vue.config.js
const path = require('path')
// 是否为生产环境
const isProd = process.env.NODE_ENV === 'production'
module.exports = {
    publicPath: './',
    filenameHashing: false,
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    configureWebpack: config => {
        if (isProd) {
            // 关闭代理
            process.env.OPEN_PROXY = false
        } else {
            // 启用代理
            process.env.OPEN_PROXY = true
        }
    },
    chainWebpack: config => {
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
        const svgRule = config.module.rule('svg')
        // 清除已有的所有 loader。
        // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
        svgRule.uses.clear()
        svgRule
            .test(/\.svg$/)
            .include.add(path.resolve(__dirname, './src/icons'))
            .end()
            .use('svg-sprite')
            .loader('svg-sprite-loader')
            .options({
                symbolId: '[name]'
            })
        const fileRule = config.module.rule('file')
        fileRule.uses.clear()
        fileRule
            .test(/\.svg$/)
            .exclude.add(path.resolve(__dirname, './src/icons'))
            .end()
            .use('file-loader')
            .loader('file-loader')
        // 打包分析工具
        config
            .plugin('webpack-bundle-analyzer')
            .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        // html插件
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'Venus快速开发'
                args[0].favicon = 'public/favicon.ico'
                return args
            })
        // 别名配置
        config.resolve.alias.set('@scss', path.resolve(__dirname, './src/assets/scss'))
    }
}
