import mainValidations from "../js/staticHelpers.js";

const helpersValidation = {
    validateIsString (param) {
        for (let element of param) {
            if (typeof(element) !== 'string') return 0
            if (element.trim().length === 0) return 0
        }
        return 1
    },
    
    validateArrayWithTheString (param) {
        for (let element of param){
            if (!Array.isArray(element)) throw 'Error : genre, groupMembers must be array'
            if (element.length === 0) throw 'Error : there must be atleast one element in the genre, groupMembers'
            if (!this.validateIsString(element)) throw 'Error : Array values in genre, groupMembers must be valid and non-empty string'
        }
    },

    validateName (param) {
        if (param.trim().length < 2 || param.trim().length > 25) throw "Error : Enter a valid firstName and the lastName";
        
        for (let i = 0; i < param.length; i++) {
            if (!Boolean(param[i].match(/^[A-Za-z]*$/))) {
                throw "Error : Enter a valid firstName or the lastName";
            }
        }
    },

    validateRole (param) {
        if (param != 'admin' && param != 'user') throw 'Error : Role can only be admin or user';
    },
    
    validateMyPassword (param) {
        if (param.includes(" ")) throw "Error : Invalid Password";
        if (param.length < 8) throw "Error : Invalid Password";
        let temp1 = 0;
        let temp2 = 0;

        for (let i = 0; i < param.length; i++) {
            if (param[i].match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)) temp1 = 1;
            if (param[i].match(/^[-+]?[0-9]+$/)) temp2 = 1;
        }
        
        if (temp1 === 0 || temp2 === 0) throw "Error : Invalid Password";
        if (param.toLowerCase() === param) throw "Error : Invalid Password";
    },

        validateMyEmail (param) {
        if (!param.toLowerCase().match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)){
            throw "Error : Invalid Email";
        }
    }
    
}

let loginForm = document.getElementById('login-form');
let registerForm = document.getElementById('registration-form');
let errorMsg = document.getElementById('errorDisplay');

if (loginForm) {

    loginForm.addEventListener('submit', (e) => {

        let email = document.getElementById('email').value;
        let password = document.getElementById('pass').value;

        if (email.trim() || password.trim()){
            try {
                helpersValidation.validateMyEmail(email.trim());
                helpersValidation.validateMyPassword(password);
                errorMsg.innerHTML = "";
            } catch (error) {
                errorMsg.innerHTML = error;
                // loginForm.reset();
                e.preventDefault();
            }
        } else {
            errorMsg.innerHTML = 'All parameters are required';
            // loginForm.reset();
            e.preventDefault();
        }
    })
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {

        let emailAddressInput = document.getElementById('emailAddress').value;
        let passwordInput = document.getElementById('password').value;
        let firstNameInput = document.getElementById('firstName').value;
        let lastNameInput = document.getElementById('lastName').value;
        let confirmPasswordInput = document.getElementById('cpassword').value;
        let age = document.getElementById('age').value;
        let candidateType = document.getElementById('candidateType').value;
    

        if (emailAddressInput.trim() || passwordInput.trim() || firstNameInput.trim() || lastNameInput.trim() || confirmPasswordInput.trim() || age.trim() || candidateType.trim()){
            try {
                if (!helpersValidation.validateIsString([firstNameInput, lastNameInput, emailAddressInput, passwordInput, candidateType, confirmPasswordInput]) === 0) {
                    throw "Error : All inputs must be valid String";
                };

                firstNameInput = firstNameInput.trim();
                lastNameInput = lastNameInput.trim();
                emailAddressInput = emailAddressInput.trim().toLowerCase();
                passwordInput = passwordInput;
                candidateType = candidateType.trim()
                confirmPasswordInput = confirmPasswordInput.trim();
                age = age.trim();

                mainValidations.validateNameReturn(firstNameInput);
                mainValidations.validateNameReturn(lastNameInput);
                helpersValidation.validateMyPassword(passwordInput);
                helpersValidation.validateMyEmail(emailAddressInput);
                mainValidations.isAge(age);
                mainValidations.validateCandidateType(candidateType);
          
                if (!(passwordInput === confirmPasswordInput)) throw "Error : Both Passwords Should Match";
                errorMsg.innerHTML = "";

            } catch (error) {
                errorMsg.innerHTML = error;
                // registerForm.reset();
                e.preventDefault();
            }
        } else {
            errorMsg.innerHTML = 'Erro : You Must Enter a valid value';
            // registerForm.reset();
            e.preventDefault();
        }
    })
}