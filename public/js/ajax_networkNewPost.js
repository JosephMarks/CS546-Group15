(function($)
{
    let createPost = $('#network-post-create'),
        contentInput = $('#post'),
        url = window.location.href;

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
