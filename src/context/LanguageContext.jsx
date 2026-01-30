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
    legal: 'Legal Protection',
    legalDesc: 'Free legal advice in employment law',
    strike: 'Strike Assistance',
    strikeDesc: 'Financial support during strikes',
    accident: 'Accident Insurance',
    accidentDesc: 'Worldwide leisure time coverage',
    emergency: 'Emergency Aid',
    emergencyDesc: 'Support in extraordinary emergencies',
    disciplinary: 'Disciplinary Protection',
    disciplinaryDesc: 'Protection against discrimination',
    survivor: 'Survivor Assistance',
    survivorDesc: 'Support for bereaved families',

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
    legal: 'Rechtsschutz',
    legalDesc: 'Kostenlose Rechtsberatung im Arbeitsrecht',
    strike: 'Streikunterstützung',
    strikeDesc: 'Finanzielle Unterstützung bei Streiks',
    accident: 'Unfallversicherung',
    accidentDesc: 'Weltweiter Freizeitschutz',
    emergency: 'Notfallhilfe',
    emergencyDesc: 'Unterstützung in außergewöhnlichen Notlagen',
    disciplinary: 'Disziplinarschutz',
    disciplinaryDesc: 'Schutz vor Diskriminierung',
    survivor: 'Hinterbliebenenunterstützung',
    survivorDesc: 'Unterstützung für trauernde Familien',

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
  const [language, setLanguage] = useState('de') // Default to German

  const t = (key) => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
