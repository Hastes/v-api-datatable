module.exports = {
  configureWebpack: {
    externals: {
      'vuetify/lib': 'vuetify/lib',
      'vee-validate': 'vee-validate',
    },
  },
  css: {
    extract: false,
  },
  transpileDependencies: ['vuetify'],
};
