import validations from "./helpers.js";
import * as collection from "./config/mongoCollections.js";
import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import usersData from "./data/user.js";
import networkData from "./data/network.js";
import skillsData from "./data/skills.js";
import { userData } from "./data/index.js";
import * as groupData from "./data/groups.js";
import * as groupEventsData from "./data/groupEvents.js";
import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import { groupActivityData, userData } from "./data/index.js";
import * as messageData from "./data/messages.js";
import * as userJobHistoryData from "./data/userJobHistory.js";
import * as groupActivityDataFunctions from "./data/groupActivity.js";
import * as groupEventData from "./data/groupEvents.js";

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
  const pundir = await usersData.createUser(
    "Pradyumn",
    "Pundir",
    20,
    "ppd@ggg.edu",
    "Test1234$",
    "Student"
  );
  const ruobing = await usersData.createUser(
    "Ruobing",
    "Liu",
    20,
    "rubinliu@ggg.edu",
    "Test1234$",
    "Student"
  );
  const ming = await usersData.createUser(
    "Tzu Ming",
    "Lu",
    20,
    "tlu14@ggg.edu",
    "Test1234$",
    "Student"
  );

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
    ming._id,
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

  await userFunctions.createUser(
    "Google ",
    "Foogle ",
    "70",
    "google@google.com",
    "123456789@ggHH",
    "Company"
  );
  await userFunctions.createUser(
    "barclays ",
    "barclays",
    "55",
    "Barclays@Barclays.com",
    "123456789@ggHH",
    "Company"
  );
  await userFunctions.createUser(
    "adobe",
    "Fodobe",
    "32",
    "adobe@adobe.com",
    "123456789@ggHH",
    "Company"
  );
  await userFunctions.createUser(
    "prudential",
    "Identical",
    "56",
    "prudential@prudential.com",
    "123456789@ggHH",
    "Company"
  );

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
  await groupData.create(
    "Fintech Software Engineers",
    "Let's get together and build cool fintech tools!",
    joe._id
  );

  await groupData.create(
    "Stevens Computer Science Alumni",
    "Let's get together and remember the great times in Professor Patrick Hill's class!",
    ruobing._id
  );

  await groupData.create(
    "Stevens Computer Engineers Club",
    "How about we have some fun!",
    pundir._id
  );

  await groupData.create(
    "Black Pink In Your Area",
    "This is a group where we can get together and celebrate Black Pink in our area! - we are all Bllinks",
    ming._id
  );
};
