
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type LanguageCode = 'en' | 'hi' | 'ta' | 'ml' | 'te' | 'kn';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  changeLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations for different languages
const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    home: 'Home',
    events: 'Events',
    register: 'Register',
    book: 'Book',
    communityChat: 'Community Chat',
    about: 'About',
    contact: 'Contact',
    login: 'Log in',
    signup: 'Sign up',
    search: 'Search',
    searchEvents: 'Search events...',
    featured: 'Featured Events',
    trending: 'Trending Events',
    browseEvents: 'Browse Events',
    noEvents: 'No events found',
    tryChanging: 'Try changing your search query or filters',
    typeMessage: 'Type a message...',
    send: 'Send',
    noMessages: 'No messages yet. Start the conversation!'
  },
  hi: {
    home: 'होम',
    events: 'इवेंट्स',
    register: 'रजिस्टर',
    book: 'बुक',
    communityChat: 'सामुदायिक चैट',
    about: 'हमारे बारे में',
    contact: 'संपर्क',
    login: 'लॉग इन',
    signup: 'साइन अप',
    search: 'खोज',
    searchEvents: 'इवेंट्स खोजें...',
    featured: 'विशेष इवेंट्स',
    trending: 'प्रचलित इवेंट्स',
    browseEvents: 'इवेंट्स ब्राउज़ करें',
    noEvents: 'कोई इवेंट नहीं मिला',
    tryChanging: 'अपनी खोज या फिल्टर बदलें',
    typeMessage: 'संदेश लिखें...',
    send: 'भेजें',
    noMessages: 'अभी तक कोई संदेश नहीं। बातचीत शुरू करें!'
  },
  ta: {
    home: 'முகப்பு',
    events: 'நிகழ்வுகள்',
    register: 'பதிவு செய்க',
    book: 'புக்கிங்',
    communityChat: 'சமூக அரட்டை',
    about: 'எங்களைப் பற்றி',
    contact: 'தொடர்பு',
    login: 'உள்நுழைய',
    signup: 'பதிவு செய்க',
    search: 'தேடல்',
    searchEvents: 'நிகழ்வுகளைத் தேடுங்கள்...',
    featured: 'சிறப்பு நிகழ்வுகள்',
    trending: 'ட்ரெண்டிங் நிகழ்வுகள்',
    browseEvents: 'நிகழ்வுகளை உலாவ',
    noEvents: 'நிகழ்வுகள் எதுவும் கிடைக்கவில்லை',
    tryChanging: 'உங்கள் தேடல் அல்லது வடிகட்டிகளை மாற்றவும்',
    typeMessage: 'செய்தி உள்ளிடவும்...',
    send: 'அனுப்பு',
    noMessages: 'இதுவரை எந்த செய்திகளும் இல்லை. உரையாடலைத் தொடங்குங்கள்!'
  },
  ml: {
    home: 'ഹോം',
    events: 'ഇവന്റുകൾ',
    register: 'രജിസ്റ്റർ',
    book: 'ബുക്ക് ചെയ്യുക',
    communityChat: 'കമ്മ്യൂണിറ്റി ചാറ്റ്',
    about: 'ഞങ്ങളെ കുറിച്ച്',
    contact: 'ബന്ധപ്പെടുക',
    login: 'ലോഗിൻ',
    signup: 'സൈൻ അപ്',
    search: 'തിരയൽ',
    searchEvents: 'ഇവന്റുകൾ തിരയുക...',
    featured: 'ഫീച്ചേഡ് ഇവന്റുകൾ',
    trending: 'ട്രെൻഡിങ് ഇവന്റുകൾ',
    browseEvents: 'ഇവന്റുകൾ ബ്രൗസ് ചെയ്യുക',
    noEvents: 'ഇവന്റുകൾ ഒന്നും കണ്ടെത്തിയില്ല',
    tryChanging: 'നിങ്ങളുടെ തിരയൽ ക്വറി അല്ലെങ്കിൽ ഫിൽട്ടറുകൾ മാറ്റി നോക്കുക',
    typeMessage: 'സന്ദേശം ടൈപ്പ് ചെയ്യുക...',
    send: 'അയക്കുക',
    noMessages: 'ഇതുവരെ സന്ദേശങ്ങളൊന്നുമില്ല. സംഭാഷണം ആരംഭിക്കുക!'
  },
  te: {
    home: 'హోమ్',
    events: 'ఈవెంట్లు',
    register: 'రిజిస్టర్',
    book: 'బుక్',
    communityChat: 'కమ్యూనిటీ చాట్',
    about: 'మా గురించి',
    contact: 'సంప్రదించండి',
    login: 'లాగిన్',
    signup: 'సైన్ అప్',
    search: 'శోధన',
    searchEvents: 'ఈవెంట్లను శోధించండి...',
    featured: 'ఫీచర్డ్ ఈవెంట్లు',
    trending: 'ట్రెండింగ్ ఈవెంట్లు',
    browseEvents: 'ఈవెంట్లను బ్రౌజ్ చేయండి',
    noEvents: 'ఈవెంట్లు కనుగొనబడలేదు',
    tryChanging: 'మీ శోధన క్వెరీ లేదా ఫిల్టర్లను మార్చడానికి ప్రయత్నించండి',
    typeMessage: 'సందేశం టైప్ చేయండి...',
    send: 'పంపండి',
    noMessages: 'ఇంకా సందేశాలు లేవు. సంభాషణను ప్రారంభించండి!'
  },
  kn: {
    home: 'ಮುಖಪುಟ',
    events: 'ಕಾರ್ಯಕ್ರಮಗಳು',
    register: 'ನೋಂದಣಿ',
    book: 'ಬುಕ್',
    communityChat: 'ಸಮುದಾಯ ಚಾಟ್',
    about: 'ನಮ್ಮ ಬಗ್ಗೆ',
    contact: 'ಸಂಪರ್ಕ',
    login: 'ಲಾಗಿನ್',
    signup: 'ಸೈನ್ ಅಪ್',
    search: 'ಹುಡುಕು',
    searchEvents: 'ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಹುಡುಕಿ...',
    featured: 'ವಿಶೇಷ ಕಾರ್ಯಕ್ರಮಗಳು',
    trending: 'ಟ್ರೆಂಡಿಂಗ್ ಕಾರ್ಯಕ್ರಮಗಳು',
    browseEvents: 'ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ',
    noEvents: 'ಯಾವುದೇ ಕಾರ್ಯಕ್ರಮಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    tryChanging: 'ನಿಮ್ಮ ಹುಡುಕಾಟ ಪ್ರಶ್ನೆ ಅಥವಾ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಬದಲಾಯಿಸಲು ಪ್ರಯತ್ನಿಸಿ',
    typeMessage: 'ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...',
    send: 'ಕಳುಹಿಸು',
    noMessages: 'ಇನ್ನೂ ಯಾವುದೇ ಸಂದೇಶಗಳಿಲ್ಲ. ಸಂಭಾಷಣೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ!'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    // Try to get the saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as LanguageCode;
    return savedLanguage || 'en';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (language: LanguageCode) => {
    setCurrentLanguage(language);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
