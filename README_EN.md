[中文版 (Chinese Version)](./README.md)

# OS Time Shuttle 🚀

An interactive 3D visualization app for exploring the evolution and influence of operating systems through time and space.

## 🌟 Core Features

### 1. Interactive 3D Spacetime Axis

- **3D Timeline Visualization**: Display the development history of operating systems in a 3D timeline.
- **Interactive Nodes**: Each OS is an interactive node in space, showing its name, year, and category.
- **Free Navigation**: Rotate the view with mouse drag, zoom with the scroll wheel, and select nodes by clicking.
- **Detailed Info Cards**: Click any node to pop up detailed info, including:
  - Release year and developer
  - Key people and technical features
  - Historical significance and background

### 2. OS Influence Lineage Map

- **Dynamic Relationship Visualization**: Highlight influence relationships when an OS is selected.
- **Multi-level Connections**: Show direct influence, evolution, and inspiration sources.
- **Lineage Tracing**: One-click to view an OS "family tree."
- **Influence Strength**: Line thickness and opacity indicate influence strength.

## 🎮 User Guide

### Basic Interactions
- **🖱️ Mouse Drag**: Rotate the view, observe freely in 360°
- **🔍 Scroll Wheel**: Zoom in/out, focus on details
- **🎯 Click Node**: View OS details
- **⌨️ Keyboard Shortcuts**:
  - `ESC`: Close info panel
  - `Ctrl+R`: Reset view

### Control Panel Features
- **Time Range Filter**: Adjust the displayed year range with a slider
- **System Type Filter**: Filter by category (Mainframe, PC, Server, Mobile, Embedded)
- **View Controls**: Reset view

## 🎨 Visualization Highlights

### Node Design
- **Color Coding**: Each OS uses a unique theme color
- **Glow Effect**: Highlight and glow animation when selected
- **Floating Animation**: Slight up-and-down floating for dynamic feel
- **Text Labels**: Clearly display system name and year

### Connection System
- **Type Distinction**:
  - 🟢 Green - Direct Influence
  - 🟠 Orange - Evolution
  - 🔵 Blue - Inspiration
- **Strength Visualization**: Line opacity indicates influence strength
- **Dynamic Highlight**: Real-time update on interaction

## 📚 Included Operating Systems

The current version includes the following major OSes:

| OS         | Year | Category   | Key Features                        |
|------------|------|------------|-------------------------------------|
| Multics    | 1965 | Mainframe  | Pioneer, time-sharing system        |
| UNIX       | 1969 | Server     | "Everything is a file", pipes      |
| MS-DOS     | 1981 | PC         | Start of PC era, command line       |
| macOS      | 1984 | PC         | Revolutionary GUI, design icon      |
| Windows    | 1985 | PC         | Popularized GUI, global mainstream  |
| Linux      | 1991 | Server     | Open source, cloud computing base   |
| Windows NT | 1993 | Server     | Enterprise architecture, modern Win |
| iOS        | 2007 | Mobile     | Redefined smartphone experience     |
| Android    | 2008 | Mobile     | Open source, world's largest        |
| BSD        | 1977 | Server     | Academic UNIX, internet stack       |

## 🛠️ Tech Stack

- **Frontend**: Vite + TypeScript
- **3D Rendering**: Three.js
- **Package Manager**: pnpm
- **Styles**: CSS3 (modern browser support)

## 🚀 Getting Started

### Requirements
- Node.js 16+
- pnpm 8+
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)

### Install & Run
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Project Structure
```
src/
├── core/           # Core 3D engine
│   └── OSTimeShuttle.ts
├── data/           # OS data
│   └── osData.ts
├── types/          # TypeScript types
│   └── index.ts
├── ui/             # UI components
│   ├── OSInfoPanel.ts
│   └── ControlPanel.ts
├── utils/          # Utility functions
├── effects/        # Effects & animations
├── main.ts         # App entry
└── style.css       # Global styles
```

## 🎯 Design Philosophy

### Spacetime Concept
Use 3D space to represent the time dimension, enabling users to:
- **Time Travel**: Freely traverse the timeline
- **Spatial Awareness**: Intuitively understand system relationships
- **Discover Connections**: Visually uncover hidden influences

### Interaction Philosophy
- **Intuitive Operation**: Natural interactions matching human spatial cognition
- **Progressive Exploration**: Layered info from overview to detail
- **Active Discovery**: Encourage users to explore and learn

## 🔮 Roadmap

### Planned Features
- [ ] **Timeline Animation**: Play the OS development timeline
- [ ] **VR/AR Support**: Support for virtual/augmented reality devices
- [ ] **Data Expansion**: Add more OSes and technical details
- [ ] **Community Contribution**: Open data and collaborative editing
- [ ] **Multi-language Support**: Internationalization
- [ ] **Export**: Export visual charts and reports

### Technical Improvements
- [ ] **Performance Optimization**: Handle large data efficiently
- [ ] **Mobile Adaptation**: Touch interaction optimization
- [ ] **Accessibility**: Improve accessibility support
- [ ] **Offline Support**: PWA for offline use

## 📄 License

This project is open-sourced under the MIT License. Contributions and ideas are welcome!

## 🤝 Contribution Guide

We welcome all forms of contribution:

1. **Data**: Add more OS information
2. **Feature Suggestions**: Propose new visualization ideas
3. **Code**: Fix bugs or add features
4. **Docs**: Improve documentation

## 📞 Contact

If you have any questions or suggestions, feel free to:
- Submit an Issue
- Open a Pull Request
- Email the development team

---

**Let's explore the fascinating world of operating systems through time and space!** 🌌✨
