# learn-tamil

A small, offline web app to practice recognising the Tamil script.

Features
- Flashcards mode: browse letters, reveal transliteration.
- Quiz mode: multiple-choice questions with scoring.
- Subset selection: all, vowels, or consonants.

How to use
1. Open `index.html` in your browser (double-click the file or serve the folder).
2. Choose a Mode (Flashcards or Quiz) and a subset, then click Start.

Tips
- Keyboard (flashcards):
	- `n` = next
	- `p` = previous
	- `r` = reveal transliteration
- The app is intentionally minimal — it's a static HTML/CSS/JS file set so you can run it locally without setup.

Files
- `index.html` — main UI
- `styles.css` — styling
- `script.js` — letters dataset and app logic

Want to extend it?
- Add more letters or sample words to `script.js`.
- Add audio for pronunciation.
- Add persistence (localStorage) to save progress.
