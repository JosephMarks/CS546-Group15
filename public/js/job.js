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

let createJob = document.getElementById('create-job');
let updateJob = document.getElementById('update-job');
let errorMsg = document.getElementById('errorDisplay');

if (createJob) {

    createJob.addEventListener('submit', (e) => {

        let companyName = document.getElementById('companyName').value;
        let companyEmail = document.getElementById('companyEmail').value;
        let jobTitle = document.getElementById('jobTitle').value;
        let salary = document.getElementById('salary').value;
        let level = document.getElementById('level').value;
        let jobType = document.getElementById('jobType').value;
        let skills = document.getElementById('skills').value;
        let location = document.getElementById('location').value;
        let description = document.getElementById('description').value;

        if (typeof(location) === 'string') location = [location];
        if (typeof(skills) === 'string') skills = [skills];
        if (typeof(jobType) === 'string') jobType = [jobType];

        if (companyName.trim() || companyEmail.trim() || jobTitle.trim() || salary.trim() || level.trim() || description.trim()){
            try {

                if (!mainValidations.isProperString([companyName, jobTitle, description, salary])){
                    throw "Error : All inputs must be a valid strings";
                }

                helpersValidation.validateMyEmail(companyEmail.trim());

                mainValidations.checkLocationTags(location);
                mainValidations.checkJobtypeTags(jobType);
                mainValidations.checkSkillsTags(skills);
                mainValidations.checkAreaText(description, "description");
                mainValidations.checkTechJobTitle(jobTitle, "jobTitle");

                mainValidations.isSalary(salary);

                errorMsg.innerHTML = "";
            } catch (error) {
                errorMsg.innerHTML = error;
                // createJob.reset();
                e.preventDefault();
            }
        } else {
            errorMsg.innerHTML = 'All parameters are required';
            c// reateJob.reset();
            e.preventDefault();
        }
    })
}

if (updateJob) {

    updateJob.addEventListener('submit', (e) => {

        let companyName = document.getElementById('companyName').value;
        let companyEmail = document.getElementById('companyEmail').value;
        let jobTitle = document.getElementById('jobTitle').value;
        let salary = document.getElementById('salary').value;
        let level = document.getElementById('level').value;
        let jobType = document.getElementById('jobType').value;
        let skills = document.getElementById('skills').value;
        let location = document.getElementById('location').value;
        let description = document.getElementById('description').value;

        if (typeof(location) === 'string') location = [location];
        if (typeof(skills) === 'string') skills = [skills];
        if (typeof(jobType) === 'string') jobType = [jobType];

        if (companyName.trim() || companyEmail.trim() || jobTitle.trim() || salary.trim() || level.trim() || description.trim()){
            try {

                if (!mainValidations.isProperString([companyName, jobTitle, description, salary])){
                    throw "Error : All inputs must be a valid strings";
                }

                helpersValidation.validateMyEmail(companyEmail.trim());

                mainValidations.checkLocationTags(location);
                mainValidations.checkJobtypeTags(jobType);
                mainValidations.checkSkillsTags(skills);
                mainValidations.checkAreaText(description, "description");
                mainValidations.checkTechJobTitle(jobTitle, "jobTitle");
                mainValidations.isSalary(salary);

                errorMsg.innerHTML = "";
            } catch (error) {
                errorMsg.innerHTML = error;
                // updateJob.reset();
                e.preventDefault();
            }
        } else {
            errorMsg.innerHTML = 'All parameters are required';
            // updateJob.reset();
            e.preventDefault();
        }
    })
}