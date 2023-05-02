import spost from "./data/socialPost.js";
let title = "aefarfasf";
let body = "aefarfasf";
let posterId = "645067eafa064853b77b6bc4";
let eventdate = "aefarfasf";
let fields = ["medical"];
let company = ["google"];
let category = ["others"];

await spost.addPost(
  title,
  body,
  posterId,
  eventdate,
  fields,
  company,
  category
);
let res = await spost.getPostsByFieldsTag(["front-end"]);
console.log(res);
let re = await spost.addLikes(
  "6450640b7c228257f5f29144",
  "645067eafa064853b77b6bc4"
);
// console.log(re);
