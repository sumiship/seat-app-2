import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      // ストレージのキーを指定。デフォルトではvuex
      key: "seat-app-2",

      // 管理対象のステートを指定。pathsを書かない時は`modules`に書いたモジュールに含まれるステート全て。`[]`の時はどれも保存されない
      paths: ["names", "groups"],

      // ストレージの種類を指定する。デフォルトではローカルストレージ
    }),
  ],
  state: {
    names: [
      "aaa",
      "bbb",
      "aaaｄ",
      "aaaff",
      "aaaefaf",
      "aaaefa",
      "aaaffff",
      "aaahh",
      "aaagsg",
      "aaagrssg",
      "aaahsth",
      "aaahthh",
      "aaamm",
      "aaahet5",
      "aaajytuje",
      "aaa76i",
      "aaa78ki",
      "aaa78i9",
      "aaa36u3j",
      "aaawth",
      "aaa245um",
      "aaaxty",
      "aaawjy",
      "aassssa",
    ],
    groups: [],
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
  },
  actions: {},
  modules: {},
});
