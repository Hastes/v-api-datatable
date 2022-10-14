import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#A3D3E4',
        secondary: '#464555',
        superdark: '#232328',
        // primary: '#A3D3E4', c dribbble
      },
    },
  },
});
