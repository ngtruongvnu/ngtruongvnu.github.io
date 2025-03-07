document.addEventListener('DOMContentLoaded', function() {
    const approveButton = document.getElementById('approveButton');
    const declineButton = document.getElementById('declineButton');
    const responseMessage = document.getElementById('responseMessage');
    const buttonContainer = document.querySelector('.button-container');
    const container = document.querySelector('.container');
    const header = document.querySelector('h1');
    const paragraph = document.querySelector('p');
    
    // Initial size tracking
    let yesButtonSize = 1;
    let noButtonSize = 1;
    
    // Yes button click - Show popup
    approveButton.addEventListener('click', function() {
        // Create popup elements
        const popup = document.createElement('div');
        popup.className = 'popup';
        
        const popupContent = document.createElement('div');
        popupContent.className = 'popup-content';
        
        // Add content to popup
        popupContent.innerHTML = `
            <h2>Yay! 🎉</h2>
            <p>Really good choice 😘</p>
            <button id="closePopup">Close</button>
        `;
        
        // Assemble and add popup to document
        popup.appendChild(popupContent);
        document.body.appendChild(popup);
        
        // Display popup with animation
        setTimeout(() => {
            popup.classList.add('active');
        }, 10);
        
        // Add close button functionality
        document.getElementById('closePopup').addEventListener('click', function() {
            popup.classList.remove('active');
            setTimeout(() => {
                popup.remove();
            }, 300);
        });
        
        // Hide the buttons
        approveButton.style.display = 'none';
        declineButton.style.display = 'none';
    });
    
    // No button click - decrease No size, increase Yes size, and move randomly
    declineButton.addEventListener('click', function() {
        // Decrease No button size but maintain a minimum size
        noButtonSize = Math.max(0.3, noButtonSize - 0.1);
        declineButton.style.transform = `scale(${noButtonSize})`;
        
        // Increase Yes button size WITHOUT any maximum limit
        yesButtonSize += 0.5;
        approveButton.style.transform = `scale(${yesButtonSize})`;
        
        // Increase padding around button container to prevent text overlap
        const padding = Math.min(150, 20 + (yesButtonSize - 1) * 50);
        buttonContainer.style.padding = `${padding}px 0`;
        
        // Increase the gap between buttons to prevent overlap
        buttonContainer.style.gap = (20 + (yesButtonSize - 1) * 40) + 'px';
        
        // Make the No button harder to click by reducing opacity but maintain minimum visibility
        if (noButtonSize <= 0.7) {
            declineButton.style.opacity = Math.max(0.4, noButtonSize);
        }
        
        // Move the No button to a random position
        moveNoButtonRandomly();
        
        // Scroll to button to ensure it's visible as it grows
        approveButton.scrollIntoView({behavior: 'smooth', block: 'center'});
    });
    
    // Function to move the No button randomly without overlap
    function moveNoButtonRandomly() {
        // Get the viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Get dimensions of all relevant elements
        const yesRect = approveButton.getBoundingClientRect();
        const noRect = declineButton.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();
        const paragraphRect = paragraph.getBoundingClientRect();
        const messageRect = responseMessage.getBoundingClientRect();
        
        // Calculate safe margins to keep button visible on screen
        const marginX = Math.max(40, noRect.width); // Minimum 40px width to ensure visibility
        const marginY = Math.max(40, noRect.height); // Minimum 40px height
        
        // Calculate maximum movement range
        const maxX = viewportWidth - marginX;
        const maxY = viewportHeight - marginY;
        
        // Generate random position, avoiding overlap with Yes button and text elements
        let newX, newY;
        let attempts = 0;
        const maxAttempts = 100; // Increase attempts to find valid position
        
        do {
            // Generate random position within safe viewport area
            newX = Math.max(marginX, Math.min(Math.random() * maxX, maxX - 10));
            newY = Math.max(marginY, Math.min(Math.random() * maxY, maxY - 10));
            
            // Keep trying until we find a non-overlapping position or reach max attempts
            attempts++;
        } while (
            (checkOverlap(newX, newY, noRect.width, noRect.height, yesRect) ||
             checkOverlap(newX, newY, noRect.width, noRect.height, headerRect) ||
             checkOverlap(newX, newY, noRect.width, noRect.height, paragraphRect) ||
             checkOverlap(newX, newY, noRect.width, noRect.height, messageRect)) && 
            attempts < maxAttempts
        );
        
        // Position the No button relative to document
        declineButton.style.position = 'fixed';
        declineButton.style.left = `${newX}px`;
        declineButton.style.top = `${newY}px`;
        declineButton.style.zIndex = '100'; // Ensure button stays on top
    }
    
    // Function to check if two rectangles overlap
    function checkOverlap(x, y, width, height, otherRect) {
        // Create rectangle for proposed new position
        const rect1 = {
            left: x,
            top: y,
            right: x + width,
            bottom: y + height
        };
        
        // Check if rectangles overlap
        return !(
            rect1.right < otherRect.left || 
            rect1.left > otherRect.right || 
            rect1.bottom < otherRect.top || 
            rect1.top > otherRect.bottom
        );
    }
});