import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome back",
      currentLocation: "Current Location",
      weather: "Weather Forecast",
      sos: "SOS Emergency"
    }
  },
  hi: {
    translation: {
      welcome: "वापसी पर स्वागत है",
      currentLocation: "वर्तमान स्थान",
      weather: "मौसम पूर्वानुमान",
      sos: "आपातकालीन SOS"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;