const isProd = process.env.NODE_ENV === 'production';

const externals = isProd
  ? {
      'vuetify/lib': 'vuetify/lib',
      'vee-validate': 'vee-validate',
    }
  : {};

module.exports = {
  configureWebpack: {
    externals,
  },
  css: {
    extract: false,
  },
  transpileDependencies: ['vuetify'],
};
