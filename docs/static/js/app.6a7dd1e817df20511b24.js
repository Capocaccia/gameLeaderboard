webpackJsonp([1],{NHnr:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=t("7+uW"),i={render:function(){var e=this.$createElement,n=this._self._c||e;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},staticRenderFns:[]};var s=t("VU/8")({name:"App"},i,!1,function(e){t("RMMT")},null,null).exports,r=t("/ocq"),o=t("Sazm"),l=t.n(o).a.initializeApp({apiKey:"AIzaSyDt7EQc_GVKqPHWGtw_nT6osO63hOB4cIs",databaseURL:"https://unoleaderboard.firebaseio.com/",storageBucket:"unoleaderboard"}).database(),c=l.ref("/"),d={name:"Home",data:function(){return{name:"",winners:[],logWin:!1,leader:"",leaderCount:0,totalGames:0}},methods:{sendToFirebase:function(){var e=new Date,n={name:this.name,date:e.toDateString()};this.logWin=!1,l.ref("/").push(n)},logWinner:function(){this.logWin=!0},removeWinner:function(e){l.ref("/"+e).remove()},getTopLeader:function(){var e={};for(var n in this.winners)void 0===e[this.winners[n].name]?e[this.winners[n].name]=1:e[this.winners[n].name]++,this.totalGames++;for(var n in e)0===this.leaderCount?this.leaderCount=e[n]:e[n]>this.leaderCount&&(this.leaderCount=e[n]),this.leader=e[n]===this.leaderCount?n:this.leader}},mounted:function(){var e=this;c.on("value",function(n){var t=[];n.forEach(function(e){var n=e.val();n.key=e.key,t.push(n)}),e.winners=t})}},u={render:function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"dashboard"},[e.logWin?e._e():t("button",{staticClass:"log-win btn-3d green",on:{click:function(n){e.logWinner()}}},[e._v("Log Win")]),e._v(" "),e.logWin?t("div",{staticClass:"log-winner"},[t("div",[t("input",{directives:[{name:"model",rawName:"v-model",value:e.name,expression:"name"}],attrs:{placeholder:"Winners Name",type:"text"},domProps:{value:e.name},on:{input:function(n){n.target.composing||(e.name=n.target.value)}}})]),e._v(" "),t("div",[t("button",{on:{click:function(n){e.sendToFirebase()}}},[e._v("Log Winner")]),e._v(" "),t("button",{on:{click:function(n){e.logWin=!1}}},[e._v("Close")])])]):e._e(),e._v(" "),t("h1",{staticClass:"top-leader"},[e._v("Current leader is: "+e._s(e.leader)+" with "+e._s(e.leaderCount)+" wins!")]),e._v(" "),t("h2",{staticClass:"total-games"},[e._v("Total Games Played: "+e._s(e.totalGames))]),e._v(" "),t("div",{staticClass:"leaderboard"},[t("h2",[e._v("Leaderboard")]),e._v(" "),e._l(e.winners,function(n){return t("div",{staticClass:"winner"},[t("div",{staticClass:"divider"}),e._v(" "),t("div",{staticClass:"winner-data"},[t("div",{staticClass:"winner-name"},[t("span",{staticClass:"label"},[e._v("Winner:")]),e._v(" "+e._s(n.name)+"\n        ")]),e._v(" "),t("div",{staticClass:"winner-date"},[t("span",{staticClass:"label"},[e._v("On:")]),e._v(" "+e._s(n.date)+"\n        ")]),e._v(" "),t("button",{on:{click:function(t){e.removeWinner(n.key)}}},[e._v("Delete")])])])})],2)])},staticRenderFns:[]};var v=t("VU/8")(d,u,!1,function(e){t("Yteu")},"data-v-124c5e25",null).exports;a.a.use(r.a);var m=new r.a({routes:[{path:"/",name:"Home",component:v}]});a.a.config.productionTip=!1,new a.a({el:"#app",router:m,components:{App:s},template:"<App/>"})},RMMT:function(e,n){},Yteu:function(e,n){}},["NHnr"]);
//# sourceMappingURL=app.6a7dd1e817df20511b24.js.map