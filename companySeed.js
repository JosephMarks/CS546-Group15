import companyFunctions from "./data/company.js";
import userFunctions from "./data/user.js"

try {

    companyFunctions.createCompany('Google2', 'google@google.com', 'tech', ['al', 'ak'], '12345', 'this is google', '1.png');
    companyFunctions.createCompany('Barclays', 'Barclays@Barclays.com', 'chemistry', ['id'], '56789', 'this is barclays', '2.png');
    companyFunctions.createCompany('facebook', 'facebook@facebook.com', 'tech', ['il'], '12345', 'this is facebook', '3.png');
    companyFunctions.createCompany('adobe', 'adobe@adobe.com', 'tech', ['ny'], '67895', 'this is adobe', '4.png');
    companyFunctions.createCompany('prudential', 'prudential@prudential.com', 'tech', ['nj'], '25000', 'this is prudential', '5.png');

    // userFunctions.createUser('Google', 'Foogle', '21', 'google@google.com', '123456789@ggHH', 'Company');
    // userFunctions.createUser('Barclays', 'Marclays', '25', 'Barclays@Barclays.com', '123456789@ggHH', 'Company');
    // userFunctions.createUser('facebook', 'MemeBook', '27', 'facebook@facebook.com', '123456789@ggHH', 'Company');
    // userFunctions.createUser('adobe', 'Fodobe', '32', 'adobe@adobe.com', '123456789@ggHH', 'Company');
    // userFunctions.createUser('prudential', 'Identical', '56', 'prudential@prudential.com', '123456789@ggHH', 'Company');




} catch(e) {

    console.log(e);

}