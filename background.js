// Service worker for background operations
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
})

// Add any background listeners here