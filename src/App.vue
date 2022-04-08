<template>
  <div class="theme" :class="{ dark: themeDark }">
    <header>
      <Nav></Nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>
<script>
import Nav from "@/components/Nav";
export default {
  name: "App",
  components: {
    Nav,
  },
  computed: {
    themeDark() {
      return this.$store.state.themeDark;
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/app/scss/main";
</style>
