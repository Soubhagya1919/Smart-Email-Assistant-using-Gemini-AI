console.log("Email Writer Extension - Content Script Loaded");

/**
 * Creates an AI Reply button for the email compose toolbar.
 * @returns {HTMLDivElement} The AI Reply button element.
 */
function createAIButton() {
    console.log('Creating AI button element');
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    console.log('AI button element created');
    return button;
}

/**
 * Retrieves the content of the email from the DOM.
 * @returns {string} The email content as a trimmed string.
 */
function getEmailContent() {
    console.log('Attempting to retrieve email content');
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            console.log('Email content found');
            return content.innerText.trim();
        }
    }
    console.log('No email content found');
    return "";
}

/**
 * Finds the email compose toolbar in the DOM.
 * @returns {HTMLElement|null} The toolbar element or null if not found.
 */
function findComposeToolbar() {
    console.log('Searching for compose toolbar');
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            console.log('Compose toolbar found');
            return toolbar;
        }
    }
    console.log('Compose toolbar not found');
    return null;
}

/**
 * Injects the AI Reply button into the email compose toolbar.
 */
function injectButton() {
    console.log('Injecting AI Reply button');
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if(!toolbar) {
        console.log("Toolbar not found");
        return;
    }
    console.log("Toolbar found, creating AI button");
    const button = createAIButton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click', async() => {
       try {
        button.innerHTML = 'Generating...';
        button.disabled = true;
        const emailContent = getEmailContent();
        const response = await fetch('http://localhost:8080/api/email/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                emailContent: emailContent,
                tone: "professional"
             })
        })

        if(!response.ok) {
            throw new Error("API Request Failed");
        }
        const generatedReply = await response.text();
        const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
        if(composeBox) {
            composeBox.focus();
            document.execCommand('insertText', false, generatedReply);
        } else {
            console.error("Compose box not found");
        }
       } catch (error) {
        console.error("Error generating reply");
        alert(error);
       }  finally {
           button.innerHTML = 'AI Reply';
           button.disabled = false;
       }
    });

    toolbar.insertBefore(button, toolbar.firstChild);
    console.log('AI Reply button injected successfully');
}

const observer = new MutationObserver((mutations) => {
    console.log('Observing DOM mutations');
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElemets = addedNodes.some(node => 
           node.nodeType === Node.ELEMENT_NODE &&
           (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC'))
        );
        if(hasComposeElemets) {
            console.log('Compose window detected, preparing to inject button');
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });