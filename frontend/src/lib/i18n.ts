import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en/en.json";
import es from "../locales/es/es.json";
import jp from "../locales/jp/jp.json";
import ph from "../locales/ph/ph.json";

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: "en",
  resources: {
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
    jp: {
      translation: jp,
    },
    ph: {
      translation: ph,
    },
  },
});
