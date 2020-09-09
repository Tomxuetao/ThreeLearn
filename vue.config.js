// vue.config.js
const path = require('path')

module.exports = {
  publicPath: './',
  filenameHashing: false,
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
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
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'ThreeLearn'
        args[0].favicon = 'public/favicon.ico'
        return args
      })
    // 别名配置
    config.resolve.alias.set('@scss', path.resolve(__dirname, './src/assets/scss'))
  }
}
