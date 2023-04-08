import { network } from './config/mongoCollections.js';
import { dbConnection, closeConnection } from './config/mongoConnection.js';
import usersData from './data/user.js';
import networkData from './data/network.js';

const db = await dbConnection();
await db.dropDatabase();

// user error testing 

// [] define js file in data
// {} define as each functionality
// Valid date would be DD/MM/YYYY

/* ------[ USER ]------*/
/* ---- {creating users} ---- */
console.log("\n!!!!Creating User!!!!")
try // no value in the create function
{
    const patrick = await usersData.createUser();
} catch(error)
{
    console.log(error)
}
try // provide wrong type of first name
{
    const patrick = await usersData.createUser(12312);
} catch(error)
{
    console.log(error)
}
try // provide wrong type of last name
{
    const patrick = await usersData.createUser("Patrick", 12312);
} catch(error)
{
    console.log(error)
}
try // provide empty spaces of last name
{
    const patrick = await usersData.createUser("Patrick", "    ");
} catch(error)
{
    console.log(error)
}
try // provide a number string to last name
{
    const patrick = await usersData.createUser("Patrick", "123");
} catch(error)
{
    console.log(error)
}
try // age is less than 18
{
    const patrick = await usersData.createUser("Patrick", "Hill", 17);
} catch(error)
{
    console.log(error)
}
try // age is greater than 100
{
    const patrick = await usersData.createUser("Patrick", "Hill", 102);
} catch(error)
{
    console.log(error)
}
try // not a number of age
{
    const patrick = await usersData.createUser("Patrick", "Hill", NaN);
} catch(error)
{
    console.log(error)
}
try // not a number of age
{
    const patrick = await usersData.createUser('Patrick', 'Hill', 25, "@gmail.com", "afscf");
} catch(error)
{
    console.log(error)
}
try // email vaild
{
    const patrick = await usersData.createUser('Patrick', 'Hill', 25, "123..def@gmail.com", "afscf");
} catch(error)
{
    console.log(error)
}
try // email vaild
{
    const patrick = await usersData.createUser('Patrick', 'Hill', 25, "     ", "afscf");
} catch(error)
{
    console.log(error)
}
try // email vaild
{
    const patrick = await usersData.createUser('Patrick', 'Hill', 25, "  .abc@mail.com  ", "afscf");
} catch(error)
{
    console.log(error)
}
try // correct one
{
    const patrick = await usersData.createUser('Patrick', 'Hill', 25, "adcacdqwe@gmail.com", "afscf");
    const pid = patrick._id.toString();
    console.log(await usersData.getUserById(pid));
} catch(error)
{
    console.log(error)
}

/* ---- {get all users} ----*/
console.log("\n!!!!Get All Users!!!!");
try
{
    console.log("\nGet all users!")
    console.log(await usersData.getAllUser());
} catch(error)
{
    console.log(error)
}

/* ---- {get user by id} ----*/
console.log("\n!!!!Get User By ID!!!!");
// not a valid id
try
{
    console.log(await usersData.getUserById("safweafcaadfs"));
} catch(error)
{
    console.log(error);
}

try
{
    console.log(await usersData.getUserById("123141314111"));
} catch(error)
{
    console.log(error);
}
//correct one
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString()
    console.log(await usersData.getUserById(pid));
} catch(error)
{
    console.log(error);
}


/* ---- {update user} ----*/
console.log("\n!!!!Update User By ID!!!!");

// give empty space in fname
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "      ",
        lname: "Lu",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 29,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
// give empty space in lname and trim fname
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "  Tzu-Ming  ",
        lname: "    ",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 29,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
// invalid email address
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "  Tzu-Ming  ",
        lname: " Lu ",
        email: "stevens.edu",
        password: "23casferw3r23r",
        age: 29,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
// invalid email address
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "  Tzu-Ming  ",
        lname: " Lu ",
        email: "@stevens.edu",
        password: "23casferw3r23r",
        age: 29,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
// invalid age < 18
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "  Tzu-Ming  ",
        lname: " Lu ",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 3,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
// invalid age > 100
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "  Tzu-Ming  ",
        lname: " Lu ",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 103,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
// invalid gender
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "  Tzu-Ming  ",
        lname: " Lu ",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 28,
        gender: "  M  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
// invalid gender in number
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "  Tzu-Ming  ",
        lname: " Lu ",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 28,
        gender: 22,
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
// invalid State
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "  Tzu-Ming  ",
        lname: " Lu ",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 28,
        gender: "  Male  ",
        locationState: "WW",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
// invalid university with empty spaces
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "  Tzu-Ming  ",
        lname: " Lu ",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 28,
        gender: "  Male  ",
        locationState: "Nj",
        university: "    ",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
// invalid major with empty spaces
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "  Tzu-Ming  ",
        lname: " Lu ",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 28,
        gender: "  Male  ",
        locationState: "Nj",
        university: "SIT",
        collegeMajor: "   ",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
// invalid interest area with empty spaces
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "  Tzu-Ming  ",
        lname: " Lu ",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 28,
        gender: "  Male  ",
        locationState: "Nj",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["   "],
        experience: 0,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
