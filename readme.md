# Cookie Exporter

A Chrome extension that allows you to easily export cookies from the current domain in JSON format.

![image](https://github.com/user-attachments/assets/f78a45ac-e82f-44e0-97e4-5f89ebce93d9)



## Features

- Export cookies from the active tab's domain
- Copy cookie data to clipboard
- Download cookies as a JSON file
- Clean and intuitive user interface
- Secure handling of cookie data

## Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the Cookie Exporter icon in your Chrome toolbar
2. Click "Export Cookies" to view cookies for the current domain
3. Use the "Copy" button to copy the JSON data to clipboard
4. Use the "Download" button to save the cookies as a JSON file

## Permissions

The extension requires the following permissions:
- `cookies`: To access cookie data
- `activeTab`: To get the current tab's URL
- `scripting`: For extension functionality
- `<all_urls>`: To access cookies across domains

## Development

The extension is built using:
- Manifest V3
- Vanilla JavaScript
- CSS for styling
- Chrome Extensions API

### Project Structure

```
cookie-exporter/
├── assets/
│   └── icons/
├── src/
│   └── popup/
│       ├── popup.html
│       ├── popup.css
│       └── popup.js
├── background.js
└── manifest.json
```

## Security

- All cookie operations are performed locally
- Data is never sent to external servers
- Uses content security policy for enhanced security

## License

MIT License
