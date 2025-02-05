document.addEventListener('DOMContentLoaded', () => {
    // Initial fade from white to black
    document.body.style.backgroundColor = 'white';
    setTimeout(() => {
        document.body.style.transition = 'background-color 2s';
        document.body.style.backgroundColor = 'black';
    }, 500);

    // Typing animation elements
    const textElement = document.getElementById('matrix-text');
    const cursor = document.querySelector('.typing-cursor');
    const phrases = ['Hello world', 'welcome to my portfolio'];
    let currentPhrase = 0;
    let currentChar = 0;
    let isGlitching = false;

    // Function to update cursor position
    function updateCursorPosition() {
        const textWidth = textElement.offsetWidth;
        cursor.style.left = `${textWidth}px`;
    }

    // Function to reset animation
    function resetAnimation() {
        currentPhrase = 0;
        currentChar = 0;
        textElement.textContent = '';
        textElement.dataset.text = '';
        cursor.style.left = '0px';
    }

    // Main typing function
    function typeText() {
        if (currentChar < phrases[currentPhrase].length) {
            textElement.textContent += phrases[currentPhrase][currentChar];
            textElement.dataset.text = textElement.textContent;
            currentChar++;
            updateCursorPosition();
            setTimeout(typeText, 100);
        } else {
            triggerGlitch();
        }
    }

    // Backspace function
    function backspaceText() {
        if (currentChar > 0) {
            textElement.textContent = textElement.textContent.slice(0, -1);
            textElement.dataset.text = textElement.textContent;
            currentChar--;
            updateCursorPosition();
            setTimeout(backspaceText, 50);
        } else {
            currentPhrase = (currentPhrase + 1) % phrases.length;
            typeText();
        }
    }

    // Glitch effect handler
    function triggerGlitch() {
        if (!isGlitching) {
            isGlitching = true;
            textElement.classList.add('glitch');
            
            setTimeout(() => {
                textElement.classList.remove('glitch');
                isGlitching = false;
                
                if (currentPhrase === 0) {
                    backspaceText();
                } else {
                    setTimeout(() => {
                        resetAnimation();
                        setTimeout(typeText, 3000); // 3-second delay before restart
                    }, 1000);
                }
            }, 1000); // Glitch duration
        }
    }

    // Start initial animation
    setTimeout(() => {
        cursor.style.transform = 'translateY(0)';
        typeText();
    }, 3000);

    // Show the portal box (with white blinking border) after 5 seconds
    setTimeout(() => {
        const portalBox = document.querySelector('.portal-box');
        portalBox.classList.remove('hidden');
        portalBox.classList.add('show-portal');
        // Force a fixed width and center it, so it remains static and its content stays centered
        portalBox.style.width = '300px'; // Adjust as needed
        portalBox.style.position = 'absolute';
        portalBox.style.left = '50%';
        portalBox.style.transform = 'translateX(-50%)';
        portalBox.style.textAlign = 'center';
    }, 5000);

    // When the "Enter the Portfolio" button is pressed, start the transition effect
    const enterBtn = document.getElementById('enter-btn');
    enterBtn.addEventListener('click', () => {
        // Assuming the global "matrix" object from matrix-effect.js is accessible
        if (typeof matrix !== 'undefined' && matrix.startPortfolioTransition) {
            matrix.startPortfolioTransition();
        }
    });
});
