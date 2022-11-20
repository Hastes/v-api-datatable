<template lang="pug">
  .d-flex.justify-end
    v-menu(
      v-model="menu"
      :close-on-content-click="false"
      offset-y
      left
      min-width="290px"
    )
      template(v-slot:activator="{ on }")
        slot(name="activator" v-bind="{ on }")
          v-badge(
            color="primary"
            :content="excludedHeaders.length"
            :value="excludedHeaders.length"
            overlap
          )
            v-btn(icon v-on="on")
              v-icon mdi-cog
      v-card
        .d-flex.justify-center.pa-2
          v-btn.mr-2.flex-grow-1(
            small
            :text="isAbleToClear"
            :disabled="!isAbleToClear"
            @click="reset"
          ) Сброс
          v-btn.flex-grow-1(
            color="primary"
            small
            depressed
            @click="menu = false"
          ) Ок
        v-list(nav)
          v-subheader Видимые поля
          v-list-item.st-settings-list(
            v-for="(header, idx) in headers"
            @click=""
            :key="header.value"
          )
            v-list-item-action.my-0
              v-checkbox(
                v-if="!isPinHeader(header)"
                v-model="selected"
                color="secondary"
                :value="header.value"
                @input="toggle(header)"
              )
            v-list-item-content(
              @click="toggle(header)"
            )
              v-list-item-title
                span {{ header.text | empty }}
            v-list-item-action.my-0(
              :class=`isPinHeader(header)
                ? 'st-settings-list__pinned'
                : 'st-settings-list__pinable'
              `
            )
              v-btn(
                :color="isPinHeader(header) ? 'primary' : 'grey'"
                @click="pin(header)"
                fab
                small
                text
              )
                v-icon mdi-pin
</template>

<script>
import difference from 'lodash/difference';
import clone from 'lodash/clone';

export default {
  name: 'TableSettings',
  filters: {
    empty(val) {
      return val || 'Действия';
    },
  },
  props: {
    value: { type: Array, default: () => [] },
    headers: { type: Array, default: () => [] },
    pinnedHeader: { type: Object, default: null },
  },
  data: () => ({
    menu: false,
    selected: [],
    pinHeader: null,
  }),
  computed: {
    /**
     * Active Headers
     *
     * visible in the table
     */
    input: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    excludedHeaders() {
      let excluded = difference(
        this.headers.map((h) => h.value),
        this.selected,
      );
      if (this.pinHeader) excluded = [...excluded, this.pinHeader.value];
      return excluded;
    },
    isAbleToClear() {
      return !!(this.excludedHeaders.length || this.pinHeader);
    },
  },
  watch: {
    headers() {
      this.init();
    },
    excludedHeaders() {
      this.setActiveHeaders();
    },
    pinHeader(val) {
      this.$emit('update:pinnedHeader', val);
      this.setActiveHeaders();
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.selected = clone(this.input.map((h) => h.value));
      this.pinHeader = this.input.find((h) => h.pinned);
    },
    reset() {
      this.selected = clone(this.headers.map((h) => h.value));
      this.pinHeader = null;
    },
    setActiveHeaders() {
      const pinHeader = this.pinHeader
        ? [{ ...this.pinHeader, pinned: true }]
        : [];
      // Visible headers in the table
      this.input = [
        ...pinHeader,
        ...this.headers.filter((h) => !this.excludedHeaders.includes(h.value)),
      ];
    },
    toggle(val) {
      const i = this.selected.indexOf(val.value);

      if (i > -1) {
        this.selected.splice(i, 1);
      } else {
        this.selected.push(val.value);
      }
    },
    pin(header) {
      this.pinHeader = this.isPinHeader(header) ? null : header;
    },
    isPinHeader(header) {
      return this.pinHeader && header.value === this.pinHeader.value;
    },
  },
};
</script>

<style lang="scss" scoped>
.st-settings-list {
  &__pinable {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  &:hover {
    .st-settings-list__pinable {
      opacity: 1;
    }
  }
}
</style>
