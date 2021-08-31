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
        <div class="describe">
          <div class="describe__data">
            評価値：{{
              Math.floor((10000 / (evaluationValue * -1)) * 100) / 100
            }}
          </div>
          <div class="describe__map">入り口</div>
        </div>
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
          <div class="desk" :style="deskClass(rowIndex)"></div>
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
  private evaluationValue = 0;

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

  private deskClass(index: number): string {
    if (index % 2 == 1) return "background-color: white;";
    return "background-color: rgb(211, 136, 51)";
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
      x.push(data[1]); //横
      y.push(data[0]); //たて
    });
    return this.array_variance(x) + this.array_variance(y) * 15;
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
    let best = -420000000000000; //テキトウだよ！！！！
    let answer: number[][] = [[]];
    const resource = JSON.parse(JSON.stringify(this.people));
    [...Array(4000000)].forEach(() => {
      //ここで回数指定できるよ！！！！！
      let score = 0;
      this.array_shuffle(resource);
      this.$store.state.groups.forEach((groupData: any) => {
        if (score < best) return;
        score -= this.array_evaluation(groupData, resource);
      });
      if (score > best) {
        best = score;
        answer = JSON.parse(JSON.stringify(resource));
      }
    });
    this.evaluationValue = best;
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
.describe {
  display: flex;
  margin-bottom: 1%;
  &__data {
    width: 70%;
  }
  &__map {
    font-size: 1.4rem;
  }
}
.seat-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
}
.desk {
  width: 100%;
  padding-top: 4%;
  // background-color: rgb(211, 136, 51);
}
.seat-col {
  width: 20%;

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
