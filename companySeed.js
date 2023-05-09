import companyFunctions from "./data/company.js";
import userFunctions from "./data/user.js"
import xss from "xss";


try {

    await companyFunctions.createCompany('google', 'google@google.com', 'tech', ['al', 'ak'], "15345", 'Google LLC is an American multinational technology company focusing on online advertising, search engine technology, cloud computing, computer software, quantum computing, e-commerce, artificial intelligence, and consumer electronics', '1.png', 'health care, dental or vision packages', 'employee friendly, socially aligned');
    await companyFunctions.createCompany('Barclays', 'Barclays@Barclays.com', 'chemistry', ['id'], '56789', 'Barclays is a British multinational universal bank, headquartered in London, England. Barclays operates as two divisions, Barclays UK and Barclays International, supported by a service company, Barclays Execution Services. ', '2.png', 'health care, dental or vision packages', 'employee friendly, socially aligned');
    await companyFunctions.createCompany('adobe', 'adobe@adobe.com', 'tech', ['ny'], '67895', 'Adobe Inc., originally called Adobe Systems Incorporated, is an American multinational computer software company incorporated in Delaware and headquartered in San Jose, California.', '4.png', 'health care, dental or vision packages', 'employee friendly, socially aligned');
    await companyFunctions.createCompany('prudential', 'prudential@prudential.com', 'tech', ['nj'], '25000', 'Prudential Financial, Inc. is an American Fortune Global 500 and Fortune 500 company whose subsidiaries provide insurance, retirement planning, investment management, and other products and services to both retail and institutional customers throughout the United States and in over 40 other countries', '5.png', 'health care, dental or vision packages', 'employee friendly, socially aligned');

    // await userFunctions.createUser('Google ', 'Foogle ', '70', 'google@google.com', '123456789@ggHH', 'Company');
    // await userFunctions.createUser('barclays ', 'barclays', '55', 'Barclays@Barclays.com', '123456789@ggHH', 'Company');
    // await userFunctions.createUser('adobe', 'Fodobe', '32', 'adobe@adobe.com', '123456789@ggHH', 'Company');
    // await userFunctions.createUser('prudential', 'Identical', '56', 'prudential@prudential.com', '123456789@ggHH', 'Company');

    // await companyFunctions.createJob('GOogle', 'google@google.com', 'web developer Job5', 21000, 'internship', 'remote', ['python', 'c++'], 'nj', 'this is a web developer Job');
    // await companyFunctions.createJob('google', 'Google@google.com', 'WEB developer Job1', 22000, 'internship', 'remote', ['python'], 'nj', 'this is a web developer Job');
    // await companyFunctions.createJob('GOOGLE', 'goOgle@google.com', 'WEB developer Job2', 23000, 'internship', 'remote', ['python', 'javascript'], 'nj', 'this is a web developer Job');
    // await companyFunctions.createJob('google', 'google@google.Com', 'WEB developer Job3', 24000, 'internship', 'remote', ['python'], 'nj', 'this is a web developer Job');
    // await companyFunctions.createJob('GoogLe', 'google@google.coM', 'WEB developer Job4', 25000, 'internship', 'remote', ['python'], 'nj', 'this is a web developer Job');

    // await companyFunctions.createJob('adobe', 'adobe@adobe.com', 'web developer Job5', 21000, 'internship', 'remote', ['python', 'c++'], 'nj', 'this is a web developer Job');
    // await companyFunctions.createJob('ADOBE', 'ADOBE@ADOBE.com', 'WEB developer Job1', 22000, 'internship', 'remote', ['python'], 'nj', 'this is a web developer Job');
    // await companyFunctions.createJob('ADOBE', 'ADOBE@ADOBE.com', 'WEB developer Job2', 23000, 'internship', 'remote', ['python', 'javascript'], 'nj', 'this is a web developer Job');
    // await companyFunctions.createJob('ADOBE', 'ADOBE@ADOBE.Com', 'WEB developer Job3', 24000, 'internship', 'remote', ['python'], 'nj', 'this is a web developer Job');
    // await companyFunctions.createJob('ADOBE', 'ADOBE@ADOBE.coM', 'WEB developer Job4', 25000, 'internship', 'remote', ['python'], 'nj', 'this is a web developer Job');
    
} catch(e) {

    console.log(e);

}