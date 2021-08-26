<template>
  <div class="create">
    <div class="groups">
      <div
        class="group"
        v-for="(group, index) in $store.state.groups"
        :key="index"
        @mouseover="highlight(group.member)"
        @mouseleave="unhighlight()"
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
      </div>
    </div>
    <div class="main">
      <div class="seat-box">
        <div
          class="seat-row"
          v-for="(seatRow, rowIndex) in people2seat(people)"
          :key="rowIndex"
        >
          <div
            class="seat-col"
            v-for="(seatCol, colIndex) in seatRow"
            :key="colIndex"
            :class="check(seatCol)"
          >
            {{ $store.state.names[seatCol] }}
          </div>
        </div>
      </div>
      <div class="control">
        <div class="control__search" @click="action_control()">search</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

interface GroupData {
  name: string;
  volume: number;
  member: number[];
}

@Component({})
export default class Create extends Vue {
  private people = this.$store.state.people;
  private isSearching = false;
  private checkGroup: number[] = [];

  private people2seat(people: number[][]): number[][] {
    let seat = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    people.forEach((person: number[], index: number) => {
      seat[person[0] - 1][person[1] - 1] = index;
    });
    return seat;
  }

  @Watch("checkGroup")
  private check(id: number): string {
    if (this.checkGroup.indexOf(id) != -1) return "check";
    return "";
  }

  private highlight(member: number[]): void {
    this.checkGroup = member;
  }
  private unhighlight(): void {
    this.checkGroup = [];
  }

  private array_shuffle(arr: number[][]): void {
    for (let i = arr.length; 1 < i; i--) {
      const key = Math.floor(Math.random() * i);
      [arr[key], arr[i - 1]] = [arr[i - 1], arr[key]];
    }
  }

  // private loop_shuffle(): void {
  //   // if (this.isSearching) return;
  //   this.array_shuffle(this.people);
  //   console.log("shuffle");
  //   this.people = JSON.parse(JSON.stringify(this.people));
  //   setTimeout(this.loop_shuffle, 300);
  // }

  private action_control(): void {
    this.isSearching = true;
    // this.loop_shuffle();
    // ここでsearch 処理中にアニメーションをしてみたかった
    this.search();
  }

  private array_ave(arr: number[]): number {
    return arr.reduce((previous, current) => previous + current) / arr.length;
  }
  private array_variance(arr: number[]): number {
    return (
      this.array_ave(arr.map((current) => current ** 2)) -
      this.array_ave(arr) ** 2
    );
  }
  private array_varianceVec2(arr: number[][]): number {
    let x: number[] = [];
    let y: number[] = [];
    arr.forEach((data) => {
      x.push(data[0]);
      y.push(data[1]);
    });
    return this.array_variance(x) + this.array_variance(y);
  }
  private array_evaluation(groupData: GroupData, resource: number[][]): number {
    let seatList: number[][] = [];
    groupData.member.forEach((data) => {
      seatList.push(resource[data]);
    });
    return (
      (Math.floor(this.array_varianceVec2(seatList) * 100000) / 100000) *
      groupData.volume
    );
  }

  private search(): void {
    let best = -420000000000000;
    let answer: number[][] = [[]];
    const resource = JSON.parse(JSON.stringify(this.people));
    [...Array(1000000)].forEach(() => {
      let score = 0;
      this.array_shuffle(resource);
      this.$store.state.groups.forEach((groupData) => {
        if (score < best) return;
        score -= this.array_evaluation(groupData, resource);
      });
      if (score > best) {
        best = score;
        answer = JSON.parse(JSON.stringify(resource));
      }
    });
    this.isSearching = false;
    this.people = JSON.parse(JSON.stringify(answer));
    this.$store.commit("update_people", this.people);
  }
}
</script>
<style lang="scss" scoped>
.create {
  display: flex;
  justify-content: space-around;
}
.groups {
  width: 23%;
  height: 80vh;
  overflow-y: scroll;
  padding: 3px;
  box-shadow: inset 0px 0px 10px 0px #42b983;
}
.group {
  box-shadow: 0px 0px 10px 0px aquamarine;
  margin: 32px 20px 38px;
  padding: 25px 20px 10px;
  // border: 1px solid #42b983;
  position: relative;
  // z-index: -1;
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
    & span {
      display: inline-block;
      padding: 0 3px;
    }
  }
  &:hover {
    cursor: help;
  }
}
.main {
  width: 73%;
}
.seat-row {
  display: flex;
  width: 100%;
}
.seat-col {
  width: 25%;
  font-size: 1.3rem;
  &.check {
    background-color: pink;
  }
}
.control {
  &__search {
    background-color: rgba(238, 74, 9, 0.445);
    display: inline-block;
    padding: 5px 12px;
    font-size: 1.2rem;
    border-radius: 8px;
    &:hover {
      background-color: rgba(238, 74, 9, 0.692);
      cursor: pointer;
    }
  }
}
</style>
