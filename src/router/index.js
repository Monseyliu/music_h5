import Vue from 'vue'
import VueRouter from 'vue-router'

// 一级路由区域
const Home = () => import(/*webpackChunkName: "home-home"*/'../pages/home/Home');
const User = () => import(/*webpackChunkName: "user-user"*/'common/user-center/user-center');

// 二级路由
const Rank = () => import(/*webpackChunkName: "home-rank"*/'../pages/rank/Rank');
const Recommend = () => import(/*webpackChunkName: "home-recommend"*/'../pages/recommend/Recommend');
const Search = () => import(/*webpackChunkName: "home-search"*/'../pages/search/Search');
const Singer = () => import(/*webpackChunkName: "home-singer"*/'../pages/singer/Singer');

// Singer 子路由
const SingerDetail = () => import(/*webpackChunkName: "singer-detail"*/'components/common/singer-detail/singer-detail');
const Disc = () => import(/*webpackChunkName: "singer-detail"*/'common/disc/disc');
const TopList = () => import(/*webpackChunkName: "singer-detail"*/'common/top-list/top-list');

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home', component: Home, children: [
      { path: '/home', redirect: '/recommend' },
      {
        path: '/rank', component: Rank, children: [
          { path: ':id', component: TopList }
        ]
      },
      {
        path: '/recommend', component: Recommend, children: [
          { path: ':id', component: Disc }
        ]
      },
      {
        path: '/search', component: Search, children: [
          { path: ':id', component: SingerDetail }
        ]
      },
      {
        path: '/singer', component: Singer, children: [
          { path: ':id', component: SingerDetail }
        ]
      },
      { path: '/user', component: User }
    ]
  },
  

]

const router = new VueRouter({
  routes
})

export default router
