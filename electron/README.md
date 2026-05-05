# SmartSchool CBT - Desktop App

## Building the Desktop Application

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- Git

### Steps to Build

1. **Export to GitHub** from Lovable (Settings → GitHub → Export)

2. **Clone and install:**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   npm install
   ```

3. **Install Electron dependencies:**
   ```bash
   npm install --save-dev electron electron-builder
   ```

4. **Build the Windows installer (.exe):**
   ```bash
   npx electron-builder --win --config electron/package.json
   ```
   The `.exe` installer will be in the `dist-electron/` folder.

5. **Build for Linux:**
   ```bash
   npx electron-builder --linux --config electron/package.json
   ```

### App Features
- **Kiosk Mode**: Fullscreen locked exam environment
- **Security**: Blocks Alt+F4, Alt+Tab, Ctrl+W during exams
- **Exit Confirmation**: Warns before closing during active exam
- **Auto-loads**: Opens directly to the CBT exam portal

### Customization
- Change the app URL in `electron/main.cjs` (`APP_URL` variable)
- Replace `electron/icon.png` with your school logo (256x256 PNG)
- Edit `electron/package.json` for installer settings

### Distribution
After building, share the `.exe` file from `dist-electron/` with students. They install it like any Windows program and it opens directly to the exam portal in a secure, locked environment.
