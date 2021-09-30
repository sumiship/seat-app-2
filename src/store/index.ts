import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

// interface Group {
//   name: string;
//   volume: number;
//   member: number[];
// }

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      // ストレージのキーを指定。デフォルトではvuex
      key: "seat-app-2",

      // 管理対象のステートを指定。pathsを書かない時は`modules`に書いたモジュールに含まれるステート全て。`[]`の時はどれも保存されない
      paths: ["names", "groups", "people"],

      // ストレージの種類を指定する。デフォルトではローカルストレージ
    }),
  ],
  state: {
    names: [
      "member1",
      "member2",
      "member3",
      "member4",
      "member5",
      "member6",
      "member7",
      "member8",
      "member9",
      "member10",
      "member11",
      "member12",
      "member13",
      "member14",
      "member15",
      "member16",
      "member17",
      "member18",
      "member19",
      "member20",
      "member21",
      "member22",
      "member23",
      "member24",
    ],
    groups: [{ name: "sample", volume: 20, member: [0, 1, 2] }],
    people: [
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
      [6, 1],
      [6, 2],
      [6, 3],
      [6, 4],
    ],
  },
  mutations: {
    update_names(state, payload) {
      state.names = payload;
    },
    add_groups(state, payload) {
      state.groups.push(payload.saveData);
    },
    delete_groups(state, payload) {
      state.groups.splice(payload, 1);
    },
    update_people(state, payload) {
      state.people = payload;
    },
    replace_groups(state, payload) {
      state.groups.splice(payload[0], 1, payload[1]);
    }
  },
  actions: {
    swap_groups(context, ids) {
      const evacuation = this.state.groups[ids[0]];
      context.commit('replace_groups', [ids[0], this.state.groups[ids[1]]]);
      context.commit('replace_groups', [ids[1],evacuation]);
    }
  },
  modules: {},
});
