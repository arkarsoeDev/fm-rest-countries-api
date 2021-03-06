import { createStore } from "vuex";
import CountrySerivce from "@/services/CountryService.js";
export default createStore({
  state: {
    loading: false,
    themeDark: false,
    countries: [],
    searchCountry: [],
    searchCountryName: "",
    showCountries: [],
    region: "",
    countriesByRegion: [],
  },
  mutations: {
    CHANGE_THEME(state, value) {
      state.themeDark = value;
    },
    SET_COUNTRIES(state, value) {
      state.countries = value;
    },
    SET_SEARCH_COUNTRY(state, countryArr) {
      state.searchCountry = countryArr;
    },
    SET_SEARCH_COUNTRY_NAME(state, countryName) {
      state.searchCountryName = countryName;
    },
    SET_REGION(state, region) {
      state.region = region;
    },
    SET_COUNTRIES_BY_REGION(state, countryArr) {
      state.countriesByRegion = countryArr;
    },
    SET_SHOW_COUNTRIES(state, value) {
      state.showCountries = value;
    },
    SET_LOADING(state, value) {
      state.loading = value;
    },
  },
  actions: {
    changeTheme({ commit }, payload) {
      commit("CHANGE_THEME", payload);
    },
    fetchCountries({ state, commit, dispatch }) {
      if (!state.countries.length > 0) {
        commit("SET_LOADING", true);
        return CountrySerivce.getAllData()
          .then((response) => {
            commit("SET_COUNTRIES", response.data);
            dispatch("setShowCountries");
            commit("SET_LOADING", false);
          })
          .catch((error) => {
            commit("SET_LOADING", false);
            throw error;
          });
      }
    },
    searchCountry({ state, commit, dispatch, getters }, { newValue }) {
      if (state.searchCountryName !== newValue) {
        commit("SET_SEARCH_COUNTRY_NAME", newValue);
        let countryArr = [];
        if (newValue.length > 0) {
          countryArr = getters.getSearchCountry(newValue);
        }
        commit("SET_SEARCH_COUNTRY", countryArr);
        dispatch("setShowCountries");
      }
    },
    setRegion({ commit, getters, dispatch }, { region }) {
      commit("SET_REGION", region);
      let countries = [];
      countries = getters.getCountriesByRegion(region);
      commit("SET_COUNTRIES_BY_REGION", countries);
      dispatch("setShowCountries");
    },
    setShowCountries({ commit, getters }) {
      let countries = getters.getShowCountries;
      commit("SET_SHOW_COUNTRIES", countries);
    },
  },
  modules: {},
  getters: {
    getSearchCountry: (state) => (newValue) => {
      return state.countries.filter((country) =>
        country.name
          .toLowerCase()
          .replace(/\s/g, "")
          .includes(newValue.toLowerCase().replace(/\s/g, ""))
      );
    },
    getCountriesByRegion: (state) => (region) => {
      return state.countries.filter((country) => {
        return country.region === region;
      });
    },
    getShowCountries: (state) => {
      let returnValue = state.countries;
      // if user searching
      if (state.searchCountryName.length > 0) {
        // if filter is set
        if (state.region.length > 0) {
          // if filter is set & search country is exist
          if (state.searchCountry.length > 0) {
            returnValue = state.searchCountry.filter((country) => {
              return country.region === state.region;
            });
          } else {
            // if filter is set & search country doesn't exist
            returnValue = [];
          }
        } else if (state.searchCountry.length > 0) {
          // if filter is not set, user is searching & search country exist
          returnValue = state.searchCountry;
        } else {
          // if filter is not set, user is searching & search country doesn't exist
          returnValue = [];
        }
      } else if (state.region.length > 0) {
        // if user is not searching but filter is set
        returnValue = state.countriesByRegion;
      }
      return returnValue;
    },
    getCountry: (state) => (name) => {
      return state.countries.find((country) => country.name === name);
    },
  },
});
