figma.showUI(__html__, { width: 350, height: 600 });

// Your plugin logic goes here. This is a basic structure.
figma.ui.onmessage = msg => {
    if (msg.type === 'your-message-type') {
        // Handle the message
    }
};
