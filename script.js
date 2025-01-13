// Function to create a popup alert
function showAlert(message) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    
    // Create popup container
    const popup = document.createElement('div');
    popup.className = 'popup';

    // Add message to popup
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    popup.appendChild(messageElement);

    // Add close button to popup
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.body.removeChild(popup);
    });
    popup.appendChild(closeButton);

    // Add overlay and popup to the body
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
}

// Function to handle file input and process the JSON data
document.getElementById('jsonFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (!file) {
        showAlert('No file selected. Please choose a JSON file to upload.');
        document.getElementById('jsonFileInput').value = '';  // Clear the input field if no file is selected
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            processChatData(jsonData);
        } catch (error) {
            showAlert('Invalid JSON file. Please ensure the file is properly formatted.');
            document.getElementById('jsonFileInput').value = '';  // Clear the input field if the file is invalid
        }
    };

    reader.onerror = function() {
        showAlert('Error reading file. Please try again or check the file format.');
        document.getElementById('jsonFileInput').value = '';  // Clear the input field if there is an error
    };

    reader.readAsText(file);
});

// Function to process chat data and log the name of the person being chatted with
function processChatData(jsonData) {
    // Assuming the person's name is nested under jsonData.chat.person.name
    const personName = jsonData?.chat?.person?.name;

    if (personName) {
        console.log('Chatting with:', personName);
        showAlert(`Chatting with: ${personName}`);
    } else {
        console.log('Chatting with: Unknown (name not provided)');
        showAlert('Chatting with: Unknown (name not provided)');
    }
}
