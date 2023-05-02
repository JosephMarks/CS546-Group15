(function($)
{
    // Attach a click handler to the "like" button
    $("#like-button").click(function()
    {
        // Disable the button to prevent multiple clicks
        $(this).prop("disabled", true);
        let url = window.location.href;
        let userId = url.replace(/http:\/\/localhost:3000\/network\/post\//gi, "");
        userId = userId.slice(0, 24);
        let postId = url.replace(/http:\/\/localhost:3000\/network\/post\/\w{24}\/followerId\/\w{24}\/postId\//gi, "");
        let followerId = url.replace(/http:\/\/localhost:3000\/network\/post\/\w{24}\/followerId\//gi, "")
        followerId = followerId.slice(0, 24);

        $.ajax({
            url: "/network/like",
            type: "POST",
            dataType: "json",
            data: JSON.stringify({ userId: userId, followerId: followerId, postId: postId }),
            contentType: "application/json",
            success: function(data)
            {
                $("#like-button").text("Liked!");
            },
            error: function(xhr, status, error)
            {
                $("#like-button").prop("disabled", false);
                alert("Error: " + error);
            }
        });
    });
})(window.jQuery);