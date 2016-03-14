$( document ).ready(function() {
    var user_api_string = iou_get_all_string();
    $.getJSON(user_api_string, function( json ) {
        var payload = json["payload"];
        var $table = $("<table />");

        $.each(payload, function(key, value) {
            var data = value;
            var username = "<td>"+data["username"]+"</td>";
            var first_name = "<td>"+data["first_name"]+"</td>";
            var last_name = "<td>"+data["last_name"]+"</td>";
            var first_name = "<td>"+data["first_name"]+"</td>";
            var assets = "<td>"+data["assets"]+"</td>";
            var edit = "<td id='edit' onclick=''></td>";
            $table.append("<tr>"+username+first_name+last_name+assets+edit+"</tr>");
        });
        
        $table.append("</table>");
        $("#users").html($table);

    });
});
