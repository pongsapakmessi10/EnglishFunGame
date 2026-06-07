// Data Models
let vocabBank = JSON.parse(localStorage.getItem('retroVocabBank')) || [];
let newVocabList = [];
let practiceQueue = [];
let currentPracticeWord = null;
let currentPracticeStep = 0; // 0: Ask English, 1: Ask Thai
let isTestMode = false;
let testScore = 0;
let wrongWords = [];
let forceTypingMode = false;
let totalQuestions = 0;
let currentQuestionIndex = 0;

// DOM Elements
const views = {
    menu: document.getElementById('menu-view'),
    add: document.getElementById('add-view'),
    practice: document.getElementById('practice-view'),
    result: document.getElementById('result-view'),
    dict: document.getElementById('dict-view')
};

// --- View Navigation ---
function switchView(viewName) {
    Object.values(views).forEach(v => v.classList.remove('active'));
    views[viewName].classList.add('active');
}

function updateBankStats() {
    document.getElementById('bank-stats').innerText = `Words in Bank: ${vocabBank.length}`;
}
updateBankStats();

// --- Menu View Listeners ---
document.getElementById('btn-add-vocab').addEventListener('click', () => {
    newVocabList = [];
    updateAddPreview();
    document.getElementById('input-eng').value = '';
    document.getElementById('input-thai').value = '';
    document.getElementById('add-status').innerText = '';
    switchView('add');
});

document.getElementById('btn-bank-test').addEventListener('click', () => {
    if(vocabBank.length === 0) {
        alert("Vocab bank is empty! Please add some words first.");
        return;
    }
    startTestMode();
});

// --- Add Vocab View Listeners ---
document.getElementById('btn-save-word').addEventListener('click', addWord);
document.getElementById('input-thai').addEventListener('keypress', (e) => {
    if(e.key === 'Enter') addWord();
});

function addWord() {
    const engInput = document.getElementById('input-eng');
    const thaiInput = document.getElementById('input-thai');
    const eng = engInput.value.trim();
    const thai = thaiInput.value.trim();
    
    if(!eng || !thai) {
        showAddStatus("Please fill in both fields.", "red");
        return;
    }
    
    newVocabList.push({ eng, thai });
    engInput.value = '';
    thaiInput.value = '';
    engInput.focus();
    
    showAddStatus(`Added: ${eng} = ${thai}`, "green");
    updateAddPreview();
}

function showAddStatus(msg, color) {
    const statusEl = document.getElementById('add-status');
    statusEl.innerText = msg;
    statusEl.style.color = color;
}

function updateAddPreview() {
    const preview = document.getElementById('added-list-preview');
    preview.innerText = `Words added this session: ${newVocabList.length}`;
    const goBtn = document.getElementById('btn-go-practice');
    goBtn.style.display = newVocabList.length > 0 ? 'block' : 'none';
}

document.getElementById('btn-go-practice').addEventListener('click', () => {
    startPracticeMode(newVocabList, false);
});
document.getElementById('btn-back-menu-from-add').addEventListener('click', () => {
    if(newVocabList.length > 0) {
        if(confirm("You have unsaved words. Go back anyway? They will be lost.")) {
            switchView('menu');
        }
    } else {
        switchView('menu');
    }
});

// --- Practice & Test Logic ---
function startPracticeMode(wordList, isTest) {
    if(wordList.length === 0) return;
    
    isTestMode = isTest;
    testScore = 0;
    wrongWords = [];
    
    let listToUse = [...wordList];
    if(isTest) {
        listToUse.sort(() => 0.5 - Math.random());
        listToUse = listToUse.slice(0, 10);
    }
    
    // Each word has 2 steps: English to Thai, and Thai to English
    practiceQueue = [];
    listToUse.forEach(word => {
        // Randomize order of Thai/Eng prompt for variety
        if(Math.random() > 0.5) {
            practiceQueue.push({ ...word, step: 0 }); // Ask English
            practiceQueue.push({ ...word, step: 1 }); // Ask Thai
        } else {
            practiceQueue.push({ ...word, step: 1 }); // Ask Thai
            practiceQueue.push({ ...word, step: 0 }); // Ask English
        }
    });
    
    totalQuestions = practiceQueue.length;
    currentQuestionIndex = 0;
    
    document.getElementById('practice-title').innerText = isTest ? "Bank Test Mode" : "Practice Mode";
    nextPracticeQuestion();
    switchView('practice');
}

