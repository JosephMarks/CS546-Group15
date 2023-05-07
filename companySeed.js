import companyFunctions from "./data/company.js";
import userFunctions from "./data/user.js"

try {

    // companyFunctions.createCompany('Google', 'google@google.com', 'tech', ['al', 'ak'], '12345', 'this is google', '1.png');
    //companyFunctions.createCompany('Barclays', 'Barclays@Barclays.com', 'chemistry', ['id'], '56789', 'this is barclays', '2.png');
    // companyFunctions.createCompany('facebook', 'facebook@facebook.com', 'tech', ['il'], '12345', 'this is facebook', '3.png');
    // companyFunctions.createCompany('adobe', 'adobe@adobe.com', 'tech', ['ny'], '67895', 'this is adobe', '4.png');
    // companyFunctions.createCompany('prudential', 'prudential@prudential.com', 'tech', ['nj'], '25000', 'this is prudential', '5.png');

    await userFunctions.createUser('Google', 'Foogle 21', '21', 'google79@google.com', '123456789@ggHH', 'Company');
    // await userFunctions.createUser('         ', '', '99', 'Barclays@Barclays.com', '123456789@ggHH', 'Company');
    // await userFunctions.createUser('facebook', 'MemeBook', '27', 'facebook@facebook.com', '123456789@ggHH', 'Company');
    // await userFunctions.createUser('adobe', 'Fodobe', '32', 'adobe@adobe.com', '123456789@ggHH', 'Company');
    // await userFunctions.createUser('prudential', 'Identical', '56', 'prudential@prudential.com', '123456789@ggHH', 'Company');

    // companyFunctions.createJob('GOogle', 'google@google.com', 'web developer Job5', 21000, 'internship', 'remote', ['python', 'c++'], 'nj', 'this is a web developer Job');
    // companyFunctions.createJob('google', 'Google@google.com', 'WEB developer Job1', 22000, 'internship', 'remote', ['python'], 'nj', 'this is a web developer Job');
    // companyFunctions.createJob('GOOGLE', 'goOgle@google.com', 'WEB developer Job2', 23000, 'internship', 'remote', ['python', 'javascript'], 'nj', 'this is a web developer Job');
    // companyFunctions.createJob('google', 'google@google.Com', 'WEB developer Job3', 24000, 'internship', 'remote', ['python'], 'nj', 'this is a web developer Job');
    // companyFunctions.createJob('GoogLe', 'google@google.coM', 'WEB developer Job4', 25000, 'internship', 'remote', ['python'], 'nj', 'this is a web developer Job');

    // companyFunctions.createJob('adobe', 'adobe@adobe.com', 'web developer Job5', 21000, 'internship', 'remote', ['python', 'c++'], 'nj', 'this is a web developer Job');
    // companyFunctions.createJob('ADOBE', 'ADOBE@ADOBE.com', 'WEB developer Job1', 22000, 'internship', 'remote', ['python'], 'nj', 'this is a web developer Job');
    // companyFunctions.createJob('ADOBE', 'ADOBE@ADOBE.com', 'WEB developer Job2', 23000, 'internship', 'remote', ['python', 'javascript'], 'nj', 'this is a web developer Job');
    // companyFunctions.createJob('ADOBE', 'ADOBE@ADOBE.Com', 'WEB developer Job3', 24000, 'internship', 'remote', ['python'], 'nj', 'this is a web developer Job');
    // companyFunctions.createJob('ADOBE', 'ADOBE@ADOBE.coM', 'WEB developer Job4', 25000, 'internship', 'remote', ['python'], 'nj', 'this is a web developer Job');
    
} catch(e) {

    console.log(e);

}