<template>
  <div>
    <input type="checkbox" v-if="show" />
    <input type="text" v-model="content" />
  </div>
</template>

<script>
export default {
  name: "todoHeader",
  data() {
    return {
      content: "",
    };
  },
  props: {
    show: {
      type: Boolean,
      required: ture,
    },
  },
  watch: {
    content: function () {
      this.$emit("input", this.content);
    },
  },
};
</script>