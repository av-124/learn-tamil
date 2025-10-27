// Tamil Unicode Mapping Helper Functions
const vowelMarks = {
  'ா': 'aa', 'ி': 'i', 'ீ': 'ii', 'ு': 'u', 'ூ': 'uu',
  'ெ': 'ae', 'ே': 'aey', 'ை': 'ai', 'ொ': 'oh', 'ோ': 'ohh', 'ௌ': 'au'
};

// Base vowels (உயிர் எழுத்துக்கள்)
const vowels = [
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
  {char: 'ஔ', translit: 'au', type: 'vowel'}
];

// Base consonants (மெய் எழுத்துக்கள்)
const consonants = [
  {char: 'க்', translit: 'k', type: 'consonant', base: 'க'},
  {char: 'ங்', translit: 'ng', type: 'consonant', base: 'ங'},
  {char: 'ச்', translit: 'ch', type: 'consonant', base: 'ச'},
  {char: 'ஞ்', translit: 'nj', type: 'consonant', base: 'ஞ'},
  {char: 'ட்', translit: 'ṭ', type: 'consonant', base: 'ட'},
  {char: 'ண்', translit: 'ṇ', type: 'consonant', base: 'ண'},
  {char: 'த்', translit: 'th', type: 'consonant', base: 'த'},
  {char: 'ந்', translit: 'n', type: 'consonant', base: 'ந'},
  {char: 'ப்', translit: 'p', type: 'consonant', base: 'ப'},
  {char: 'ம்', translit: 'm', type: 'consonant', base: 'ம'},
  {char: 'ய்', translit: 'y', type: 'consonant', base: 'ய'},
  {char: 'ர்', translit: 'r', type: 'consonant', base: 'ர'},
  {char: 'ல்', translit: 'l', type: 'consonant', base: 'ல'},
  {char: 'வ்', translit: 'v', type: 'consonant', base: 'வ'},
  {char: 'ழ்', translit: 'zh', type: 'consonant', base: 'ழ'},
  {char: 'ள்', translit: 'ḷ', type: 'consonant', base: 'ள'},
  {char: 'ற்', translit: 'ṟ', type: 'consonant', base: 'ற'},
  {char: 'ன்', translit: 'ṉ', type: 'consonant', base: 'ன'}
];

// Grantha consonants (கிரந்த எழுத்துக்கள்)
const granthaConsonants = [
  {char: 'ஜ்', translit: 'j', type: 'grantha', base: 'ஜ'},
  {char: 'ஷ்', translit: 'sh', type: 'grantha', base: 'ஷ'},
  {char: 'ஸ்', translit: 's', type: 'grantha', base: 'ஸ'},
  {char: 'ஹ்', translit: 'h', type: 'grantha', base: 'ஹ'},
  {char: 'க்ஷ்', translit: 'ksh', type: 'grantha', base: 'க்ஷ'}
];

// Generate uyirmei combinations for a consonant
function generateUyirmeiForConsonant(cons) {
  const combinations = [];
  // Add the basic consonant (with pulli)
  combinations.push({
    char: cons.char,
    translit: cons.translit,
    type: cons.type === 'grantha' ? 'grantha-combo' : 'uyirmei'
  });
  
  // Generate combinations with vowel marks
  // First combination is with 'a' (removing pulli)
  combinations.push({
    char: cons.base,
    translit: cons.translit + 'a',
    type: cons.type === 'grantha' ? 'grantha-combo' : 'uyirmei'
  });
  
  // Rest of the combinations with vowel marks
  Object.entries(vowelMarks).forEach(([mark, vowelTranslit]) => {
    combinations.push({
      char: cons.base + mark,
      translit: cons.translit + vowelTranslit,
      type: cons.type === 'grantha' ? 'grantha-combo' : 'uyirmei'
    });
  });
  
  return combinations;
}

// Generate all combinations
const uyirmeiCombos = consonants.flatMap(generateUyirmeiForConsonant);
const granthaCombos = granthaConsonants.flatMap(generateUyirmeiForConsonant);

// Complete letter set
const LETTERS = [
  ...vowels,              // 12 vowels
  ...consonants,          // 18 consonants
  ...granthaConsonants,   // 5 grantha consonants
  ...uyirmeiCombos,       // 18 consonants × 12 forms = 216 combinations
  ...granthaCombos        // 5 grantha × 12 forms = 60 combinations
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
  switch(subset) {
    case 'vowels': return LETTERS.filter(l => l.type === 'vowel');
    case 'consonants': return LETTERS.filter(l => l.type === 'consonant');
    case 'uyirmei': return LETTERS.filter(l => l.type === 'uyirmei');
    case 'grantha': return LETTERS.filter(l => l.type === 'grantha');
    case 'grantha-combo': return LETTERS.filter(l => l.type === 'grantha-combo');
    default: return LETTERS.slice();
  }
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
  if(e.key === 'd') next();
  if(e.key === 'a') prev();
  if(e.key === 's') reveal();
});

// Auto-start with all+flash on load
window.addEventListener('load', ()=>{
  elMode.value = 'flash';
  elSubset.value = 'all';
  start();
});
