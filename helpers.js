import validator from "email-validator"; //use to validate email address
import { isValidStateInput as isValidState } from "usa-state-validator"; //use to check state is valid in the US, state must be in bref. words
import validateDate from "validate-date"; //use to check date is valid or not
import linkCheck from "link-check";
import { ObjectId } from "mongodb";

// Valid date would be DD/MM/YYYY

const validations = {

  validateIsString (param) {
    for (let element of param) {
        if (typeof(element) !== 'string') return 0
        if (element.trim().length === 0) return 0
    }
    return 1
  },

  validateName (param) {
    if (param.trim().length < 2 || param.trim().length > 25) throw "Error : Enter a valid firstName and the lastName";
    
    for (let i = 0; i < param.length; i++) {
        if (!Boolean(param[i].match(/^[A-Za-z]*$/))) {
            if ((param[i] !== ' ') && !param[i].match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)) throw "Error : Enter a valid firstName and the lastName";
        }
    }
  },

  isProperString(param) {
    // check if the parameters are string or not takes an array as an input

    for (let element of param) {
      if (typeof element !== "string") return 0;
      if (element.trim().length === 0) return 0;
    }
    return 1;
  },

  isNumber(param) {
    // check for the parameter is number or not the parameters are number

    for (let element of param) {
      if (typeof element !== "number" || isNaN(element)) return 0;
    }
    return 1;
  },

  isAge(param) {
    // check if or not our use age is within the defined range
    // if(!this.isNumber([param])) throw "Error: Age  must be a number"

    // can we rewrite it into this way
    if (isNaN(Number(param))) throw "Error: Age  must be a number";
    param = Number(param);

    if (typeof param !== "number" || isNaN(Number(param)))
      throw "Error: Age  must be a number";
    if (param < 18 || param > 70) throw "Error: Age must be with in 18 to 70";
    if (!Number.isInteger(param)) throw "Error: Age must be an Integer";
    return param;
  },

  isArrayWithTheNonEmptyString(param) {
    //check if the incoming array of strings contains only valid strings
    if (!Array.isArray(param)) throw "Error: The Tags must be an Array";

    for (let i = 0; i < param.length; i++) {
      if (this.isProperString(param[i]) === 0)
        throw "Error: The Tags must contains only non empty strings";
    }
  },

  display() {
    console.log("hi");
  },

  checkId(id) {
    if (!id) throw "Error: You must provide an id to search for";
    if (typeof id !== "string") throw "Error: id must be a string";
    id = id.trim();
    if (id.length === 0)
      throw "Error: id cannot be an empty string or just spaces";
    if (!ObjectId.isValid(id)) throw "Error: invalid object ID";
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    strVal = strVal.toString();
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },

  checkStringArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw `Error: You must provide an array of ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
        throw `Error: One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },
  checkStringArray2(arr, varName) {
    //We will not allow an empty array for this,

    if (!arr || !Array.isArray(arr))
      throw `Error: You must provide an array of ${varName}`;
    if (arr.length < 1)
      throw `Error: You must provide an array of ${varName} with at least on element`;
    for (let i in arr) {
      if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
        throw `Error: One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }
    return arr;
  },

  checkArrofId(arr, varName) {
    if (!arr || !Array.isArray(arr))
      throw `Error: You must provide an array of ${varName}`;
    if (arr.length < 1)
      throw `Error: You must provide an array of ${varName} with at least on element`;
    for (let i in arr) {
      if (!arr[i]) throw "Error: You must provide an id to search for";
      if (typeof arr[i] !== "string") throw "Error: id must be a string";
      arr[i] = arr[i].trim();
      if (arr[i].length === 0)
        throw "Error: id cannot be an empty string or just spaces";
      if (!ObjectId.isValid(arr[i])) throw "Error: invalid object ID";
    }
    return arr;
  },

  checkGender(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;

    strVal = strVal.toLowerCase(); // allow case insensitive
    if (
      strVal === "male" ||
      strVal === "female" ||
      strVal === "prefer not to say"
    )
      return strVal;
    throw `Error: ${strVal} is not a valid value for ${varName}. This only allows male, female or perfer not to say`;
  },

  checkState(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim().toUpperCase(); // Upper case every words

    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;

    if (strVal.length > 2)
      throw `Error: ${varName} should be abbreviations that less than two words`;

    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;

    if (!isValidState(strVal))
      // using api to check is the valid state in the US
      throw `Error: ${strVal} is not a valid state for ${varName} in the US.`;
    return strVal;
  },

  checkExperience(strVal, varName) {
    if (!strVal && strVal !== 0) throw `Error: You must supply a ${varName}`; //Not equal to 0 because in js, it will detect the condition is false when it is 0;
    if (typeof strVal !== "number") throw `Error: ${varName} must be a number!`;
    if (isNaN(strVal))
      throw `Error: ${varName} must supply a number that is not NaN!`;
    if (strVal < 0 || strVal > 80)
      throw `Error: ${varName} can not lower than 0 or greater than 80 years!`;
    return strVal;
  },

  checkEmail(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim().toLowerCase(); // allow case insensitive and email only allow lower case

    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    if (!validator.validate(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} address.`;
    return strVal;
  },
  checkGroupAndConnections(
    arr,
    varName //Different from checkStringArray. This function will not only check the array elements contain non-string elements but take care of the string is object id or not.
  ) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw `Error: You must provide an array of ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
        throw `Error: One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
      arr[i] = validations.checkId(arr[i]);
    }

    return arr;
  },
  checkValidDate(
    strVal,
    varName // valid date form DD/MM/YYYY
  ) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    if (!validateDate(strVal, "boolean"))
      throw `Error: ${strVal} is not a valid date for ${varName}`;
    return strVal;
  },
  checkVideoUrl(strVal, varName) {
    if (strVal === "") return "";
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    const regex = /(http|https):\/\/(\w{3,}\.|\www\.)(\w{2,})(\.com|\S+)/g;
    if (!regex.test(strVal)) throw `Error: ${varName} is not a valid link!`;
    if (!isNaN(strVal))
      throw `Error: ${varName} is not a valid value for video link as it only contains digits`;
    return strVal;
  },
  checkTags(arr) {
    //if it's not empty, we will make sure all tags are strings
    if (arr === undefined)
      throw "Error: You must provide at least one interest area";
    if (arr.length < 1)
      throw `Error: You must provide at least one interest area`;
    if (typeof arr === "string") return arr;
    if (!Array.isArray(arr)) throw `Error: Interest area is not valid type`;
    for (let i in arr) {
      if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
        throw `Error: One or more elements in tags array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim().toLowerCase(); //lowercase for every tag elements' for easier detect
    }
    const tags = [
      "front-end",
      "back-end",
      "full-stack",
      "cybersecurity",
      "ai",
      "software development",
      "finance quantitative analysis",
      "data science",
      "medical",
      "biology",
      "chemistry",
      "law",
      "business",
      "engineering",
      "art",
      "music",
    ];
    const checker = (desired, target) =>
      target.every((ele) => desired.includes(ele));
    if (!checker(tags, arr)) throw `Error: tags is not valid tags`;
    return arr;
  },
};

export default validations;
