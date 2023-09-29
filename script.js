// Elements
const passwordPlaceholder = document.querySelector('.password_display');
const simplePasswordRadio = document.querySelector('.simple_password');
const difficultPasswordRadio = document.querySelector('.difficult_password');
const veryDifficultPasswordRadio = document.querySelector('.very_difficult_password');
const radios = document.querySelectorAll('.password_options_container input[type="radio"');

// Buttons
const generatePasswordBtn = document.querySelector('.generate');
const resetBtn = document.querySelector('.reset');
const copyBtn = document.querySelector('.copy_btn');

// Password Class
class Password {
    // symbols object containing different symbol types
    static symbols = {
        lowerCaseAlphabets: [...'abcdefghijklmnopqrstuvwxyz'],
        upperCaseAlphabets: [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
        digits: [...'0123456789'],
        symbols: [...'~!@#$%)-^&*.(']
    }

    // patterns object containing different password patterns
    static patterns = {
        simplePattern: [...Password.symbols.lowerCaseAlphabets],
        difficultPattern: [...[...Password.symbols.lowerCaseAlphabets, ...Password.symbols.upperCaseAlphabets, ...Password.symbols.digits]],
        veryDifficultPattern: [...[...Password.symbols.symbols, ...Password.symbols.lowerCaseAlphabets, ...Password.symbols.digits, ...Password.symbols.upperCaseAlphabets]]
    }

    // alerBoxes object containing different alert boxes for different cases
    static alertBoxes = {
        danger: (alertMessage) => `
            <div class="alert alert-danger d-flex align-items-center" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" class="alert_icon bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <div>
                    ${alertMessage}
                </div>
            </div>        
        `,
        success: (alertMessage) => `
            <div class="alert alert-success d-flex align-items-center" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" class="alert_icon bi bi-check-circle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                <div>
                    ${alertMessage}
                </div>
            </div>        
        `
    }

    // Method for finding password character limit
    static findCharactersLength = () => {
        //* We are considering the character limit to be between 6 to 15.

        let charactersLimit = Math.floor(Math.random() * 15);

        // If the charactersLimit is less than 6 than we make it equal to 6 as discussed above about the limit. 
        charactersLimit = charactersLimit < 6 ? 6 : charactersLimit;

        return charactersLimit;
    }

    // Method to generate password based on patternName
    static generate = (patternName) => {
        let password = "";
        const charactersLimit = Password.findCharactersLength(); 
        
        for(let i = 0; i < charactersLimit; i++) {
           const randomIndex = Math.floor(Math.random() * (`${patternName.length}` - 1));
           password += `${patternName[randomIndex]}`; 
        }

        return password;
    }

    // Method to start the process of generating password
    static startGenerating = (e) => {
        // Stops unneccesary page reload 
        e.preventDefault();

        // Checking if none of the radio is clicked then displaying the alert
        if(!simplePasswordRadio.checked && !difficultPasswordRadio.checked && !veryDifficultPasswordRadio.checked) {
            // Danger Alert
            Password.alertMessage(Password.alertBoxes.danger('No Option Selected !'));
            return;
        }
        
        let password = '';

        if(simplePasswordRadio.checked) {
            password = Password.generate(Password.patterns.simplePattern);
        }
        else if(difficultPasswordRadio.checked) {
            password = Password.generate(Password.patterns.difficultPattern);
        }
        else if(veryDifficultPasswordRadio.checked) {
            password = Password.generate(Password.patterns.veryDifficultPattern);

            // We use '[' ']' in match to avoid Invalid Regular Expression Error
            password = Password.symbols.symbols.toString().match('[' + password[0] + ']') ? Password.patterns.difficultPattern[Math.floor(Math.random() * Password.patterns.difficultPattern.length) - 1] + password.slice(1) : password;
        }
    
        passwordPlaceholder.value = password;
    }

    // Method to generate custom alerts based on the type of alertBox
    static alertMessage = (alertBox) => {
        const alertElement = document.createElement('div');
        alertElement.classList.add('alert_container');

        alertElement.innerHTML = `
            ${alertBox}
        `;

        document.body.prepend(alertElement);

        setTimeout(() => {
            alertElement.remove();            
        }, 2000);
    }

    // Function to clear the current state of app and go back to the default state i.e no radio clicked & passwordPlaceholder empty.
    static clearState = (e) => {
        passwordPlaceholder.value = "";

        clearRadiosCheckedState();
    }
}

// Unchecking the simple password radio at first which is checked by default
simplePasswordRadio.checked = false;

// Function to make all radios unchecked
const clearRadiosCheckedState = () => {
    radios.forEach(radio => radio.checked = false);
};

// Function to copy the password.
const copyPassword = (e) => {
    if(passwordPlaceholder.value === '') {
        Password.alertMessage(Password.alertBoxes.danger('No Password to Copy !'));
        return;
    };

    // Writing the password in the clipboard
    navigator.clipboard.writeText(passwordPlaceholder.value);

    // Success Alert
    Password.alertMessage(Password.alertBoxes.success('Password Copied !'));
};

// Adding Event Listeners
generatePasswordBtn.addEventListener('click', Password.startGenerating);
resetBtn.addEventListener('click', Password.clearState);
copyBtn.addEventListener('click', copyPassword);