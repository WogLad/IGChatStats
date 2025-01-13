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
        popup.classList.add('closing'); // Add the closing animation class
        setTimeout(() => {
            document.body.removeChild(overlay);
            document.body.removeChild(popup);
        }, 500); // Wait for the closing animation to finish (500ms)
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
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            processChatData(jsonData);
        } catch (error) {
            showAlert('Invalid JSON file. Please ensure the file is properly formatted.');
            document.getElementById('jsonFileInput').value = ''; // Clear the file input
        }
    };

    reader.onerror = function() {
        showAlert('Error reading file. Please try again or check the file format.');
        document.getElementById('jsonFileInput').value = ''; // Clear the file input
    };

    reader.readAsText(file);
});

// Function to process chat data and log the name of the person being chatted with
function processChatData(jsonData) {
    if (jsonData.participants != null) {
        showSuccessMessage(jsonData);

        // Remove the header and file input elements
        document.querySelector('h1').remove();
        document.querySelector('input[type="file"]').remove();
    } else {
        // console.log('Chatting with: Unknown (name not provided)');
        // showAlert('Chatting with: Unknown (name not provided)');
        throw new Error();
    }
}

// Function to show the success message in the centered div
function showSuccessMessage(jsonData) {
    // Get the success message div and set its content
    const successMessageDiv = document.getElementById('successMessage');
    successMessageDiv.textContent = `Chatting with ${jsonData.participants[1].name} & ${jsonData.participants[0].name}`;

    // Display the success message div
    successMessageDiv.style.display = 'block';
}
