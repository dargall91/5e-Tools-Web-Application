const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000,
    https: true,
    proxy: {
      '^/api/v1/': {
        target: `http://localhost:${process.env.VUE_APP_API_URL}/api/v1`,
        changeOrigin: true,
        ws: true,
        hostRewrite: `localhost:${process.env.VUE_APP_API_PORT}`
      }
    }
  }
})
