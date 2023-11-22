figma.showUI(__html__, { width: 350, height: 600 });

// Function to send the current frame names to the UI
function updateUI() {
    const currentSelection = figma.currentPage.selection;
    const frameNames = currentSelection
        .filter(node => node.type === 'FRAME')
        .map(frame => frame.name);

    figma.ui.postMessage({ type: 'update-frames', frameNames });
}

figma.notify(`Hey there! 👋`, {
  timeout: 2000,
  error: false,
});

// Call updateUI to set the initial state
updateUI();

// Update the UI on selection change
figma.on('selectionchange', updateUI);

// Handle messages from the UI
figma.ui.onmessage = msg => {
    if (msg.type === 'your-message-type') {
        // Handle the message
    }
};
