// import validator from "email-validator"; //use to validate email address
// import { isValidStateInput as isValidState } from "usa-state-validator"; //use to check state is valid in the US, state must be in bref. words
// import validateDate from "validate-date"; //use to check date is valid or not
// import linkCheck from "link-check";
// import { ObjectId } from "mongodb";
// import companyData from "./data/company.js";
// Valid date would be DD/MM/YYYY

const validations = {

  validateIsString(param) {
    for (let element of param) {
      if (typeof element !== "string") return 0;
      if (element.trim().length === 0) return 0;
    }
    return 1;
  },

  checkAreaText (param, name) {
    if (!param) throw `Error: ${name} cannot be empty`;

    param = param.trim();
    if (param.length < 15) throw `Error: ${name} cannot be less than 15 characters`;
    param = param.replaceAll(' ', '');

    if (isNaN(Number(param))) return param;
    else throw `Error: ${name} cannot be all numbers`;
  },
  
  checkTechJobTitle (param, name) {
    if (!param) throw `Error: ${name} cannot be empty`;

    param = param.trim();
    param = param.replaceAll(' ', '');

    if (isNaN(Number(param))) return param;
    else throw `Error: ${name} cannot be all numbers`;
  },

  validateName(param) {
    if (param.trim().length < 2 || param.trim().length > 25)
      throw "Error : Enter a valid firstName and the lastName";

    for (let i = 0; i < param.length; i++) {
      if (!Boolean(param[i].match(/^[A-Za-z]*$/))) {
        if (
          param[i] !== " " &&
          !param[i].match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)
        )
          throw "Error : Enter a valid firstName or Last Name";
      }
    }
  },
  validateNameReturn(param) {
    if (param.trim().length < 2 || param.trim().length > 25)
      throw "Error : Enter a valid firstName and the lastName";

    if (param.match(/[0-9]+/)) throw "Error : Invalid First or Last Name";

    return param;
  },
    validateCandidateType(param) {
        if (
            (param !== "Student") &&
            (param !== "Company")
        ) {
            throw "Error : Candidate Type can only be Student or Company"
        }
    },
  validateNameAllNumberReturn(param) {
    if (param.trim().length < 2 || param.trim().length > 25)
      throw "Error : Enter a valid Name and the Name";

    if (!param.match(/[a-zA-Z]/g)) throw "Error : Enter a valid Name";

    return param;
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

  isNumberOfEmployee(param) {
    if (isNaN(Number(param)))
      throw "Error: Number of Employee must be a number";
    param = Number(param);

    if (typeof param !== "number" || isNaN(Number(param)))
      throw "Error: Number Of Employee must be a number";
    if (param < 1 || param > 100000)
      throw "Error: Number Of Employee with in 1 to 100000";
    if (!Number.isInteger(param)) throw "Error: Number Of Employee an Integer";
    return param;
  },

  isSalary(param) {
    if (isNaN(Number(param))) throw "Error: Salary must be a number";
    param = Number(param);

    if (typeof param !== "number" || isNaN(Number(param)))
      throw "Error: Salary must be a number";
    if (param < 15000 || param > 1000000000 ) throw "Error: Salary should be in between 15000 and 1000000000";
    if (!Number.isInteger(param)) throw "Error: Salary an Integer";
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

  isArrayWithTheNonEmptyStringForLocation(param) {
    let allLocations = [];
    //check if the incoming array of strings contains only valid strings
    if (!Array.isArray(param)) throw "Error: The Location must be an Array";

    for (let i = 0; i < param.length; i++) {
      if (this.isProperString(param[i]) === 0)
        throw "Error: The Location must contains only valid non empty strings";
    }
  },

  isArrayWithTheNonEmptyStringForJobType(param) {

    let allJobs = ['remote', 'online', 'hybrid'];
    console.log(param);

    //check if the incoming array of strings contains only valid strings
    if (!Array.isArray(param)) throw "Error: The JobType must be an Array";

    for (let i = 0; i < param.length; i++) {

      console.log(allJobs.includes(param[i][0]));
      if (this.isProperString(param[i]) === 0 || !allJobs.includes(param[i][0].trim().toLowerCase())) 
        throw "Error: The JobType must contains only valid non empty strings";
    }
  },

  isArrayWithTheNonEmptyStringForSkills(param) {
    let allSkills = ["python", "c++", "javascript", "nodejs"];
  
    //check if the incoming array of strings contains only valid strings
    if (!Array.isArray(param)) throw "Error: The Skills must be an Array";
    console.log(param);

    for (let i = 0; i < param.length; i++) {
      console.log(allSkills.includes(param[i][0]));

      if (this.isProperString(param[i]) === 0 || !allSkills.includes(param[i][0].trim().toLowerCase()));
        throw "Error: The Skills must contains only valid non empty strings";
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
      "others",
    ];
    const checker = (desired, target) =>
      target.every((ele) => desired.includes(ele));
    if (!checker(tags, arr)) throw `Error: tags is not valid tags`;
    return arr;
  },
  checkPage(varName, strVal) {
    if (!varName) throw `Error: You must supply ${strVal}`;
    varName = Number(varName);
    if (isNaN(varName)) `Error: ${strVal} cannot be not a number type`;
    if (Number.isInteger(varName)) `Error: ${strVal} must be an integer type`;
    if (varName < 0 || varName > 5)
      throw `Error: ${strVal} cannot less than one page or over 5 pages`;
    return varName;
  },
  checkParamsAndSessionId(params, session) {
    if (params !== session)
      throw `Error: You are not allow to access this. Please log out and try again!`;
  },

  async checkCompanyTags(arr) {
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
    let companyName = await companyData.getAllCompanyName();
    const checker = (desired, target) =>
      target.every((ele) => desired.includes(ele));
    if (!checker(companyName, arr))
      throw `Error: companyName is not valid tags`;
    return arr;
  },

  checkFieldsTags(arr) {
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
      "others",
    ];
    const checker = (desired, target) =>
      target.every((ele) => desired.includes(ele));
    if (!checker(tags, arr)) throw `Error: Fields tags is not valid tags`;
    return arr;
  },

  checkCategoryTags(arr) {
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
      "interview",
      "daily thoughts",
      "making friends",
      "others",
      "housing",
      "asking for help",
    ];
    const checker = (desired, target) =>
      target.every((ele) => desired.includes(ele));
    if (!checker(tags, arr)) throw `Error: category tags is not valid tags`;
    return arr;
  },

  checkSkillsTags(arr) {
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
      "python",
      "c++",
      "javascript",
      "nodejs",
      "react",
      "datascience",
      "others",
    ];
    const checker = (desired, target) =>
      target.every((ele) => desired.includes(ele));
    if (!checker(tags, arr)) throw `Error: skill tags is not valid tags`;
    return arr;
  },
  checkJobtypeTags(arr) {
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
    const tags = ["remote", "online", "hybrid"];
    const checker = (desired, target) =>
      target.every((ele) => desired.includes(ele));
    if (!checker(tags, arr)) throw `Error: job type tags is not valid tags`;
    return arr;
  },
  checkLevelTags(arr) {
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
    const tags = ["senior", "internship", "mid"];
    const checker = (desired, target) =>
      target.every((ele) => desired.includes(ele));
    if (!checker(tags, arr)) throw `Error: level tags is not valid tags`;
    return arr[0];
  },
  checkLocationTags(arr) {
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
      arr[i] = arr[i].trim().toUpperCase(); //lowercase for every tag elements' for easier detect
    }
    const tags = [
      "AK",
      "AL",
      "AR",
      "AZ",
      "CA",
      "CO",
      "CT",
      "DC",
      "DE",
      "FL",
      "GA",
      "HI",
      "IA",
      "ID",
      "IL",
      "IN",
      "KS",
      "KY",
      "LA",
      "MA",
      "MD",
      "ME",
      "MI",
      "MN",
      "MO",
      "MS",
      "MT",
      "NC",
      "ND",
      "NE",
      "NH",
      "NJ",
      "NM",
      "NV",
      "NY",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VA",
      "VT",
      "WA",
      "WI",
      "WV",
      "WY",
    ];
    const checker = (desired, target) =>
      target.every((ele) => desired.includes(ele));

    if (!checker(tags, arr)) throw `Error: location tags is not valid tags`;
    return arr;
  },

  checkArrNumber(arr) {
    for (let x of arr) {
      if (!Number(x)) {
        return false;
      }
    }
    return true;
  },
  checkDate(date) {
    if (!date || typeof date !== "string")
      throw "You should input eventDate in string.";
    if (date.trim().length === 0)
      throw "The input eventDate should not be empty strings.(YYYY-MM-DD)";
    date = date.trim();
    if (
      !date.includes("-") ||
      date.split("-").length !== 3 ||
      !checkArrNumber(date.split("-"))
    )
      throw "The input eventDate should be valid date format strings. (YYYY-MM-DD)";
    let dateArr = date.split("-");
    //Reference date format recognition: https://blog.csdn.net/qq_17627195/article/details/111486466
    if (!Date.parse(new Date(date)))
      throw "The input date should be valid date format strings. (YYYY-MM-DD)";
    if (Number(dateArr[0]) < 1990 || Number(dateArr[0]) > 2050)
      throw "The date should be a number between 1990 and 2050.";
    return date;
  },
  checkDueDate(date) {
    if (!date || typeof date !== "string")
      throw "You should input eventDate in string.";
    if (date.trim().length === 0)
      throw "The input eventDate should not be empty strings.(YYYY-MM-DD)";
    date = date.trim();
    if (
      !date.includes("-") ||
      date.split("-").length !== 3 ||
      !checkArrNumber(date.split("-"))
    )
      throw "The input eventDate should be valid date format strings. (YYYY-MM-DD)";
    let dateArr = date.split("-");
    //Reference date format recognition: https://blog.csdn.net/qq_17627195/article/details/111486466
    if (!Date.parse(new Date(date)))
      throw "The input date should be valid date format strings. (YYYY-MM-DD)";
    let cur = new Date().toLocaleDateString();
    let cur_year = cur.split("/")[2];
    if (Number(dateArr[0]) < cur_year || Number(dateArr[0]) > 2050)
      throw "The date should be a number from current year to 2050.";
    return date;
  },
};

const checkArrNumber = (arr) => {
  for (let x of arr) {
    if (!Number(x)) {
      return false;
    }
  }
  return true;
};
export default validations;
