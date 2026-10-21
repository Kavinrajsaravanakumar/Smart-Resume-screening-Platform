# 📄 Smart Resume Screening Platform

An AI-powered, modern recruitment and resume screening web platform designed to streamline hiring workflows, evaluate candidate resumes against job descriptions, and deliver actionable recruiting insights in seconds.

---

## ✨ Features

- **🎯 Intelligent Resume Screening & Scoring**: Automated parsing and score calculation based on job descriptions, required competencies, and experience.
- **🎨 Sleek, Modern User Interface**: Built with Tailwind CSS, Framer Motion, and Material UI featuring dark/light mode, smooth animations, and glassmorphism styling.
- **🌐 Public Landing Page**: High-converting, interactive landing page introducing platform capabilities, features, and workflow breakdown.
- **🔐 Authentication System**: Clean split-layout Login and Registration with role-based state management and instant demo access.
- **📊 Real-time Dashboard**: Live recruiter metrics showing total candidates screened, average match score, shortlist rates, and recent activity.
- **👥 Candidate Management**: Filterable, searchable applicant lists with quick status updates, skill tags, and match percentages.
- **📁 Drag-and-Drop Resume Uploader**: Fast resume upload interface supporting PDF and DOCX files with real-time parsing simulation.
- **📈 Recruiting Analytics**: Interactive charts powered by Recharts displaying candidate score distribution, department hiring trends, and skill gap analysis.
- **⚙️ Custom Settings**: Configurable screening score thresholds, automated notification settings, and UI preferences.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Emotion](https://emotion.sh/)
- **UI Components & Icons**: [Material UI (MUI)](https://mui.com/) & [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization**: [Recharts](https://recharts.org/)

---

## 📁 Project Structure

```text
resume-screening-platform/
├── client/
│   ├── public/             # Static assets, logos, and favicon
│   ├── src/
│   │   ├── components/     # Reusable UI, layout, candidate, upload & chart components
│   │   │   ├── candidate/  # Candidate profile and assessment cards
│   │   │   ├── charts/     # Recharts analytics visualizations
│   │   │   ├── layout/     # Sidebar, Header, Navbar, and AppLayout
│   │   │   ├── tables/     # Data tables with sorting and filtering
│   │   │   ├── ui/         # Button, Modal, Card, and Badge primitives
│   │   │   └── upload/     # Dropzone file uploader components
│   │   ├── context/        # React Context providers (AuthContext, ThemeContext)
│   │   ├── data/           # Mock data and sample candidates
│   │   ├── hooks/          # Custom utility hooks
│   │   ├── pages/          # Application views & route handlers
│   │   │   ├── Home.jsx             # Public landing page
│   │   │   ├── Login.jsx            # Sign in page
│   │   │   ├── Register.jsx         # Sign up page
│   │   │   ├── Dashboard.jsx        # Recruiter command center
│   │   │   ├── Candidates.jsx       # Candidate roster & filtering
│   │   │   ├── CandidateDetails.jsx # Detailed candidate overview
│   │   │   ├── UploadResume.jsx     # Resume intake & parser
│   │   │   ├── Analytics.jsx        # Talent pipeline analytics
│   │   │   ├── ResumePreview.jsx    # Embedded resume viewer
│   │   │   ├── Settings.jsx         # User & screening configurations
│   │   │   └── About.jsx            # About platform & documentation
│   │   ├── utils/          # Helper utilities and formatters
│   │   ├── App.jsx         # Application routing structure
│   │   ├── main.jsx        # App entry point
│   │   └── index.css       # Tailwind base, utilities & glassmorphism theme
│   ├── package.json        # Dependencies and build scripts
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── vite.config.js      # Vite build configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version `18.x` or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kavinrajsaravanakumar/Smart-Resume-screening-Platform.git
   cd Smart-Resume-screening-Platform/client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173)

---

## 📜 Available Scripts

Inside the `client` directory, you can run:

- `npm run dev` - Runs the application in development mode with Hot Module Replacement (HMR).
- `npm run build` - Builds the project for production into the `dist/` directory.
- `npm run preview` - Locally previews the production build.
- `npm run lint` - Runs ESLint to check for code quality and syntax issues.

---

## 🔒 Security & Privacy

- Client-side data sanitization and local session handling.
- Designed for secure file intake and isolated processing workflows.
- Granular recruiter permissions and privacy controls.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
