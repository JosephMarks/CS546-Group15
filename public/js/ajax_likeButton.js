(function($)
{
    
    let url = window.location.href;
    let userId = url.replace(/http:\/\/localhost:3000\/network\/post\//gi, "");
    userId = userId.slice(0, 24);
    let postId = url.replace(/http:\/\/localhost:3000\/network\/post\/\w{24}\/followerId\/\w{24}\/postId\//gi, "");
    let followerId = url.replace(/http:\/\/localhost:3000\/network\/post\/\w{24}\/followerId\//gi, "")
    followerId = followerId.slice(0, 24);

    $("#like-button").click(function(event)
    {
        event.preventDefault()
        $.ajax({
            url: "/network/like",
            type: "POST",
            dataType: "json",
            data: JSON.stringify({ userId: userId, followerId: followerId, postId: postId }),
            contentType: "application/json",
            success: window.location.reload()
        });
        // event.preventDefault()
    });
})(window.jQuery);