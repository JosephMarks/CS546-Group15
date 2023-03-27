const validations = {

    isProperString (param) { // check if the parameters are string or not takes an array as an input

        for (let element of param) {
            if (typeof(element) !== 'string') return 0
            if (element.trim().length === 0) return 0
        }
        return 1
    },

    isNumber (param) { // check for the parameter is number or not the parameters are number

        for (let element of param){
            if (typeof(element) !== 'number' || isNaN(element)) return 0 
        }
        return 1

    },

    isAge (param) { // check if or not our use age is within the defined range
        if (!this.isNumber([param])) throw "Error: Age  must be a number"
        if (param < 18 || param > 100) throw "Error: Age must be with in 18 to 100"
        if (!Number.isInteger(param)) throw "Error: Age must be an Integer"
    },

    display (){
        console.log('hi')
    }
}

export default validations




