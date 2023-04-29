
const searchYour = () =>
{
    let accordion_item = document.querySelectorAll(".accordion-item");
    let accordion_button = document.querySelectorAll(".accordion-button");
    let emailAll = document.querySelectorAll(".email")
    let ageAll = document.querySelectorAll(".age")
    let genderAll = document.querySelectorAll(".gender");
    let stateAll = document.querySelectorAll(".state");
    let universityAll = document.querySelectorAll(".university");
    let majorAll = document.querySelectorAll(".major")
    let interest_areaAll = document.querySelectorAll(".interest")
    let experiecneAll = document.querySelectorAll(".experiecne")
    let joinAll = document.querySelectorAll(".join")
    let searchbox = document.getElementById("searchbox").value.toLowerCase();

    const match = (varStr, search) =>
    {
        if(varStr && varStr.indexOf(search) > -1) { return true; }
        else { return false; }
    }

    if(accordion_item)
    {
        for(let i = 0; i < accordion_item.length; i++)
        {
            let name = accordion_button[i].innerHTML.toLowerCase();
            let email = emailAll[i].innerHTML.toLowerCase();
            let age = ageAll[i].innerHTML.toLowerCase();
            let gender = genderAll[i].innerHTML.toLowerCase();
            let state = stateAll[i].innerHTML.toLowerCase();
            let university = universityAll[i].innerHTML.toLowerCase();
            let major = majorAll[i].innerHTML.toLowerCase();
            let interest = interest_areaAll[i].innerHTML.toLowerCase();
            let experience = experiecneAll[i].innerHTML.toLowerCase();
            let join = joinAll[i].innerHTML.toLowerCase();
            let result = []

            result.push(match(name, searchbox));
            result.push(match(email, searchbox));
            result.push(match(age, searchbox));
            result.push(match(gender, searchbox));
            result.push(match(state, searchbox));
            result.push(match(university, searchbox));
            result.push(match(major, searchbox));
            result.push(match(interest, searchbox));
            result.push(match(experience, searchbox));
            result.push(match(join, searchbox));

            if(result && result.indexOf(true) > -1)
            {
                accordion_item[i].style.display = "";
            } else
            {
                accordion_item[i].style.display = "none";
            }

        }
    }
}
const searchAll = () =>
{
    let accordion_item = document.querySelectorAll(".accordion-item");
    let accordion_button = document.querySelectorAll(".accordion-button");
    let universityAll = document.querySelectorAll(".university");
    let joinAll = document.querySelectorAll(".join")
    let searchbox = document.getElementById("searchbox").value.toLowerCase();

    const match = (varStr, search) =>
    {
        if(varStr && varStr.indexOf(search) > -1) { return true; }
        else { return false; }
    }

    if(accordion_item)
    {
        for(let i = 0; i < accordion_item.length; i++)
        {
            let name = accordion_button[i].innerHTML.toLowerCase();
            let university = universityAll[i].innerHTML.toLowerCase();
            let join = joinAll[i].innerHTML.toLowerCase();
            let result = []

            result.push(match(name, searchbox));
            result.push(match(university, searchbox));
            result.push(match(join, searchbox));

            if(result && result.indexOf(true) > -1)
            {
                accordion_item[i].style.display = "";
            } else
            {
                accordion_item[i].style.display = "none";
            }
        }
    }
}
const searchTag = () =>
{
    let col = document.querySelectorAll(".col");
    let searchbox = document.getElementById("searchbox").value.toLowerCase();

    if(col)
    {
        for(let i = 0; i < col.length; i++)
        {
            let tags = col[i].querySelectorAll(".tag");
            for(let j = 0; j < tags.length; j++)
            {
                let tag = (tags[j].innerHTML.toLowerCase());
                tag.replace("#", "");
                if(tag.indexOf(searchbox) > -1)
                {
                    col[i].style.display = "";
                    break
                } else
                {
                    col[i].style.display = "none";
                }
            }

        }
    }
}