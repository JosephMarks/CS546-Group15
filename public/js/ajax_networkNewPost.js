(function($)
{
    // Let's start writing AJAX calls!

    //Let's get references to our form elements and the div where the todo's will go
    let createPost = $('#network-post-create'),
        contentInput = $('#post'),
        url = window.location.href;
    console.log(url)
    //new todo form submission event
    createPost.submit(function(event)
    {
        event.preventDefault();
        let content = contentInput.val();
        if(content)
        {

            $.ajax({
                url: url,
                method: "POST",
                contentType: 'application/json',
                data: JSON.stringify({
                    post: content,
                }),
                success: function(response)
                {
                    let path = url.replace(/\/(new)(\W+|\w+|\s+|\S+)/gi, "")
                    window.location.href = path;
                }
            })
        }
    });
})(window.jQuery);
