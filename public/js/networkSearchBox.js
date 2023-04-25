let cards = document.querySelectorAll('.accordion-item')
let typingTimer;
let typeInterval = 0;
let searchInput = document.getElementById('searchbox');

function liveSearch ()
{
    let search_query = (document.getElementById("searchbox").value);

    //Use innerText if all contents are visible
    //Use textContent for including hidden elements
    if(search_query)
    {
        for(var i = 0; i < cards.length; i++)
        {
            if(cards[i].textContent.toLowerCase().trim()
                .includes(search_query.toLowerCase()))
            {
                cards[i].hidden = false;
            } else
            {
                cards[i].hidden = true;
            }
        }
    }
}

//A little delay

try
{
    searchInput.addEventListener('keyup', () =>
    {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(liveSearch, typeInterval);
    });
} catch(error)
{

}
