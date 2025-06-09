// 游戏状态
let gameState = {
    score: 0,
    timeLeft: 30,
    gameTimer: null,
    isGameActive: false
};

// Boss quotes
const bossQuotes = [
    "You're fired!",
    "No overtime pay!",
    "Work weekends!",
    "Rewrite the report!",
    "Budget cuts!",
    "Meeting extended!",
    "Double the tasks!",
    "No time off!",
    "Salary freeze!",
    "Poor performance!"
];

// Ranking system
const rankSystem = [
    { min: 0, max: 49, title: "Lazy Intern", emoji: "😐", description: "Need more effort" },
    { min: 50, max: 99, title: "Cubicle Warrior", emoji: "🙂", description: "Feeling better" },
    { min: 100, max: 149, title: "Office Terminator", emoji: "😎", description: "Solid smash" },
    { min: 150, max: 199, title: "Stress Buster Pro", emoji: "😤", description: "Excellent relief" },
    { min: 200, max: Infinity, title: "Boss Destroyer", emoji: "🤯", description: "Maximum smash" }
];

// Initialize after page loads
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// Initialize page
function initializePage() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            // Home page needs no special initialization
            break;
        case 'game':
            initializeGame();
            break;
        case 'result':
            displayResults();
            break;
    }
}

// Get current page
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('game.html')) return 'game';
    if (path.includes('result.html')) return 'result';
    return 'index';
}

// Start game
function startGame() {
    window.location.href = 'game.html';
}

// Initialize game
function initializeGame() {
    gameState.score = 0;
    gameState.timeLeft = 30;
    gameState.isGameActive = true;
    
    updateDisplay();
    startTimer();
    
    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && gameState.isGameActive) {
            e.preventDefault();
            hitBoss();
        }
    });
}

// Start timer
function startTimer() {
    gameState.gameTimer = setInterval(function() {
        gameState.timeLeft--;
        updateDisplay();
        
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Hit boss
function hitBoss() {
    if (!gameState.isGameActive) return;
    
    gameState.score++;
    updateDisplay();
    
    // Add animation effect
    const boss = document.getElementById('boss');
    boss.classList.add('shake');
    setTimeout(() => boss.classList.remove('shake'), 300);
    
    // Show random quote
    showBossQuote();
    
    // Change boss expression
    changeBossExpression();
}

// Show boss quote
function showBossQuote() {
    const speechBubble = document.getElementById('speechBubble');
    const randomQuote = bossQuotes[Math.floor(Math.random() * bossQuotes.length)];
    
    speechBubble.textContent = randomQuote;
    speechBubble.classList.add('show');
    
    setTimeout(() => {
        speechBubble.classList.remove('show');
    }, 1500);
}

// Change boss expression
function changeBossExpression() {
    const bossFace = document.querySelector('.boss-face');
    const expressions = ['😠', '😡', '🤬', '😤', '😵', '🥴', '😰'];
    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
    
    bossFace.textContent = randomExpression;
    
    // Restore original expression after 2 seconds
    setTimeout(() => {
        bossFace.textContent = '😠';
    }, 2000);
}

// Update display
function updateDisplay() {
    const countdownElement = document.getElementById('countdown');
    const scoreElement = document.getElementById('score');
    
    if (countdownElement) countdownElement.textContent = gameState.timeLeft;
    if (scoreElement) scoreElement.textContent = gameState.score;
}

// End game
function endGame() {
    gameState.isGameActive = false;
    clearInterval(gameState.gameTimer);
    
    // Save score to local storage
    localStorage.setItem('gameScore', gameState.score);
    localStorage.setItem('gameTime', new Date().toISOString());
    
    // Redirect to results page
    setTimeout(() => {
        window.location.href = 'result.html';
    }, 1000);
}

// Display results
function displayResults() {
    const score = parseInt(localStorage.getItem('gameScore')) || 0;
    const stressScore = (score / 30).toFixed(1); // Clicks per second
    
    // Update score display
    document.getElementById('finalScore').textContent = score;
    document.getElementById('stressScore').textContent = stressScore;
    
    // Calculate rank
    const rank = calculateRank(score);
    document.getElementById('rankTitle').textContent = rank.title;
    document.getElementById('rankEmoji').textContent = rank.emoji;
    document.getElementById('rankDescription').textContent = rank.description;
    
    // Add animation effects
    animateResults();
}

// Calculate rank
function calculateRank(score) {
    for (let rank of rankSystem) {
        if (score >= rank.min && score <= rank.max) {
            return rank;
        }
    }
    return rankSystem[0]; // Default to first rank
}

// Results page animation
function animateResults() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('bounce');
        }, index * 200);
    });
}

// Play again
function playAgain() {
    window.location.href = 'game.html';
}

// Share score
function shareScore() {
    const score = parseInt(localStorage.getItem('gameScore')) || 0;
    const rank = calculateRank(score);
    const shareText = `I scored ${score} points in "Beat Boss" game and achieved the rank "${rank.title}"! ${rank.emoji} Can you beat my score?`;
    
    if (navigator.share) {
        // Use native share API (mobile devices)
        navigator.share({
            title: 'Beat Boss - My Score',
            text: shareText,
            url: window.location.origin
        });
    } else {
        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Score copied to clipboard!');
            });
        } else {
            // Fallback method
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Score copied to clipboard!');
        }
    }
}

// Go home
function goHome() {
    window.location.href = 'index.html';
}

// Add touch support (mobile devices)
document.addEventListener('touchstart', function(e) {
    if (e.target.id === 'boss' && gameState.isGameActive) {
        e.preventDefault();
        hitBoss();
    }
});

// Prevent double-tap zoom (mobile devices)
document.addEventListener('touchend', function(e) {
    if (e.target.id === 'boss') {
        e.preventDefault();
    }
});

// Page Visibility API - pause game when page is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden && gameState.isGameActive) {
        // Pause when page is hidden
        if (gameState.gameTimer) {
            clearInterval(gameState.gameTimer);
        }
    } else if (!document.hidden && gameState.isGameActive && gameState.timeLeft > 0) {
        // Resume when page is visible
        startTimer();
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Game error:', e.error);
});

// Performance monitoring (optional)
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
} 