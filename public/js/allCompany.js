import mainValidations from "../js/staticHelpers.js";

let company = document.getElementById('search-company-form');
let errorMsg = document.getElementById('errorDisplay');

if (company) {

    company.addEventListener('submit', (e) => {

        let companyName = document.getElementById('companyName').value;

        if (companyName.trim()){
            try {

                if (!companyName) throw "Error : Company Name cannot be empty";
                if (!mainValidations.isProperString([ companyName])) throw "Error: Company Name should be proper string";

                errorMsg.innerHTML = "";

            } catch (error) {

                errorMsg.innerHTML = error;
                company.reset();
                e.preventDefault();

            }
        } else {
            errorMsg.innerHTML = 'Company Name is required';
            company.reset();
            e.preventDefault();
        }
    })
}
