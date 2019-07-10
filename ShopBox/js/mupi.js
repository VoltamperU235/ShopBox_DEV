$(this).mousemove(function (e) {
    location.replace("/index.html")

});
$(this).keypress(function (e) {
    location.replace("/index.html")

});

function ui()
{
    setTimeout("ui()",500);
$.ajax(
    {
        cache: false,
        type: "GET",
        url: '/node/status',
        dataType: 'json',
        success: function (data) {
            if (data == 1) {
                location.replace("/index.html")
            }

        }
    })}

    ui();