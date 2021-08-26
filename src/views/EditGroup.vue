<template>
  <div class="edit-group">
    <div class="groups">
      <div
        class="group"
        v-for="(group, index) in $store.state.groups"
        :key="index"
      >
        <div class="group__title">{{ group.name }}</div>
        <div class="group__volume">重要度：{{ group.volume }}</div>
        <div class="group__members">
          <span
            v-for="(member, member_index) in group.member"
            :key="member_index"
          >
            {{ $store.state.names[member] }}
          </span>
        </div>
        <div class="group__delete" @click="delete_group(index)">削除</div>
      </div>
      <div class="group-add" @click="toggle_modal()">
        <div class="group-add__button">+</div>
      </div>
    </div>
    <div class="modal" v-if="modal" @click.self="toggle_modal()">
      <div class="edit-box">
        <div class="edit-box__names">
          <div
            class="name"
            v-for="(name, index) in $store.state.names"
            :key="index"
            :class="class_select(index)"
            @click="select_name(index)"
          >
            {{ name }}
          </div>
        </div>
        <div class="edit-box__foot">
          <div class="edit-box-foot__title edit-title">
            <p class="edit-title__name">Group name</p>
            <input type="text" class="edit-title__input" v-model="groupName" />
          </div>
          <div class="edit-box-foot__volume edit-volume">
            <p class="edit-volume__name">重要度: {{ volume }}</p>
            <input
              class="edit-volume__input"
              type="range"
              min="0"
              max="100"
              v-model="volume"
            />
          </div>
          <div class="edit-box-foot__button">
            <div class="edit-add-button" @click="add_group()">追加</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class EditGroup extends Vue {
  private volume = "50";
  private groupName = "";
  private selectedNames: number[] = [];
  private modal = false;

  private class_select(index: number): string {
    if (this.selectedNames.indexOf(index) != -1) return "selected";
    return "noselected";
  }

  private toggle_modal(): void {
    this.modal = !this.modal;
  }

  private select_name(index: number): void {
    let where = this.selectedNames.indexOf(index);
    if (where == -1) {
      this.selectedNames.push(index);
    } else {
      this.selectedNames.splice(where, 1);
    }
  }

  private add_group(): void {
    const saveData = {
      name: this.groupName,
      volume: Number(this.volume),
      member: this.selectedNames,
    };
    this.$store.commit("add_groups", { saveData });
  }

  private delete_group(index: number): void {
    this.$store.commit("delete_groups", index);
  }
}
</script>
<style lang="scss" scoped>
.groups {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.group {
  box-shadow: 0 0 2px 2px aquamarine;
  margin: 20px;
  padding: 25px 20px 10px;
  position: relative;
  border-radius: 10px;
  &__title {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: aquamarine;
    border-radius: 10px;
    color: rgb(133, 133, 133);
    font-size: 1.4rem;
    padding: 5px 12px;
  }
  &__volume {
    padding: 5px 0;
    font-size: 1.1rem;
  }
  &__members {
    padding: 5px 0 10px;
    font-size: 1.3rem;
  }
  &__delete {
    background-color: rgba(238, 74, 9, 0.445);
    display: inline-block;
    padding: 5px 12px;
    border-radius: 10px;
    &:hover {
      cursor: pointer;
      background-color: rgba(238, 74, 9, 0.692);
    }
  }
}
.group-add {
  &:hover {
    cursor: pointer;
    & .group-add__button {
      box-shadow: 0 0 2px 2px rgb(104, 194, 164);
    }
  }
  &__button {
    background-color: aquamarine;
    width: 90px;
    height: 90px;
    font-size: 60px;
    border-radius: 100%;
    color: rgb(133, 133, 133);
  }
}
.edit-group {
  // position: relative;
}
.modal {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(87, 84, 84, 0.438);
}
.edit-box {
  width: 90%;
  position: absolute;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  background-color: aliceblue;
  padding: 20px;
  &__names {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  &__foot {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
.edit-title {
  &__name {
    font-size: 1.4rem;
  }
  &__input {
    font-size: 1.5rem;
    outline: none;
    text-align: center;
  }
}
.edit-volume {
  width: 20%;
  &__name {
    font-size: 1.4rem;
  }
  &__input {
    width: 100%;
  }
}
.edit-add-button {
  background-color: rgba(238, 74, 9, 0.445);
  padding: 12px 18px;
  border-radius: 7px;
  &:hover {
    cursor: pointer;
    background-color: rgba(238, 74, 9, 0.692);
  }
}
.name {
  width: 16%;
  background-color: rgb(209, 245, 233);
  padding: 2% 0;
  margin-bottom: 10px;
  font-size: 1.3rem;
  &:hover {
    cursor: pointer;
  }
  &.selected {
    background-color: rgb(90, 252, 198);
  }
}
</style>
