# IG Metall Runner 🏃⚙️

A modern, mobile-friendly browser game that educates players about IG Metall membership benefits through an engaging endless runner experience.

## 🎮 Game Overview

**IG Metall Runner** is an endless runner game where players choose between being an **Office Worker** or a **Factory Worker**. As they run through their respective environments, they must:
- **Collect IG Metall benefits** (glowing collectibles)
- **Avoid workplace obstacles** by swiping, jumping, or ducking
- **Learn about worker rights** through interactive gameplay

## 🎯 Features

### Character Selection
- **Office Worker**: Navigate through modern office environment
- **Factory Worker**: Run through industrial facility

### Gameplay Mechanics
- **Swipe Left/Right**: Change lanes (3 lanes total)
- **Swipe Up**: Jump over obstacles
- **Swipe Down**: Duck under obstacles
- **Keyboard Support**: Arrow keys for testing on desktop

### IG Metall Benefits (Collectibles)
1. ⚖️ **Legal Protection** - Free legal advice (50 points)
2. ✊ **Strike Assistance** - Financial support (75 points)
3. 🏥 **Accident Insurance** - Worldwide coverage (60 points)
4. 🆘 **Emergency Aid** - Financial assistance (65 points)
5. 🛡️ **Disciplinary Protection** - Full support (55 points)
6. 🕊️ **Death Benefit** - Survivor support (70 points)

### Progressive Difficulty
- Speed increases every 5 seconds
- Items spawn more frequently as you progress
- Distance tracked in meters

### Lives System
- Start with 3 lives (❤️)
- Lose 1 life per obstacle hit (if not dodging)
- Game over when lives reach 0

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── CharacterSelect.jsx    # Character selection screen
│   ├── Player.jsx              # Player character with animations
│   ├── Environment.jsx         # Animated background (office/factory)
│   ├── Collectible.jsx         # Benefits and obstacles
│   ├── GameHUD.jsx             # Score, lives, distance display
│   └── GameOver.jsx            # Results and benefit summary
├── config/
│   └── gameData.js             # Benefits and obstacles data
├── App.jsx                     # Main game logic
├── App.css                     # Complete game styling
└── main.jsx                    # Entry point
```

## 🎨 Technology Stack

- **React 19** - UI framework
- **Framer Motion** - Smooth animations
- **Vite** - Fast build tool
- **CSS3** - Modern styling with gradients and glassmorphism

## 📱 Mobile Optimization

- Touch gestures (swipe detection)
- Portrait orientation focus
- Responsive design
- 60 FPS performance target
- One-hand gameplay

## 🎓 Educational Aspect

After each game, players see:
- **Final Statistics**: Score, distance, benefits collected
- **Benefit Details**: Information about collected IG Metall benefits
- **Educational Message**: Tips about worker rights and conditions
- **Call-to-Action**: Link to learn more about IG Metall

## 🔧 Configuration

Key game settings in `App.jsx`:

```javascript
const GAME_CONFIG = {
  LANES: 3,
  STARTING_LIVES: 3,
  BASE_SPEED: 2,
  MAX_SPEED: 6,
  SPEED_INCREASE_INTERVAL: 5000,
  SPAWN_INTERVAL: 1500,
}
```

## 🎮 Controls

### Touch (Mobile)
- **Swipe Left/Right**: Move between lanes
- **Swipe Up**: Jump
- **Swipe Down**: Duck

### Keyboard (Desktop Testing)
- **Arrow Left/Right**: Move between lanes
- **Arrow Up / Space**: Jump
- **Arrow Down**: Duck

## 🏆 Scoring System

- **Collect Benefit**: 50-75 points (varies by benefit type)
- **Distance**: Continuously increases
- **Benefits Counter**: Tracks unique benefits collected

## 🎨 Visual Themes

### Office Environment
- Light blue gradient background
- Office elements: 🪟 💻
- Modern, clean aesthetic

### Factory Environment
- Orange/amber gradient background
- Industrial elements: ⚙️ 🏭
- Warm, industrial aesthetic

## 🐛 Known Issues & Future Improvements

### Potential Enhancements
- Sound effects (with mute toggle)
- Haptic feedback on mobile
- More character types
- Power-ups
- Leaderboard system
- Progressive web app (PWA) support

## 📄 License

This project is created for educational purposes to promote awareness of IG Metall membership benefits.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

Made with ❤️ for worker education and rights awareness.

