import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome back",
      currentLocation: "Current Location",
      locationDetails: "Your live location details",
      fetchingAddress: "Fetching address...",
      coordinates: "Coordinates",
      weather: "Weather Forecast",
      loadingWeather: "Loading weather...",
      humidity: "Humidity",
      signOut: "Sign Out",

      safetyMonitor: "Safety Monitor",
      safetyMonitorDesc: "Real-time safety",
      hotelBooking: "Hotel Booking",
      hotelBookingDesc: "Safe stays",
      transport: "Transport",
      transportDesc: "Flights & routes",
      documents: "Documents",
      documentsDesc: "Secure vault",
      aiAssistant: "AI Assistant",
      aiAssistantDesc: "Travel help",
      currency: "Currency",
      currencyDesc: "Live conversion",
      tripPlanner: "Trip Planner",
      tripPlannerDesc: "AI itineraries",
      assistance: "Assistance",
      assistanceDesc: "Find nearby help & AI tips",

      languageChanged: "Language Changed",
      languageSwitched: "Language switched to"
    }
  },

  hi: {
    translation: {
      welcome: "वापसी पर स्वागत है",
      currentLocation: "वर्तमान स्थान",
      locationDetails: "आपके वर्तमान स्थान का विवरण",
      fetchingAddress: "पता प्राप्त किया जा रहा है...",
      coordinates: "निर्देशांक",
      weather: "मौसम पूर्वानुमान",
      loadingWeather: "मौसम लोड हो रहा है...",
      humidity: "नमी",
      signOut: "साइन आउट",

      safetyMonitor: "सुरक्षा मॉनिटर",
      safetyMonitorDesc: "रीयल-टाइम सुरक्षा",
      hotelBooking: "होटल बुकिंग",
      hotelBookingDesc: "सुरक्षित ठहराव",
      transport: "परिवहन",
      transportDesc: "उड़ानें और मार्ग",
      documents: "दस्तावेज़",
      documentsDesc: "सुरक्षित वॉल्ट",
      aiAssistant: "AI सहायक",
      aiAssistantDesc: "यात्रा सहायता",
      currency: "मुद्रा",
      currencyDesc: "लाइव रूपांतरण",
      tripPlanner: "यात्रा योजनाकार",
      tripPlannerDesc: "AI यात्रा कार्यक्रम",
      assistance: "सहायता",
      assistanceDesc: "पास की सहायता और AI सुझाव",

      languageChanged: "भाषा बदली गई",
      languageSwitched: "भाषा बदलकर"
    }
  },

  kn: {
    translation: {
      welcome: "ಮತ್ತೆ ಸ್ವಾಗತ",
      currentLocation: "ಪ್ರಸ್ತುತ ಸ್ಥಳ",
      locationDetails: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಳದ ವಿವರಗಳು",
      fetchingAddress: "ವಿಳಾಸವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
      coordinates: "ನಿರ್ದೇಶಾಂಕಗಳು",
      weather: "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
      loadingWeather: "ಹವಾಮಾನ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      humidity: "ತೇವಾಂಶ",
      signOut: "ಸೈನ್ ಔಟ್",

      safetyMonitor: "ಸುರಕ್ಷತಾ ಮಾನಿಟರ್",
      safetyMonitorDesc: "ನೈಜ-ಸಮಯದ ಸುರಕ್ಷತೆ",
      hotelBooking: "ಹೋಟೆಲ್ ಬುಕಿಂಗ್",
      hotelBookingDesc: "ಸುರಕ್ಷಿತ ವಸತಿ",
      transport: "ಸಾರಿಗೆ",
      transportDesc: "ವಿಮಾನಗಳು ಮತ್ತು ಮಾರ್ಗಗಳು",
      documents: "ದಾಖಲೆಗಳು",
      documentsDesc: "ಸುರಕ್ಷಿತ ವಾಲ್ಟ್",
      aiAssistant: "AI ಸಹಾಯಕ",
      aiAssistantDesc: "ಪ್ರಯಾಣ ಸಹಾಯ",
      currency: "ಕರೆನ್ಸಿ",
      currencyDesc: "ಲೈವ್ ಪರಿವರ್ತನೆ",
      tripPlanner: "ಪ್ರಯಾಣ ಯೋಜಕ",
      tripPlannerDesc: "AI ಪ್ರಯಾಣ ಯೋಜನೆಗಳು",
      assistance: "ಸಹಾಯ",
      assistanceDesc: "ಹತ್ತಿರದ ಸಹಾಯ ಮತ್ತು AI ಸಲಹೆಗಳು",

      languageChanged: "ಭಾಷೆ ಬದಲಾಯಿಸಲಾಗಿದೆ",
      languageSwitched: "ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಲಾಗಿದೆ"
    }
  },

  te: {
    translation: {
      welcome: "తిరిగి స్వాగతం",
      currentLocation: "ప్రస్తుత స్థానం",
      locationDetails: "మీ ప్రస్తుత స్థానం వివరాలు",
      fetchingAddress: "చిరునామా పొందుతోంది...",
      coordinates: "కోఆర్డినేట్లు",
      weather: "వాతావరణ సూచన",
      loadingWeather: "వాతావరణం లోడ్ అవుతోంది...",
      humidity: "తేమ",
      signOut: "సైన్ అవుట్",

      safetyMonitor: "భద్రతా మానిటర్",
      safetyMonitorDesc: "రియల్-టైమ్ భద్రత",
      hotelBooking: "హోటల్ బుకింగ్",
      hotelBookingDesc: "సురక్షిత వసతి",
      transport: "రవాణా",
      transportDesc: "విమానాలు & మార్గాలు",
      documents: "పత్రాలు",
      documentsDesc: "సురక్షిత వాల్ట్",
      aiAssistant: "AI సహాయకుడు",
      aiAssistantDesc: "ప్రయాణ సహాయం",
      currency: "కరెన్సీ",
      currencyDesc: "లైవ్ మార్పిడి",
      tripPlanner: "ట్రిప్ ప్లానర్",
      tripPlannerDesc: "AI ప్రయాణ ప్రణాళికలు",
      assistance: "సహాయం",
      assistanceDesc: "సమీప సహాయం & AI సూచనలు",

      languageChanged: "భాష మార్చబడింది",
      languageSwitched: "భాష మార్చబడింది"
    }
  },

  mr: {
    translation: {
      welcome: "पुन्हा स्वागत आहे",
      currentLocation: "सध्याचे स्थान",
      locationDetails: "तुमच्या सध्याच्या स्थानाचा तपशील",
      fetchingAddress: "पत्ता मिळवत आहे...",
      coordinates: "निर्देशांक",
      weather: "हवामान अंदाज",
      loadingWeather: "हवामान लोड होत आहे...",
      humidity: "आर्द्रता",
      signOut: "साइन आउट",

      safetyMonitor: "सुरक्षा मॉनिटर",
      safetyMonitorDesc: "रिअल-टाइम सुरक्षा",
      hotelBooking: "हॉटेल बुकिंग",
      hotelBookingDesc: "सुरक्षित निवास",
      transport: "वाहतूक",
      transportDesc: "उड्डाणे आणि मार्ग",
      documents: "कागदपत्रे",
      documentsDesc: "सुरक्षित वॉल्ट",
      aiAssistant: "AI सहाय्यक",
      aiAssistantDesc: "प्रवास सहाय्य",
      currency: "चलन",
      currencyDesc: "थेट रूपांतरण",
      tripPlanner: "ट्रिप प्लॅनर",
      tripPlannerDesc: "AI प्रवास योजना",
      assistance: "सहाय्य",
      assistanceDesc: "जवळची मदत आणि AI सूचना",

      languageChanged: "भाषा बदलली",
      languageSwitched: "भाषा बदलली आहे"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("lang") || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;