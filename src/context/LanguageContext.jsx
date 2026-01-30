import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

const translations = {
  en: {
    // Landing page
    title: 'METALL',
    titleAccent: 'RUSH',
    subtitle: 'Run • Collect • Protect',
    tapToPlay: 'Tap to Play',
    officeWorker: 'Office Worker',
    factoryWorker: 'Factory Worker',
    infoTitle: 'Run, collect benefits, avoid obstacles!',
    infoSubtitle: 'Discover what IG Metall membership offers you',

    // HUD
    score: 'Score',
    distance: 'Distance',
    benefits: 'Benefits',
    speed: 'Speed',

    // Game Over
    gameOver: 'Game Over',
    finalScore: 'Final Score',
    distanceTraveled: 'Distance Traveled',
    benefitsCollected: 'Benefits Collected',
    playAgain: 'Play Again',
    mainMenu: 'Main Menu',

    // Benefits
    benefitCollected: 'Collected!',
    legalProtection: 'Legal Protection',
    legalProtectionDesc: 'Free legal advice in employment law',
    strikeAssistance: 'Strike Assistance',
    strikeAssistanceDesc: 'Financial support during strikes',
    accidentInsurance: 'Accident Insurance',
    accidentInsuranceDesc: 'Worldwide leisure time coverage',
    emergencyAid: 'Emergency Aid',
    emergencyAidDesc: 'Support in extraordinary emergencies',
    disciplinaryProtection: 'Disciplinary Protection',
    disciplinaryProtectionDesc: 'Protection against discrimination',
    survivorAssistance: 'Survivor Assistance',
    survivorAssistanceDesc: 'Support for bereaved families',

    // Messages
    newHighScore: 'New High Score!',
    keepRunning: 'Keep Running!',
    watchOut: 'Watch Out!',
  },
  de: {
    // Landing page
    title: 'METALL',
    titleAccent: 'RUSH',
    subtitle: 'Laufen • Sammeln • Schützen',
    tapToPlay: 'Tippen zum Spielen',
    officeWorker: 'Büroangestellter',
    factoryWorker: 'Fabrikarbeiter',
    infoTitle: 'Lauf, sammle Vorteile, weiche Hindernissen aus!',
    infoSubtitle: 'Entdecke, was dir die IG Metall Mitgliedschaft bietet',

    // HUD
    score: 'Punkte',
    distance: 'Strecke',
    benefits: 'Vorteile',
    speed: 'Tempo',

    // Game Over
    gameOver: 'Spiel Vorbei',
    finalScore: 'Endpunktzahl',
    distanceTraveled: 'Zurückgelegte Strecke',
    benefitsCollected: 'Gesammelte Vorteile',
    playAgain: 'Nochmal Spielen',
    mainMenu: 'Hauptmenü',

    // Benefits
    benefitCollected: 'Gesammelt!',
    legalProtection: 'Rechtsschutz',
    legalProtectionDesc: 'Kostenlose Rechtsberatung im Arbeitsrecht',
    strikeAssistance: 'Streikunterstützung',
    strikeAssistanceDesc: 'Finanzielle Unterstützung bei Streiks',
    accidentInsurance: 'Unfallversicherung',
    accidentInsuranceDesc: 'Weltweiter Freizeitschutz',
    emergencyAid: 'Notfallhilfe',
    emergencyAidDesc: 'Unterstützung in außergewöhnlichen Notlagen',
    disciplinaryProtection: 'Disziplinarschutz',
    disciplinaryProtectionDesc: 'Schutz vor Diskriminierung',
    survivorAssistance: 'Hinterbliebenenunterstützung',
    survivorAssistanceDesc: 'Unterstützung für trauernde Familien',

    // Messages
    newHighScore: 'Neuer Highscore!',
    keepRunning: 'Weiterlaufen!',
    watchOut: 'Vorsicht!',
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const t = (key) => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}


