import Vue from "vue";
import Vuex from "vuex";

import map from "./modules/map";
import spots from "./modules/spots";
import regions from "./modules/regions";
import auth from "./modules/auth";
import users from "./modules/users";
import images from "./modules/images";
import categories from "./modules/categories";

Vue.use(Vuex);

const state = {
  lang: "de",
  languages: [
    {
      code: "de",
      name: "Deutsch"
    },
    {
      code: "fr",
      name: "Français"
    },
    {
      code: "en",
      name: "English"
    }
  ],
  prismicLang: "de-ch",
  pendingCount: 0,
  msg: "",
  sort: "shame"
};

const mutations = {
  SET_LANG(state, lang) {
    state.lang = lang;
  },
  SET_PRISMIC_LANG(state, lang) {
    state.prismicLang = lang;
  },
  SET_ENTRY_SORTING(state, sort) {
    state.sort = sort;
  },
  SET_MESSAGE(state, msg) {
    state.msg = msg;

    setTimeout(
      function() {
        state.msg = "";
      }.bind(this),
      2000
    );
  },
  LOAD_START(state) {
    state.pendingCount += 1;
  },
  LOAD_FINISH(state) {
    state.pendingCount -= 1;
  }
};

const actions = {
  setEntrySorting(context, sort) {
    if (sort != "location" && sort != "fame" && sort != "shame") return;

    if (context.state.sort != sort) {
      context.commit("SET_ENTRY_SORTING", sort);
      context.dispatch("loadEntries");
    }
  },

  handleError(context, msg) {
    let _msg = msg;
    if (msg.de) {
      _msg = msg[context.state.lang];
    }
    
    context.commit("SET_MESSAGE", _msg);
  },

  setLang(context, lang) {
    localStorage.setItem("lang", lang);
    context.commit("SET_LANG", lang);

    switch (lang) {
      case "de":
        context.commit("SET_PRISMIC_LANG", "de-ch");
        break;
      case "en":
        context.commit("SET_PRISMIC_LANG", "en-gb");
        break;
      case "fr":
        context.commit("SET_PRISMIC_LANG", "fr-ch");
        break;
      default:
        context.commit("SET_PRISMIC_LANG", "de-ch");
    }
  }
};

const getters = {
  pendingCount: state => {
    return state.pendingCount;
  },
  msg: state => {
    return state.msg;
  },
  lang: state => {
    return state.lang;
  },
  prismicLang: state => {
    return state.prismicLang;
  },
  languages: state => {
    return state.languages;
  }
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    auth,
    spots,
    regions,
    map,
    users,
    images,
    categories
  }
});
