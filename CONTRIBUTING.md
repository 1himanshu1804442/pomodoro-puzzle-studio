# 🤝 Contributing to Pomodoro Studio

Welcome! We are thrilled that you are interested in contributing to **Pomodoro Studio**. Our mission is to combine the serious focus mechanics of professional Pomodoro timers with the dynamic visual rewards of HD desktop photography and soothing lofi audio!

Whether you are a beginner React developer or an experienced full-stack engineer, we design this repository to prioritize **Organization**, **Readability**, and **Debuggability**.

---

## 🌟 How You Can Contribute

1. **Add New Photographic Themes:**
   * Found an amazing, royalty-free architectural or nature photograph on Unsplash? You can easily register new themes by adding metadata directly inside `src/services/imageService.js`!
2. **Add Studio Acoustic Audio Channels:**
   * Want to add new ambient sound loops (like library ambiance, keyboard typing, or wind chimes)? Drop the loop file into `public/assets/audio/` and register the button in `src/components/LofiPlayer.jsx`.
3. **Bug Fixes & UI Enhancement:**
   * Help improve accessibility, responsiveness across tablets and mobile viewports, or optimize rendering performance!

---

## 🏗️ Architectural & Coding Standards (The "No Confusion" Rule)

To maintain a clean, bug-free codebase, all contributors must adhere to our community development directives:

1. **Explain the 'Why':** When adding new logic or UI components, always include brief comments explaining *why* a specific approach was taken (e.g., why extracting state simplifies testing, or why cross-browser fallbacks are necessary).
2. **No Placeholders:** Never submit Pull Requests with incomplete code, TODO stubs, or untested functions. Always write complete, fully functioning features!
3. **Strict Separation of Concerns:** Keep React functional UI components clean. Extract all business formulas (XP progression, leveling math) and static asset metadata into dedicated files inside `src/services/`.
4. **The "Seamless React Bounce" Styling Rule:** Whenever editing styling, ensure `margin: 0; padding: 0; width: 100%; min-height: 100vh;` is preserved on `html, body, #root` with a solid dark HSL theme background color to eliminate white edges during browser scroll bounces.

---

## 🧪 The "No-Mistakes Pipeline" (Automated Testing)

Before opening a Pull Request, verify that all core logic continues to pass our automated unit test suite using **Vitest**:

```bash
# Execute unit tests locally
npx vitest run
```

Ensure all tests pass (`15/15 passing`). If you introduce a new feature (such as a new XP badge threshold), write a corresponding test inside `src/specs/`!

---

## 📬 Submitting Your Pull Request

1. Fork the repository and create a descriptive feature branch: `git checkout -b feat/add-library-audio-loop`.
2. Commit your polished changes with clean commit messages: `git commit -m "feat: Add Library ambiance audio loop to LofiPlayer"`.
3. Push your branch and open a Pull Request against `master`.
4. In your PR description, explain the *Why* behind your changes and include screenshots if you modified user interface layouts!

Thank you for helping make focus study sessions rewarding for developers worldwide! 🌿✨
