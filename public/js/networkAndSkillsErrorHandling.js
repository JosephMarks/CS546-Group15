const validation = {
  checkString (strVal, varName)
  {
    if(!strVal) throw `Error: You must supply a ${varName}!`;
    strVal = strVal.toString();
    if(typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if(strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if(!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },
  checkInt (strVal, varName)
  {
    if(!strVal) throw `Error: You must supply a ${varName} number.`;
    strVal = Number(strVal)
    if(isNaN(strVal)) throw `Error: ${varName} can not be NaN`;
    if(!Number.isInteger(strVal)) throw `Error ${varName} should be a integer value`;
    return;
  },
  checkCheckBox (strVal, varName)
  {
    let checked = [];

    for(var i = 0; i < strVal.length; i++)
    {
      let checkbox = strVal[i];
      if(checkbox.checked) checked.push(checkbox.value);
    }

    if(checked.length < 1) throw `Error: Must select at least one ${varName}.`
    return strVal;
  },
  checkVideoUrl (strVal, varName)
  {
      if(strVal === "") return "";
      if(typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
      strVal = strVal.trim();
      const regex = /(http|https):\/\/(\w{3,}\.|\www\.)(\w{2,})(\.com|\S+)/g;
      if(!regex.test(strVal)) throw `Error: ${varName} is not a valid link!`
      if(!isNaN(strVal))
          throw `Error: ${varName} is not a valid value for video link as it only contains digits`;
      return strVal;
  },
  checkPost(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    strVal = strVal.toString();
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
  }
}

//  create new post handlebars
const postCreate = document.getElementById('network-post-create');
if(postCreate)
{
  const post = document.getElementById('post');
  const errorDiv = document.getElementById('error');
  postCreate.addEventListener('submit', (event) =>
  {
    try
    {
      errorDiv.innerText = "";
      let originPost = post.value;
      originPost = validation.checkPost(originPost, "Content");
    } catch(error)
    {
      errorDiv.innerText = error;
      event.preventDefault();
    }
  });
}

//  create your post comments handlebars
const yourPostComments = document.getElementById('network-post-your-commit');
if(yourPostComments)
{
  const comments = document.getElementById('network-comments');
  const errorDiv = document.getElementById('error');
  yourPostComments.addEventListener('submit', (event) =>
  {
    try
    {
      errorDiv.innerText = "";
      let originComments = comments.value;
      originComments = validation.checkPost(originComments, "Comments");
    } catch(error)
    {
      errorDiv.innerText = error;
      event.preventDefault();
    }
  });
}


//  edit your post handlebars
const networkPostEdit = document.getElementById('network-post-edit');
if(networkPostEdit)
{
  const content = document.getElementById('content');
  const errorDiv = document.getElementById('error');
  networkPostEdit.addEventListener('submit', (event) =>
  {
    try
    {
      errorDiv.innerText = "";
      let originContent = content.value;
      originContent = validation.checkPost(originContent, "Post content");
    } catch(error)
    {
      event.preventDefault();
      errorDiv.innerText = error;
    }
  });
}

// Api search
const apiForm = document.getElementById("api-search");
if(apiForm)
{
  let job_title = document.getElementById("job_title");
  let location = document.getElementById("location");
  let page = document.getElementById("page");
  let date_post = document.getElementById("date_post");
  let employment_types = document.getElementById("employment_types");
  let job_requirements = document.getElementById("job_requirements");
  let remote_jobs_only = document.getElementById("remote_jobs_only");
  let errorDiv = document.getElementById('error');

  apiForm.addEventListener('submit', (event) =>
  {
    try
    {
      errorDiv.innerText = "";
      let originJobTitle = job_title.value;
      let originLoctaion = location.value;
      let originPage = page.value;
      let originDate = date_post.value;
      let originEmployType = employment_types.value;
      let originJobRequirement = job_requirements.value;
      let originRemote = remote_jobs_only.value;
      originRemote = validation.checkString(originRemote, "Remote");
      originJobRequirement = validation.checkString(originJobRequirement, "Job Requirement");
      originEmployType = validation.checkString(originEmployType, "Employment Type");
      originDate = validation.checkString(originDate, "Post date");
      originPage = validation.checkInt(originPage, "Page");
      originLoctaion = validation.checkString(originLoctaion, "Location");
      originJobTitle = validation.checkString(originJobTitle, "Job title");
    } catch(error)
    {
      errorDiv.innerText = error;
      event.preventDefault();
    }
  })
}

// create new post in skill post
const skillsNewPostForm = document.getElementById("skills-new-post-form");
if(skillsNewPostForm)
{
  let post_title = document.getElementById("skills-new-post-title");
  let post_body = document.getElementById("post-body");
  let checkboxes = document.querySelectorAll("input[type=checkbox]");
  let post_link = document.getElementById("skills-new-post-link");
  const errorDiv = document.getElementById('error');

  skillsNewPostForm.addEventListener('submit', (event) =>
  {
    try
    {
      errorDiv.innerText = "";
      let originPostTitle = post_title.value;
      let originPostBody = post_body.value;
      let originLink = post_link.value;
      originPostTitle = validation.checkString(originPostTitle, "Title");
      originPostBody = validation.checkString(originPostBody, "Content");
      checkboxes = validation.checkCheckBox(checkboxes, "Interest area");
      originLink = validation.checkVideoUrl(originLink, "Link address");
    } catch(error)
    {
      errorDiv.innerText = error;
      event.preventDefault();
    }
  })
}