// invalid interest area with numbers
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "  Tzu-Ming  ",
        lname: " Lu ",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 28,
        gender: "  Male  ",
        locationState: "Nj",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: [123],
        experience: 0,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
// invalid experience < 0
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "Tzu-Ming",
        lname: "Lu",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 29,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: -5,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
// invalid experience > 80
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "Tzu-Ming",
        lname: "Lu",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 29,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 100,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
//invalid seeking job empty spaces
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "Tzu-Ming",
        lname: "Lu",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 29,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: ["    "],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
//invalid seeking job in number type
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "Tzu-Ming",
        lname: "Lu",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 29,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: [123123],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
//invalid connections with empty spaces
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "Tzu-Ming",
        lname: "Lu",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 29,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: [],
        connections: ["     "],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
//invalid connections with invalid object id
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "Tzu-Ming",
        lname: "Lu",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 29,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: [],
        connections: ["234vsw3rcaerdfa"],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
//invalid group with invalid object id
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "Tzu-Ming",
        lname: "Lu",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 29,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: [],
        connections: [],
        group: ["FDDSfercwrwqrc"],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-US"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
//invalid created date
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "Tzu-Ming",
        lname: "Lu",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 29,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: [],
        connections: [],
        group: [],
        createdAt: "03/32/2033",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
//invalid created date
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "Tzu-Ming",
        lname: "Lu",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 29,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: [],
        connections: [],
        group: [],
        createdAt: "32/12/2033",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
//invalid updated date
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "Tzu-Ming",
        lname: "Lu",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 29,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: [],
        connections: [],
        group: [],
        createdAt: new Date().toLocaleDateString("en-GB"),
        updatedAt: "02/29/2001",
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}
//correct one
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();
    const patrick = await usersData.getUserById(pid)
    const updateData = {
        fname: "Tzu-Ming",
        lname: "Lu",
        email: "tlu14@stevens.edu",
        password: "23casferw3r23r",
        age: 29,
        gender: "  MaLE  ",
        locationState: "NJ",
        university: "SIT",
        collegeMajor: "Computer Science",
        interestArea: ["Machine Learning"],
        experience: 0,
        seekingJob: ["Software Engineer"],
        connections: [],
        group: [],
        createdAt: patrick.createdAt,
        updatedAt: new Date().toLocaleDateString("en-GB"),
    }
    console.log(await usersData.updateUsers(pid, updateData));
} catch(error)
{
    console.log(error);
}

/* ---- {remove user} ----*/
console.log("\n!!!!Remove User By ID!!!!")
try
{
    const pid = (await usersData.getAllUser())[0]._id.toString();

    console.log(await usersData.removeUser(pid));
} catch(error)
{
    console.log(error);
}


/* ------[ NETWORK ]------*/
/* ----- create posts ----- */

console.log("\n Network Function");
console.log("!!!Create Post!!!");
// create the first user
const patrick = await usersData.createUser('Patrick', 'Hill', 25, "adcacdqwe@gmail.com", "afscf");
const pid = patrick._id.toString();

// create the second user
const daniel = await usersData.createUser('Daniel', 'Lu', 23, "qweqwe2@yahoo.com", "1exa3rscdwr");
const did = daniel._id.toString();


// create the first Post 
const firstPost = await networkData.addPost(pid, "This is the first post");
const firstPostId = firstPost._id.toString()
console.log(firstPost);
console.log(firstPostId);

// create the second Post 
const secondPost = await networkData.addPost(pid, "This is the second post");
const secondPostId = secondPost._id.toString()
console.log(secondPost);
console.log(secondPostId);

// user Daniel leave comments to the first post
const firstPostFirstComments = await networkData.addComments(firstPostId, did, "Daniel's first message");
console.log(firstPostFirstComments);

// user Daniel leave comments to the second post
const firstPostSecondComments = await networkData.addComments(firstPostId, did, "Daniel's second message");
console.log(firstPostSecondComments);

// post user Patrick leave his first comments to the first post
const firstPostFirstCommentsByAuthor = await networkData.addComments(firstPostId, pid, "Patrick's first message");
console.log(firstPostFirstCommentsByAuthor);

// user Daniel likes in the first post
const firstPostFirstlikes = await networkData.addLikes(firstPostId, did);
console.log(firstPostFirstlikes);

// user Daniel likes twice in the first post (Error checking)
try
{
    const firstPostSecondlikes = await networkData.addLikes(firstPostId, did);
    console.log(firstPostSecondlikes);
} catch(error)
{
    console.log(error);
}

// user Patrick likes in the first post
const firstPostSecondlikes = await networkData.addLikes(firstPostId, pid);
console.log(firstPostSecondlikes);

// Update post
const updateFirstPost = await networkData.updatePost(firstPostId, "This is modified of the first post!");
console.log(updateFirstPost);

// Get All Comments By User Id 
const userComments = await networkData.getCommentsByUserId(did);
console.log(userComments)

console.log('Done seeding database');
await closeConnection();