function startTestMode() {
    startPracticeMode(vocabBank, true);
}

function nextPracticeQuestion() {
    const inputEl = document.getElementById('input-answer');
    const feedbackEl = document.getElementById('practice-feedback');
    const hintEl = document.getElementById('answer-hint');
    
    inputEl.value = '';
    feedbackEl.innerText = '';
    feedbackEl.className = 'feedback';
    hintEl.innerText = '';
    forceTypingMode = false;
    
    if(practiceQueue.length === 0) {
        showResults();
        return;
    }
    
    currentQuestionIndex++;
    document.getElementById('practice-progress').innerText = `Question: ${currentQuestionIndex} / ${totalQuestions}`;
    
    currentPracticeWord = practiceQueue.shift();
    currentPracticeStep = currentPracticeWord.step;
    
    let promptText = "";
    if(currentPracticeStep === 0) {
        promptText = `Type English for:\n"${currentPracticeWord.thai}"`;
    } else {
        promptText = `Type Thai for:\n"${currentPracticeWord.eng}"`;
    }
    
    document.getElementById('question-prompt').innerText = promptText;
    inputEl.focus();
}

function checkAnswer() {
    const inputEl = document.getElementById('input-answer');
    const input = inputEl.value.trim();
    if(!input) return;
    
    let isCorrect = false;
    let correctAnswer = "";
    
    if(currentPracticeStep === 0) {
        correctAnswer = currentPracticeWord.eng;
        // Case-insensitive for English
        isCorrect = (input.toLowerCase() === correctAnswer.toLowerCase());
    } else {
        correctAnswer = currentPracticeWord.thai;
        // Exact match for Thai
        isCorrect = (input === correctAnswer);
    }
    
    const feedback = document.getElementById('practice-feedback');
    const hint = document.getElementById('answer-hint');
    
    // Force Typing Mode Check
    if(forceTypingMode) {
        let isForcedCorrect = false;
        if(currentPracticeStep === 0) {
            isForcedCorrect = (input.toLowerCase() === correctAnswer.toLowerCase());
        } else {
            isForcedCorrect = (input === correctAnswer);
        }

        if(isForcedCorrect) {
            feedback.innerText = "Good! Keep going.";
            feedback.className = "feedback correct";
            setTimeout(() => {
                nextPracticeQuestion();
            }, 600);
        } else {
            feedback.innerText = "Please type it exactly as shown above.";
            feedback.className = "feedback wrong";
            inputEl.value = '';
        }
        return;
    }
    
    // Normal Answer Check
    if(isCorrect) {
        feedback.innerText = "Correct!";
        feedback.className = "feedback correct";
        if(isTestMode) testScore++;
        
        setTimeout(() => {
            nextPracticeQuestion();
        }, 500);
    } else {
        feedback.innerText = "Incorrect!";
        feedback.className = "feedback wrong";
        hint.innerText = `Correct Answer: ${correctAnswer}`;
        inputEl.value = '';
        
        // Track wrong words
        if(!wrongWords.some(w => w.eng === currentPracticeWord.eng)) {
            wrongWords.push({ eng: currentPracticeWord.eng, thai: currentPracticeWord.thai });
        }
        
        forceTypingMode = true;
    }
}

document.getElementById('btn-submit-answer').addEventListener('click', checkAnswer);
document.getElementById('input-answer').addEventListener('keypress', (e) => {
    if(e.key === 'Enter') checkAnswer();
});

