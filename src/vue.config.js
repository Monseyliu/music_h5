module.exports = {
    devServer: {
      open: true,
      host: '0.0.0.0', //localhost
      port: 8080,
      https: false,
      hotOnly: false,
      proxy: {
        // 配置跨域
        // '/api': {
        //   target: 'https://c.iwanmen.com/element/api/',
        //   ws: true,
        //   changOrigin: true,
        //   pathRewrite: {
        //     '^/api': ''
        //   }
        // }
      },
      chainWepack: (config) => {
        config.resolve.alias
          .set('style', path.join(__dirname, './src/assets/style'))
          .set('@', path.join(__dirname, './src/'))
          .set('components', path.join(__dirname, './src/components/common'))
      },
      before: app => {}
    }
  };
  