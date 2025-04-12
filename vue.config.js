const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000,
    https: true,
    proxy: {
      '^/api/v1/': {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        ws: true,
        hostRewrite: process.env.VUE_APP_API_REWRITE
      }
    }
  }
})
