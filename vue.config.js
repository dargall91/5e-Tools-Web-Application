const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000,
    https: true,
    proxy: {
      '^/5eTools/api/': {
        target: 'https://localhost:8080',
        changeOrigin: true,
        ws: true,
        hostRewrite: 'localhost:8080'
      }
    }
  }
})
