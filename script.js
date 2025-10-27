// Basic Tamil practice app: flashcards + quiz
// Dataset: vowels and consonants with transliteration 
const LETTERS = [
  // Vowels
  {char: 'அ', translit: 'a', type: 'vowel'},
  {char: 'ஆ', translit: 'aa', type: 'vowel'},
  {char: 'இ', translit: 'i', type: 'vowel'},
  {char: 'ஈ', translit: 'ii', type: 'vowel'},
  {char: 'உ', translit: 'u', type: 'vowel'},
  {char: 'ஊ', translit: 'uu', type: 'vowel'},
  {char: 'எ', translit: 'ae', type: 'vowel'},
  {char: 'ஏ', translit: 'aey', type: 'vowel'},
  {char: 'ஐ', translit: 'ai', type: 'vowel'},
  {char: 'ஒ', translit: 'oh', type: 'vowel'},
  {char: 'ஓ', translit: 'ohh', type: 'vowel'},
  {char: 'ஔ', translit: 'au', type: 'vowel'},
  // Consonants (common set)
  {char: 'க்', translit: 'ik', type: 'consonant'},
  {char: 'ங்', translit: 'ing', type: 'consonant'},
  {char: 'ச்', translit: 'ich', type: 'consonant'},
  {char: 'ஞ்', translit: 'nj', type: 'consonant'},
  {char: 'ட்', translit: 'iṭ', type: 'consonant'},
  {char: 'ண்', translit: 'iṇ', type: 'consonant'},
  {char: 'த்', translit: 'it', type: 'consonant'},
  {char: 'ந்', translit: 'in', type: 'consonant'},
  {char: 'ப்', translit: 'ip', type: 'consonant'},
  {char: 'ம்', translit: 'im', type: 'consonant'},
  {char: 'ய்', translit: 'iy', type: 'consonant'},
  {char: 'ர்', translit: 'ir', type: 'consonant'},
  {char: 'ல்', translit: 'il', type: 'consonant'},
  {char: 'வ்', translit: 'iv', type: 'consonant'},
  {char: 'ழ்', translit: 'izh', type: 'consonant'},
  {char: 'ள்', translit: 'iḷ', type: 'consonant'},
  {char: 'ற்', translit: 'iṟ', type: 'consonant'},
  {char: 'ன்', translit: 'iṉ', type: 'consonant'}
];

// State
let pool = [];
let index = 0;
let mode = 'flash';
let score = 0, attempts = 0;

// Elements
const elMode = document.getElementById('mode');
const elSubset = document.getElementById('subset');
const elStart = document.getElementById('start');
const elFlash = document.getElementById('flashcard');
const elQuiz = document.getElementById('quiz');
const elLetter = document.getElementById('letter');
const elTranslit = document.getElementById('translit');
const elPrev = document.getElementById('prev');
const elNext = document.getElementById('next');
const elReveal = document.getElementById('reveal');
const elQuizLetter = document.getElementById('quiz-letter');
const elChoices = document.getElementById('choices');
const elFeedback = document.getElementById('quiz-feedback');
const elScore = document.getElementById('score');
const elQuizSkip = document.getElementById('quiz-skip');
const elQuizEnd = document.getElementById('quiz-end');

function buildPool(subset){
  if(subset === 'vowels') return LETTERS.filter(l=>l.type==='vowel');
  if(subset === 'consonants') return LETTERS.filter(l=>l.type==='consonant');
  return LETTERS.slice();
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
}

function start(){
  mode = elMode.value;
  pool = buildPool(elSubset.value);
  shuffle(pool);
  index = 0;
  score = attempts = 0;
  elFeedback.textContent = '';
  hideAll();
  if(mode === 'flash') startFlash();
  else startQuiz();
}

function hideAll(){
  elFlash.classList.add('hidden');
  elQuiz.classList.add('hidden');
}

// FLASHCARD
function startFlash(){
  elFlash.classList.remove('hidden');
  showFlash(index);
}

function showFlash(i){
  if(pool.length===0) return;
  const item = pool[i % pool.length];
  elLetter.textContent = item.char;
  elTranslit.textContent = item.translit;
  elTranslit.classList.add('hidden');
}

function next(){ index = (index+1) % pool.length; showFlash(index); }
function prev(){ index = (index-1+pool.length) % pool.length; showFlash(index); }
function reveal(){ elTranslit.classList.remove('hidden'); }

// QUIZ
function startQuiz(){
  elQuiz.classList.remove('hidden');
  showQuizQuestion();
  updateScore();
}

function pickChoices(correct){
  const others = pool.filter(p=>p !== correct);
  shuffle(others);
  const choices = [correct, others[0], others[1] || others[0], others[2] || others[0]];
  shuffle(choices);
  return choices.slice(0,4);
}

function showQuizQuestion(){
  if(pool.length===0) return;
  const item = pool[index % pool.length];
  elQuizLetter.textContent = item.char;
  elChoices.innerHTML = '';
  const choices = pickChoices(item);
  choices.forEach(c=>{
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = c.translit;
    btn.onclick = ()=>handleChoice(c, item, btn);
    elChoices.appendChild(btn);
  });
}

function handleChoice(choice, correct, btnEl){
  attempts++;
  if(choice.translit === correct.translit){
    score++;
    btnEl.classList.add('correct');
    elFeedback.textContent = 'Correct!';
  } else {
    btnEl.classList.add('wrong');
    elFeedback.textContent = `Wrong — correct: ${correct.translit}`;
  }
  updateScore();
  index = (index+1) % pool.length;
  setTimeout(()=>{ elFeedback.textContent=''; showQuizQuestion(); }, 800);
}

function skipQuiz(){ index = (index+1) % pool.length; showQuizQuestion(); }
function endQuiz(){ alert(`Quiz finished. Score: ${score} / ${attempts}`); }

function updateScore(){ elScore.textContent = `Score: ${score} / ${attempts}`; }

// Wire up
elStart.addEventListener('click', start);
elNext.addEventListener('click', next);
elPrev.addEventListener('click', prev);
elReveal.addEventListener('click', reveal);
elQuizSkip.addEventListener('click', ()=>{ skipQuiz(); });
elQuizEnd.addEventListener('click', endQuiz);

// Small keyboard shortcuts: n/p/r
document.addEventListener('keydown', (e)=>{
  if(document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;
  if(mode !== 'flash') return;
  if(e.key === 'n') next();
  if(e.key === 'p') prev();
  if(e.key === 'r') reveal();
});

// Auto-start with all+flash on load
window.addEventListener('load', ()=>{
  elMode.value = 'flash';
  elSubset.value = 'all';
  start();
});
