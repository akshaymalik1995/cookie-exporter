const CONFIG = {
    STATUS_TIMEOUT: 3000,
    FILE_TYPE: 'application/json',
    ERROR_PREFIX: '[Cookie Exporter]'
};

const exportBtn = document.getElementById('exportBtn');
const resultContainer = document.getElementById('resultContainer');
const cookieOutput = document.getElementById('cookieOutput');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const statusMessage = document.getElementById('status');

let cookieDataStorage = null;

async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    })
    return tab;
}

async function getDomainCookies() {
    try {
        const tab = await getCurrentTab();
        if (!tab?.url) throw new Error('No active tab found');
        const url = new URL(tab.url);
        const domain = url.hostname;

        const cookies = await chrome.cookies.getAll({ domain });
        if (!cookies.length) throw new Error('No cookies found for this domain');
        return cookies;
    } catch (error) {
        const errorMessage = error.message || 'Something went wrong!';
        showStatus(errorMessage, 'error');
        console.error("[Cookie Exporter]", error);
    }
}

function formatCookies(cookies) {
    if (!Array.isArray(cookies)) {
        throw new Error('No cookies found');
    }
    if (!cookies.length) {
        throw new Error('No cookies found');
    }
    
    const firstCookie = cookies[0];
    if (!firstCookie?.domain) {
        throw new Error('Invalid cookie format');
    }

    return JSON.stringify({
        domain: firstCookie.domain,
        cookies: cookies.map(({ name, values, domain, path, secure, httpOnly, expirationDate }) => ({
            name,
            values,
            domain,
            path,
            secure,
            httpOnly,
            expirationDate
        }))
    }, null, 2);
}

function showStatus(message, type = "info") {
    statusMessage.classList.remove("hidden");
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    setTimeout(() => {
        statusMessage.classList.add("hidden");
        statusMessage.textContent = "";
    }, 3000); 
}

async function handleExport() {
    try {
        resultContainer.classList.add("hidden");
        const cookies = await getDomainCookies();
        const formatted = formatCookies(cookies);
        cookieOutput.textContent = formatted;
        resultContainer.classList.remove("hidden");
        
        // Store the formatted data
        cookieDataStorage = formatted;
    } catch (error) {
        const errorMessage = error.message || "Failed to export cookies";
        showStatus(errorMessage, 'error');
        console.error(CONFIG.ERROR_PREFIX, error);
    }
}

async function handleCopy() {
    try {
        if (!cookieDataStorage) {
            throw new Error('No cookie data available');
        }
        await navigator.clipboard.writeText(cookieDataStorage);
        showStatus("Copied to clipboard", 'success');
    } catch (error) {
        showStatus("Failed to copy", 'error');
        console.error(CONFIG.ERROR_PREFIX, error);
    }
}

async function handleDownload() {
    if (!cookieDataStorage) {
        showStatus("No cookie data available", 'error');
        return;
    }
    try {
        const blob = new Blob([cookieDataStorage], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cookies-${new Date().toISOString()}.json`;
        
        try {
            document.body.appendChild(a);
            a.click();
        } finally {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        showStatus("Download completed", 'success');
    } catch (error) {
        showStatus("Failed to download", 'error');
        console.error("[Cookie Exporter] Download error:", error);
    }
}

// Event listeners
exportBtn.addEventListener('click', handleExport);
copyBtn.addEventListener('click', handleCopy);
downloadBtn.addEventListener('click', handleDownload);