import Home from "../views/Home.vue";
import MovieDetail from "@/views/MovieDetail.vue";
import Form from "@/components/Form.vue";

import { createRouter, createWebHistory } from "vue-router";
import Users from "../views/Users.vue";

const routes = [
  {
    path: "/users",
    component: Users,
    children: [
      {
        path: "/",
        redirect: "/home",
      },
      { path: "home", component: Home },

      { path: "form", component: Form },

      { path: "detail/:id", component: MovieDetail },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
