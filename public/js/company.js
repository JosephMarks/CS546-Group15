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

let companyForm = document.getElementById('company-form');
let updateCompany = document.getElementById('ucompany-form');
let errorMsg = document.getElementById('errorDisplay');

if (companyForm) {

    companyForm.addEventListener('submit', (e) => {

        let companyName = document.getElementById('companyName').value;
        let companyEmail = document.getElementById('companyEmail').value;
        let industry = document.getElementById('industry').value;
        let employee = document.getElementById('employee').value;
        let location = document.getElementById('location').value;
        let imgSrc = document.getElementById('uploadImage').value;
        let description = document.getElementById('description').value;
        let perks = document.getElementById('perks').value;
        let goals = document.getElementById('goals').value;

        if (typeof(location) === 'string') location = [location];

        if (companyName.trim() || companyEmail.trim() || industry.trim() || employee.trim() || imgSrc.trim() || description.trim() || perks.trim() || goals.trim()){
            try {

                if (!mainValidations.isProperString([companyName, industry, description, imgSrc, perks, goals])){
                    throw "Error : All inputs must be a valid strings";
                }

                helpersValidation.validateMyEmail(companyEmail.trim());
                mainValidations.checkLocationTags(location);
                mainValidations.isNumberOfEmployee(employee);
                mainValidations.checkAreaText(description, "description");
                mainValidations.checkAreaText(perks, "perks");
                mainValidations.checkAreaText(goals, "goals");
                mainValidations.checkTechJobTitle(industry, "industry");

                errorMsg.innerHTML = "";
            } catch (error) {
                errorMsg.innerHTML = error;
                // companyForm.reset();
                e.preventDefault();
            }
        } else {
            errorMsg.innerHTML = 'All parameters are required';
            // companyForm.reset();
            e.preventDefault();
        }
    })
}

if (updateCompany) {

    updateCompany.addEventListener('submit', (e) => {

        let companyName = document.getElementById('companyName').value;
        let companyEmail = document.getElementById('companyEmail').value;
        let industry = document.getElementById('industry').value;
        let employee = document.getElementById('numberOfEmployees').value;
        let location = document.getElementById('location').value;
        let imgSrc = document.getElementById('uploadImage').value;
        let description = document.getElementById('description').value;
        let perks = document.getElementById('perks').value;
        let goals = document.getElementById('goals').value;


        if (typeof(location) === 'string') location = [location];

        if (companyName.trim() || companyEmail.trim() || industry.trim() || employee.trim() || imgSrc.trim() || description.trim()){
            try {

                if (!mainValidations.isProperString([companyName, industry, description, imgSrc])){
                    throw "Error : All inputs must be a valid strings";
                }

                helpersValidation.validateMyEmail(companyEmail.trim());
                mainValidations.checkLocationTags(location);
                mainValidations.isNumberOfEmployee(employee);
                mainValidations.checkAreaText(description, "description");
                mainValidations.checkAreaText(perks, "perks");
                mainValidations.checkAreaText(goals, "goals");
                mainValidations.checkTechJobTitle(industry, "industry");


                errorMsg.innerHTML = "";
            } catch (error) {
                errorMsg.innerHTML = error;
                // updateCompany.reset();
                e.preventDefault();
            }
        } else {
            errorMsg.innerHTML = 'All parameters are required';
            // updateCompany.reset();
            e.preventDefault();
        }
    })
}