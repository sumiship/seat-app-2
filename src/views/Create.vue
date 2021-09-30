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
            :style="check(seatCol, imgDownloading)"
          >
            {{ $store.state.names[seatCol] }}
          </div>
          <div class="desk" :style="deskClass(rowIndex, imgDownloading)"></div>
        </div>
      </div>
      <div class="control">
        <div class="control__search" @click="action_control()">search</div>
        <div @click="imgDownload()">Download</div>
        <div
          class="control__circle"
          :style="circle_style(circleWidth)"
          v-if="isCircle"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import html2canvas from "html2canvas";

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
  private circleWidth = 0;
  private isCircle = false;
  private imgDownloading = false;

  private imgDownload(): void {
    this.imgDownloading = true;
    setTimeout(() => {
      const target = document.getElementsByClassName(
        "seat-box"
      )[0] as HTMLElement;
      html2canvas(target).then((canvas) => {
        let downloadEle = document.createElement("a");
        downloadEle.href = canvas.toDataURL("image/webp");
        downloadEle.download = "canvas.webp";
        downloadEle.click();
        this.imgDownloading = false;
      });
    }, 10);
  }

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

  private colors = [
    "rgb(240, 192, 200)",
    "rgb(236, 206, 110)",
    "rgb(139, 236, 110)",
    "rgb(110, 236, 219)",
    "rgb(149, 171, 241)",
    "rgb(204, 149, 241)",
    "rgb(241, 149, 149)",
    "rgb(253, 167, 117)",
  ];

  private circle_style(num: number): string {
    const now = 1 - num / document.body.offsetWidth / 1.5;
    return (
      "width: " +
      num +
      "px; height: " +
      num +
      "px; border-color: rgb(5, 156, 25," +
      now +
      "); border-width: " +
      (1 - now) * 150 +
      "px;"
    );
  }

  private circle_loop(num: number): void {
    this.isCircle = true;
    num += 30;
    if (num > document.body.offsetWidth * 1.5) {
      this.isCircle = false;
      this.circleWidth = 0;
      return;
    }
    this.circleWidth = num;
    setTimeout(this.circle_loop, 13, this.circleWidth);
  }

  private deskClass(index: number, bool: boolean): string {
    if (index % 2 == 1) return "background-color: #E4EBF5;";
    if (bool) return "background-color: #e0aa70; margin: 4px 0";
    return "background-color: #e0aa70; box-shadow:2px 2px 8px 1px #705c47; margin: 4px 0";
  }

  // @Watch("checkGroup")
  private check(id: number, bool: boolean): string {
    let style = "";
    if (!bool) style += "box-shadow: inset 0 0 3px 0 black;";
    this.$store.state.groups.map((group: GroupData, i: number) => {
      if (group.member.indexOf(id) != -1)
        style = style + "background-color: " + this.colors[i] + "; ";
    });
    if (this.checkGroup.indexOf(id) != -1)
      return style + "outline: solid 6px red; outline-offset: -6px";
    return style;
  }

  private highlight(member: number[]): void {
    this.checkGroup = member;
  }
  private unhighlight(): void {
    this.checkGroup = [];
  }

  private array_shuffle(arr: number[][] | string[]): void {
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
    console.log(document.body.offsetWidth);
    this.array_shuffle(this.colors);
    // this.loop_shuffle();
    this.circle_loop(this.circleWidth);
    // ここでsearch 処理中にアニメーションをしてみたかった
    this.search2();
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
    [...Array(3000000)].forEach(() => {
      //ここで回数指定できるよ！！！！！
      let score = 0;
      this.array_shuffle(resource);
      this.$store.state.groups.forEach((groupData: GroupData) => {
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

  //search2関連のものはこちらに（この中から分散計算などを呼び出すことはある）
  private async search2(): Promise<void> {
    let best = -420000000000000; //テキトウだよ！！！！
    const resource = JSON.parse(JSON.stringify(this.people));
    this.array_shuffle(resource);
    for (let ppp = 0; ppp < 30; ppp++) {
      //ここで回数指定できるよ！！！！！
      let shuffleList: number[][] = [];
      let prebest = best;
      for (let i = 0; i < 23; i++) {
        for (let j = i + 1; j < 24; j++) {
          let score = 0;
          const testArr = JSON.parse(JSON.stringify(resource));
          [testArr[i], testArr[j]] = [testArr[j], testArr[i]];
          this.$store.state.groups.forEach((groupData: GroupData) => {
            if (score < prebest) return;
            score -= this.array_evaluation(groupData, testArr);
          });
          if (score > best) {
            best = score;
            shuffleList = [[i, j]];
          } else if (score == best && score != prebest) {
            shuffleList.push([i, j]);
          }
        }
      }
      if (shuffleList.length == 0) {
        break;
      }
      // console.log(shuffleList);
      const doShuffle =
        shuffleList[Math.floor(Math.random() * shuffleList.length)];
      [resource[doShuffle[0]], resource[doShuffle[1]]] = [
        resource[doShuffle[1]],
        resource[doShuffle[0]],
      ];
    }
    this.evaluationValue = best;
    this.isSearching = false;
    this.people = JSON.parse(JSON.stringify(resource));
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
  box-shadow: 0px 0px 10px 0px rgb(79, 190, 153);
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
    background-color: #4dd899;
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
.seat-box {
  background-color: #e4ebf5;
  padding: 2%;
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
  margin: 3px 0;
  background-color: #705c47;
}
.seat-col {
  width: 20%;
  background-color: white;
  font-size: 1.7rem;
}
.control {
  margin-top: 10px;
  position: relative;
  &__search {
    background-color: rgba(238, 74, 9, 0.445);
    display: inline-block;
    padding: 5px 12px;
    font-size: 1.2rem;
    border-radius: 8px;
    &:hover {
      background-color: rgba(238, 74, 9, 0.692);
      cursor: pointer;
      box-shadow: 0px 0px 6px 0px rgb(131, 74, 21);
    }
    &:active {
      box-shadow: inset 0px 0px 6px 0px rgb(131, 74, 21);
    }
  }
  &__circle {
    position: absolute;
    width: 500px;
    height: 500px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 10px solid rgb(5, 156, 25);
    border-radius: 100%;
  }
}
</style>
