figma.showUI(__html__, { width: 350, height: 600 });

figma.notify(`Hey there! 👋`, {
  timeout: 2000,
  error: false,
});

// Function to send the current frame names to the UI
function updateUI() {
  const currentSelection = figma.currentPage.selection;
  const frameNames = currentSelection
      .filter(node => node.type === 'FRAME')
      .map(frame => frame.name);

  figma.ui.postMessage({ type: 'update-frames', frameNames });
}

// Call updateUI to set the initial state
updateUI();

// Update the UI on selection change
figma.on('selectionchange', updateUI);

// Function to send all links to the UI
async function sendAllLinksToUI() {
  const allLinks = await figma.clientStorage.getAsync('allLinks') || [];
  figma.ui.postMessage({ type: 'display-all-links', allLinks });
}

// Handle messages from the UI
figma.ui.onmessage = async msg => {
  if (msg.type === 'create-link-set') {
      const setName = msg.setName || 'Untitled';
      const selectedFrames = figma.currentPage.selection.filter(node => node.type === 'FRAME');

      if (selectedFrames.length > 0) {
          const linkSet = selectedFrames.map(frame => {
              const pageID = frame.parent ? frame.parent.id : 'No parent';
              return {
                  name: frame.name,
                  frameID: frame.id,
                  pageID: pageID,
                  xPos: frame.x,
                  yPos: frame.y
              };
          });

          const completeLinkSet = [setName, ...linkSet];
          let allLinks = await figma.clientStorage.getAsync('allLinks') || [];
          allLinks.push(completeLinkSet);
          await figma.clientStorage.setAsync('allLinks', allLinks);

          // Update UI with all links
          sendAllLinksToUI();
          console.log('Sending allLinks to UI:', allLinks);


          figma.notify(`Set "${setName}" created with ${selectedFrames.length} frames.`);
      } else {
          figma.notify("Select frames to create a list");
      }
  }
};

// Initial call to display existing links or default message
sendAllLinksToUI();
