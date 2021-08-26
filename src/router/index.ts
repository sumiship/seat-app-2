import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import EditName from "../views/EditName.vue";
import EditGroup from "../views/EditGroup.vue";
import Create from "../views/Create.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "EditName",
    component: EditName,
  },
  {
    path: "/EditGroup",
    name: "EditGroup",
    component: EditGroup,
  },
  {
    path: "/Create",
    name: "Create",
    component: Create,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
