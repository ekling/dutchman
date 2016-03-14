$( document ).ready(function() {
    var user_api_string = iou_get_all_string();
    $.getJSON(user_api_string, function( json ) {
        var payload = json["payload"];
        var $table = $("<table />");

        $.each(payload, function(key, value) {
            var data = value;
            var username = "<td>"+data["username"]+"</td>";
            var first_name = "<td class='first_name'>"+data["first_name"]+"</td>";
            var last_name = "<td class='last_name'>"+data["last_name"]+"</td>";
            var assets = "<td>"+data["assets"]+"</td>";
            var edit = "<td class='edit'></td>";
            $table.append("<tr>"+username+first_name+last_name+assets+edit+"</tr>");
        });
        
        $table.append("</table>");
        $("#users").html($table);
        
        $(".edit").on('click', function() {
                var $item = $(this).closest("tr");
                var $first_name = $item.find(".first_name").text();
                var $last_name = $item.find(".last_name").text();
            });
    });

    

});
