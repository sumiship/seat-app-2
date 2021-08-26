<template>
  <div class="edit-name">
    <div class="name" v-for="(name, index) in names" :key="index">
      <input class="name__input" type="text" v-model="names[index]" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({})
export default class EditName extends Vue {
  private names = this.$store.state.names;

  @Watch("names")
  updateNames(): void {
    this.$store.commit("update_names", this.names);
  }
}
</script>
<style lang="scss" scoped>
.edit-name {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.name {
  width: 30%;
  margin: 10px 0;
  padding: 10px 0;
  background-color: rgb(44, 216, 159);
  &__input {
    width: 90%;
    font-size: 2rem;
    text-align: center;
    border: none;
    outline: none;
  }
}
</style>
