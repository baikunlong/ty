module.exports = {
  // 开发服务器端口与 host 配置，可直接局域网访问
  devServer: {
    port: 8090,
    open: true,
    host: '0.0.0.0'
  },
  // 打包输出到项目下的 dist 目录
  outputDir: 'dist',
  publicPath: './'
}
