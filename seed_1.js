import validations from "./helpers.js";
import * as collection from "./config/mongoCollections.js";
import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import usersData from "./data/user.js";
import networkData from "./data/network.js";
import skillsData from "./data/skills.js";
import { userData } from "./data/index.js";
import spost from "./data/socialPost.js";
import refer from "./data/referral.js";
import * as groupData from "./data/groups.js";
import * as groupEventsData from "./data/groupEvents.js";
import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import { groupActivityData } from "./data/index.js";
import * as messageData from "./data/messages.js";
import * as userJobHistoryData from "./data/userJobHistory.js";
import * as groupActivityDataFunctions from "./data/groupActivity.js";
import * as groupEventData from "./data/groupEvents.js";
import companyFunctions from "./data/company.js";
import bcrypt from "bcryptjs";

// this file only put the "!!![valid data]!!!" any validate checking should go into seed.js file.
export const pseudoData = async () => {
  const joe = await usersData.createUser(
    "Joeseph",
    "Marks",
    20,
    "jmarks@ggg.edu",
    "Test1234$",
    "Student"
  );

  console.log(joe);

  await usersData.updateUsers(joe._id, { fname: 'joe ', 
  lname:' marks ', 
  email:'jmarks@ggg.edu', 
  password : await bcrypt.hash('Test1234$', 10),
  age: '23', 
  gitHubUserName: 'jmarks@gmail.com', 
  gender: 'male', 
  headerDescription: 'jhhsgysgtdf', 
  aboutMe: 'jgdjsgdshfd', 
  locationState: 'ny', 
  university: 'stevens', 
  collegeMajor: 'masters', 
  status: 'Student', 
  skills: ['c++', 'python'], 
  experience: 2, 
  seekingJob: [],
  connections: [],
  group: [],
  createdAt: '09/05/2023',
  updatedAt: '09/05/2023',
  socialPost: [],
  likedPost: [],
  collectedPost: []});

  const pundir = await usersData.createUser(
    "Pradyumn",
    "Pundir",
    20,
    "ppd@ggg.edu",
    "Test1234$",
    "Student"
  );

  await usersData.updateUsers(pundir._id, { fname: 'pradyumn ', lname:' pundir ', email:'ppd@ggg.edu', password: await bcrypt.hash('Test1234$', 10), age: '21', gitHubUserName: 'ppp@gmail.com', gender: 'male', headerDescription: 'jhhsgysgtdf', aboutMe: 'jgdjsgdshfd', locationState: 'ny', university: 'stevens', collegeMajor: 'masters', status: 'Student', skills: ['javascript'], experience: 2, seekingJob: [],
  connections: [],
  group: [],
  createdAt: '09/05/2023',
  updatedAt: '09/05/2023',
  socialPost: [],
  likedPost: [],
  collectedPost: []});


  const ruobing = await usersData.createUser(
    "Ruobing",
    "Liu",
    20,
    "rubinliu@ggg.edu",
    "Test1234$",
    "Student"
  );

  await usersData.updateUsers(ruobing._id, { fname: 'ruobing ', 
  lname:' liu ', 
  email:'rubinliu@ggg.edu', 
  password: await bcrypt.hash('Test1234$', 10), 
  age: '23', 
  gitHubUserName: 'rubinliu@gmail.com', 
  gender: 'female', 
  headerDescription: 'jhhsgysgtdf', 
  aboutMe: 'jgdjsgdshfd', 
  locationState: 'ny', 
  university: 'stevens', 
  collegeMajor: 'masters', 
  status: 'Student', 
  skills: ['c++'], 
  experience: 2, 
  seekingJob: [],
  connections: [],
  group: [],
  createdAt: '09/05/2023',
  updatedAt: '09/05/2023',
  socialPost: [],
  likedPost: [],
  collectedPost: []});

  const ming = await usersData.createUser(
    "Tzu Ming",
    "Lu",
    20,
    "tlu14@ggg.edu",
    "Test1234$",
    "Student"
  );

  await usersData.updateUsers(ming._id, { fname: 'ming ', 
  lname:' ming ', 
  email:'tlu14@ggg.edu', 
  password:await bcrypt.hash('Test1234$', 10), 
  age: '23', 
  gitHubUserName: 'tlu14@gmail.com', 
  gender: 'female', 
  headerDescription: 'jhhsgysgtdf', 
  aboutMe: 'jgdjsgdshfd', 
  locationState: 'ny', 
  university: 'stevens', 
  collegeMajor: 'masters', 
  status: 'Student', 
  skills: ['c++', 'javascript'], 
  experience: 2, 
  seekingJob: [],
  connections: [],
  group: [],
  createdAt: '09/05/2023',
  updatedAt: '09/05/2023',
  socialPost: [],
  likedPost: [],
  collectedPost: []});

  const Jakob = await userData.createUser(
    "jakob",
    "Marks",
    35,
    "jake@gmail.com",
    "Test1234$",
    "Student"
  );

  const Karl = await userData.createUser(
    "Karl",
    "Marx",
    39,
    "karl@gmail.com",
    "Test1234$",
    "Student"
  );

  const mingPost = await networkData.addPost(
    Karl._id,
    "This is Tzu Ming's first content."
  );
  await networkData.addComments(
    mingPost._id,
    joe._id,
    "Congrats to finsih this semester"
  );
  await networkData.addComments(
    mingPost._id,
    pundir._id,
    "Yes, team work makes dream work."
  );
  await networkData.addComments(
    mingPost._id,
    ruobing._id,
    "Hope we all can get good grades."
  );
  await networkData.addConnections(ming._id, joe._id);
  await skillsData.createSkills(
    ming._id,
    "About Taylor Swift",
    "Taylor Swift is a singer-songwriter from the United States who has become one of the most successful and influential artists of her generation. She first rose to fame as a country music star in the late 2000s, but has since transitioned to pop music and has released several critically acclaimed albums. With a string of hit songs and numerous awards under her belt, including multiple Grammy Awards, Taylor Swift has become a cultural icon and a role model for millions of fans around the world. Her unique blend of personal storytelling, catchy melodies, and powerful vocals has made her a beloved and enduring figure in the music industry.",
    "https://www.youtube.com/watch?v=b1kbLwvqugk&ab_channel=TaylorSwiftVEVO",
    "music"
  );

  // await companyFunctions.createCompany('google', 'google@google.com', 'tech', ['al', 'ak'], "15345", 'Google LLC is an American multinational technology company focusing on online advertising, search engine technology, cloud computing, computer software, quantum computing, e-commerce, artificial intelligence, and consumer electronics', '1.png', 'health care, dental or vision packages', 'employee friendly, socially aligned');
  // await companyFunctions.createCompany('Barclays', 'Barclays@Barclays.com', 'chemistry', ['id'], '56789', 'Barclays is a British multinational universal bank, headquartered in London, England. Barclays operates as two divisions, Barclays UK and Barclays International, supported by a service company, Barclays Execution Services. ', '2.png', 'health care, dental or vision packages', 'employee friendly, socially aligned');
  // await companyFunctions.createCompany('adobe', 'adobe@adobe.com', 'tech', ['ny'], '67895', 'Adobe Inc., originally called Adobe Systems Incorporated, is an American multinational computer software company incorporated in Delaware and headquartered in San Jose, California.', '4.png', 'health care, dental or vision packages', 'employee friendly, socially aligned');
  // await companyFunctions.createCompany('prudential', 'prudential@prudential.com', 'tech', ['nj'], '25000', 'Prudential Financial, Inc. is an American Fortune Global 500 and Fortune 500 company whose subsidiaries provide insurance, retirement planning, investment management, and other products and services to both retail and institutional customers throughout the United States and in over 40 other countries', '5.png', 'health care, dental or vision packages', 'employee friendly, socially aligned');


  await companyFunctions.createCompany(
    "google",
    "google@google.com",
    "tech",
    ["al", "ak"],
    "15345",
    "Google LLC is an American multinational technology company focusing on online advertising, search engine technology, cloud computing, computer software, quantum computing, e-commerce, artificial intelligence, and consumer electronics",
    "1.png",
    "health care, dental or vision packages",
    "employee friendly, socially aligned"
  );

  await companyFunctions.createCompany(
    "Barclays",
    "Barclays@Barclays.com",
    "chemistry",
    ["id"],
    "56789",
    "Barclays is a British multinational universal bank, headquartered in London, England. Barclays operates as two divisions, Barclays UK and Barclays International, supported by a service company, Barclays Execution Services. ",
    "2.png",
    "health care, dental or vision packages",
    "employee friendly, socially aligned"
  );

  await companyFunctions.createCompany(
    "adobe",
    "adobe@adobe.com",
    "tech",
    ["ny"],
    "67895",
    "Adobe Inc., originally called Adobe Systems Incorporated, is an American multinational computer software company incorporated in Delaware and headquartered in San Jose, California.",
    "4.png",
    "health care, dental or vision packages",
    "employee friendly, socially aligned"
  );

  await companyFunctions.createCompany(
    "prudential",
    "prudential@prudential.com",
    "tech",
    ["nj"],
    "25000",
    "Prudential Financial, Inc. is an American Fortune Global 500 and Fortune 500 company whose subsidiaries provide insurance, retirement planning, investment management, and other products and services to both retail and institutional customers throughout the United States and in over 40 other countries",
    "5.png",
    "health care, dental or vision packages",
    "employee friendly, socially aligned"
  );

  let g = await userData.createUser(
    "Google ",
    "Foogle ",
    "70",
    "google@google.com",
    "123456789@ggHH",
    "Company"
  );
  let b = await userData.createUser(
    "barclays ",
    "barclays",
    "55",
    "Barclays@Barclays.com",
    "123456789@ggHH",
    "Company"
  );
  let a = await userData.createUser(
    "adobe",
    "Fodobe",
    "32",
    "adobe@adobe.com",
    "123456789@ggHH",
    "Company"
  );
  let p = await userData.createUser(
    "prudential",
    "Identical",
    "56",
    "prudential@prudential.com",
    "123456789@ggHH",
    "Company"
  );
  await userData.updateUsersCompany(a._id, "adobe");
  await userData.updateUsersCompany(p._id, "prudential");
  await userData.updateUsersCompany(g._id, "google");
  await companyFunctions.createJob(
    "GOogle",
    "google@google.com",
    "web developer Job5",
    21000,
    "internship",
    "remote",
    ["python", "c++"],
    "nj",
    "this is a web developer Job"
  );
  await companyFunctions.createJob(
    "google",
    "Google@google.com",
    "WEB developer Job1",
    22000,
    "internship",
    "remote",
    ["python"],
    "nj",
    "this is a web developer Job"
  );
  await companyFunctions.createJob(
    "GOOGLE",
    "goOgle@google.com",
    "WEB developer Job2",
    23000,
    "internship",
    "remote",
    ["python", "javascript"],
    "nj",
    "this is a web developer Job"
  );
  await companyFunctions.createJob(
    "google",
    "google@google.Com",
    "WEB developer Job3",
    24000,
    "internship",
    "remote",
    ["python"],
    "nj",
    "this is a web developer Job"
  );
  await companyFunctions.createJob(
    "GoogLe",
    "google@google.coM",
    "WEB developer Job4",
    25000,
    "internship",
    "remote",
    ["python"],
    "nj",
    "this is a web developer Job"
  );

  await companyFunctions.createJob(
    "adobe",
    "adobe@adobe.com",
    "web developer Job5",
    21000,
    "internship",
    "remote",
    ["python", "c++"],
    "nj",
    "this is a web developer Job"
  );
  await companyFunctions.createJob(
    "ADOBE",
    "ADOBE@ADOBE.com",
    "WEB developer Job1",
    22000,
    "internship",
    "remote",
    ["python"],
    "nj",
    "this is a web developer Job"
  );
  await companyFunctions.createJob(
    "ADOBE",
    "ADOBE@ADOBE.com",
    "WEB developer Job2",
    23000,
    "internship",
    "remote",
    ["python", "javascript"],
    "nj",
    "this is a web developer Job"
  );
  await companyFunctions.createJob(
    "ADOBE",
    "ADOBE@ADOBE.Com",
    "WEB developer Job3",
    24000,
    "internship",
    "remote",
    ["python"],
    "nj",
    "this is a web developer Job"
  );
  await skillsData.createSkills(
    ming._id,
    "About Blackpink",
    "Blackpink is a South Korean girl group formed in 2016 by YG Entertainment. The group consists of four members: Jisoo, Jennie, Rosé, and Lisa. Blackpink has become one of the most successful and popular K-pop groups, known for their powerful and catchy songs, fierce performances, and fashion-forward style. They have broken numerous records, including becoming the first K-pop group to have a music video reach one billion views on YouTube. Blackpink has also gained global recognition, collaborating with artists such as Lady Gaga and Selena Gomez. Their fanbase, known as Blinks, continues to grow as they cement their status as a powerhouse in the music industry.",
    "https://www.youtube.com/watch?v=2S24-y0Ij3Y&ab_channel=BLACKPINK",
    "music"
  );

  // await companyFunctions.createCompany(
  //   "google",
  //   "google@google.com",
  //   "tech",
  //   ["al", "ak"],
  //   "15345",
  //   "Google LLC is an American multinational technology company focusing on online advertising, search engine technology, cloud computing, computer software, quantum computing, e-commerce, artificial intelligence, and consumer electronics",
  //   "1.png",
  //   "health care, dental or vision packages",
  //   "employee friendly, socially aligned"
  // );
  // await companyFunctions.createCompany(
  //   "Barclays",
  //   "Barclays@Barclays.com",
  //   "chemistry",
  //   ["id"],
  //   "56789",
  //   "Barclays is a British multinational universal bank, headquartered in London, England. Barclays operates as two divisions, Barclays UK and Barclays International, supported by a service company, Barclays Execution Services. ",
  //   "2.png",
  //   "health care, dental or vision packages",
  //   "employee friendly, socially aligned"
  // );
  // await companyFunctions.createCompany(
  //   "adobe",
  //   "adobe@adobe.com",
  //   "tech",
  //   ["ny"],
  //   "67895",
  //   "Adobe Inc., originally called Adobe Systems Incorporated, is an American multinational computer software company incorporated in Delaware and headquartered in San Jose, California.",
  //   "4.png",
  //   "health care, dental or vision packages",
  //   "employee friendly, socially aligned"
  // );
  // await companyFunctions.createCompany(
  //   "prudential",
  //   "prudential@prudential.com",
  //   "tech",
  //   ["nj"],
  //   "25000",
  //   "Prudential Financial, Inc. is an American Fortune Global 500 and Fortune 500 company whose subsidiaries provide insurance, retirement planning, investment management, and other products and services to both retail and institutional customers throughout the United States and in over 40 other countries",
  //   "5.png",
  //   "health care, dental or vision packages",
  //   "employee friendly, socially aligned"
  // );

  let title1 = "aefarfasf";
  let body1 = "aefarfasf";
  let posterId1 = ruobing._id;
  let eventdate1 = "2024-10-05";
  let fields1 = ["medical"];
  let company1 = ["Barclays"];
  let category1 = ["interview"];
  let socialPost1 = await spost.addPost(
    title1,
    body1,
    posterId1,
    eventdate1,
    fields1,
    company1,
    category1
  );
  let s1_id = socialPost1._id.toString();

  let title2 = "aefarfasf";
  let body2 = "aefarfasf";
  let posterId2 = pundir._id;
  let eventdate2 = "2024-10-05";
  let fields2 = ["medical"];
  let company2 = ["Barclays"];
  let category2 = ["interview"];
  let socialPost2 = await spost.addPost(
    title2,
    body2,
    posterId2,
    eventdate2,
    fields2,
    company2,
    category2
  );
  let s2_id = socialPost2._id.toString();
  await spost.addComments(
    s1_id,
    pundir._id,
    "Hope we all can get good grades."
  );
  await spost.addLikes(s2_id, ming._id);

  let title11 = "aefarfasf";
  let body11 = "aefarfasf";
  let posterId11 = ruobing._id;
  let duedate11 = "2024-10-05";
  let fields11 = ["medical"];
  let companyName11 = "adobe";
  let companyEmail11 = "dsg@g.com";

  let jobTitle11 = "sdffsdsf";
  let salary11 = 20000;
  let level11 = "senior";
  let jobType11 = ["online"];
  let skills11 = ["react"];
  let location11 = ["AZ"];
  let description11 = "asdfadjgkgskdfgkjsdgfkjsdgfjksdgfjksdgfksgdfksgd";
  let re11 = await refer.addPost(
    title11,
    body11,
    posterId11,
    duedate11,
    fields11,
    companyName11,
    companyEmail11,
    jobTitle11,
    salary11,
    level11,
    jobType11,
    skills11,
    location11,
    description11
  );
  let r1_id = re11._id.toString();
  let title22 = "aefarfasf";
  let body22 = "aefarfasf";
  let posterId22 = pundir._id;
  let duedate22 = "2024-10-05";
  let fields22 = ["engineering"];
  let companyName22 = "google";
  let companyEmail22 = "dsg@g.com";

  let jobTitle22 = "sdffsdsf";
  let salary22 = 20000;
  let level22 = "senior";
  let jobType22 = ["online"];
  let skills22 = ["javascript"];
  let location22 = ["AZ"];
  let description22 = "asdfadkshflsghdfjksgdkfgskjdgfjskdgfjksdgfkjsdgfjks";
  let re22 = await refer.addPost(
    title22,
    body22,
    posterId22,
    duedate22,
    fields22,
    companyName22,
    companyEmail22,
    jobTitle22,
    salary22,
    level22,
    jobType22,
    skills22,
    location22,
    description22
  );
  let r2_id = re22._id.toString();
  await refer.addComments(
    r1_id,
    pundir._id,
    "Hope we all can get good grades."
  );
  await refer.addLikes(r2_id, ming._id);



};