// --- Results Logic ---
function showResults() {
    switchView('result');
    const scoreDiv = document.getElementById('result-score');
    const btnSave = document.getElementById('btn-save-to-bank');
    const btnRetest = document.getElementById('btn-retest-wrong');
    const btnBack = document.getElementById('btn-back-menu-from-result');
    
    btnSave.style.display = 'none';
    btnRetest.style.display = 'none';
    
    if(isTestMode) {
        scoreDiv.innerHTML = `<h3>Test Complete!</h3><p>Your Score: ${testScore} / ${totalQuestions}</p>`;
        if(wrongWords.length > 0) {
            scoreDiv.innerHTML += `<p style="color:var(--danger-color); font-weight:bold;">You missed ${wrongWords.length} words.</p>`;
            btnRetest.style.display = 'block';
            btnRetest.innerText = `Practice ${wrongWords.length} Wrong Words`;
        } else {
            scoreDiv.innerHTML += `<p style="color:var(--success-color); font-weight:bold;">Perfect Score!</p>`;
        }
        btnBack.style.display = 'block';
    } else {
        scoreDiv.innerHTML = `<h3>Practice Complete!</h3><p>You have practiced all the words in this set.</p>`;
        
        if(wrongWords.length > 0) {
            scoreDiv.innerHTML += `<p style="color:var(--danger-color); font-weight:bold;">You made mistakes on ${wrongWords.length} words.</p>`;
            btnRetest.style.display = 'block';
            btnRetest.innerText = `Retry ${wrongWords.length} Mistakes First`;
        } else {
             // Can only save to bank if they got everything right eventually
             // (which they will because of force retype, but if they retry, it clears the queue)
            btnSave.style.display = 'block';
            btnBack.style.display = 'none';
        }
    }
}

