const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000,
    https: true,
    proxy: {
      '^/api/v1/': {
        target: 'https://localhost:7275',
        changeOrigin: true,
        ws: true,
        hostRewrite: 'localhost:7275'
      }
    }
  }
})