document.getElementById('btn-save-to-bank').addEventListener('click', async () => {
    const statusEl = document.getElementById('saving-status');
    const btnSave = document.getElementById('btn-save-to-bank');
    
    statusEl.innerText = "Fetching definitions from API... Please wait.";
    btnSave.disabled = true;
    btnSave.innerText = "Saving...";
    
    for (let wordObj of newVocabList) {
        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(wordObj.eng)}`);
            if (res.ok) {
                const data = await res.json();
                const entry = data[0];
                const meaning = entry.meanings[0];
                const def = meaning?.definitions[0];
                
                wordObj.enDefinition = def?.definition || "";
                wordObj.example = def?.example || "";
                
                let syns = [];
                entry.meanings.forEach(m => {
                    if (m.synonyms) syns = syns.concat(m.synonyms);
                });
                wordObj.synonyms = [...new Set(syns)].slice(0, 5).join(', ');
            }
        } catch(e) {
            console.error("API fetch failed for " + wordObj.eng, e);
        }
        
        if(!wordObj.enDefinition) wordObj.enDefinition = "";
        if(!wordObj.synonyms) wordObj.synonyms = "";
        if(!wordObj.example) wordObj.example = "";
        wordObj.id = Date.now() + Math.random().toString().slice(2, 6);
    }
    
    vocabBank = vocabBank.concat(newVocabList);
    localStorage.setItem('retroVocabBank', JSON.stringify(vocabBank));
    newVocabList = [];
    updateBankStats();
    
    statusEl.innerText = "";
    btnSave.disabled = false;
    btnSave.innerText = "Save to Bank & Menu";
    switchView('menu');
});

document.getElementById('btn-retest-wrong').addEventListener('click', () => {
    // Practice wrong words. Set isTest = false so it behaves like practice mode 
    // and eventually leads to saving to bank if it was originally a practice session.
    startPracticeMode(wrongWords, false);
    // Note: If they came from Test Mode, after finishing the wrong words, 
    // it will show the Save to Bank button (which is harmless but maybe weird).
    // Let's refine this: if original mode was Test, we shouldn't save to bank.
    // Actually, saving to bank just appends newVocabList. 
    // In Test Mode, newVocabList is empty, so clicking Save to Bank does nothing bad.
});

document.getElementById('btn-back-menu-from-result').addEventListener('click', () => {
    switchView('menu');
});

// --- Dictionary & Edit Logic ---
document.getElementById('btn-my-dict').addEventListener('click', () => {
    renderDictionary();
    switchView('dict');
});

document.getElementById('btn-back-menu-from-dict').addEventListener('click', () => {
    switchView('menu');
});

function renderDictionary() {
    const listEl = document.getElementById('dict-list');
    listEl.innerHTML = '';
    
    if(vocabBank.length === 0) {
        listEl.innerHTML = '<p style="text-align:center;">Your dictionary is empty. Add some words first!</p>';
        return;
    }
    
    const displayList = [...vocabBank].reverse();
    
    displayList.forEach(word => {
        if(!word.id) word.id = Date.now() + Math.random().toString().slice(2, 6);
        
        const card = document.createElement('div');
        card.className = 'dict-card';
        
        let synHtml = '';
        if(word.synonyms) {
            const synArr = word.synonyms.split(',').map(s => s.trim()).filter(s => s);
            if(synArr.length > 0) {
                synHtml = `<div class="dict-syn"><strong>Synonyms:</strong> ` + 
                          synArr.map(s => `<span>${s}</span>`).join('') + `</div>`;
            }
        }
        
        let exHtml = '';
        if(word.example) {
            exHtml = `<div class="dict-ex">" ${word.example} "</div>`;
        }
        
        card.innerHTML = `
            <div class="dict-word">${word.eng}</div>
            <div class="dict-thai">${word.thai}</div>
            ${word.enDefinition ? `<div class="dict-def"><strong>Def:</strong> ${word.enDefinition}</div>` : ''}
            ${synHtml}
            ${exHtml}
            <div class="dict-actions">
                <button class="btn btn-small warning" onclick="openEditModal('${word.id}')">Edit</button>
                <button class="btn btn-small danger" onclick="deleteWord('${word.id}')">Delete</button>
            </div>
        `;
        listEl.appendChild(card);
    });
}

window.deleteWord = function(id) {
    if(confirm("Are you sure you want to delete this word?")) {
        vocabBank = vocabBank.filter(w => w.id !== id);
        localStorage.setItem('retroVocabBank', JSON.stringify(vocabBank));
        updateBankStats();
        renderDictionary();
    }
}

let currentEditId = null;
const editModal = document.getElementById('edit-modal');

window.openEditModal = function(id) {
    const word = vocabBank.find(w => w.id === id);
    if(!word) return;
    
    currentEditId = id;
    document.getElementById('edit-eng').value = word.eng;
    document.getElementById('edit-thai').value = word.thai || "";
    document.getElementById('edit-def').value = word.enDefinition || "";
    document.getElementById('edit-syn').value = word.synonyms || "";
    document.getElementById('edit-ex').value = word.example || "";
    
    editModal.classList.add('active');
}

document.getElementById('btn-cancel-edit').addEventListener('click', () => {
    editModal.classList.remove('active');
    currentEditId = null;
});

document.getElementById('btn-save-edit').addEventListener('click', () => {
    if(!currentEditId) return;
    
    const wordIndex = vocabBank.findIndex(w => w.id === currentEditId);
    if(wordIndex > -1) {
        vocabBank[wordIndex].thai = document.getElementById('edit-thai').value.trim();
        vocabBank[wordIndex].enDefinition = document.getElementById('edit-def').value.trim();
        vocabBank[wordIndex].synonyms = document.getElementById('edit-syn').value.trim();
        vocabBank[wordIndex].example = document.getElementById('edit-ex').value.trim();
        
        localStorage.setItem('retroVocabBank', JSON.stringify(vocabBank));
        renderDictionary();
    }
    
    editModal.classList.remove('active');
    currentEditId = null;
});
