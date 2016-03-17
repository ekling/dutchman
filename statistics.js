$( document ).ready(function() {
    var statistics_api_string = purchases_get_all_string();
    $.getJSON(statistics_api_string, function( json ) {
        var payload = json["payload"];
        var $table = $(
            "<table />"+
            "<tr><th data-text='username'></th>"+
            "<tr><th data-text='username'></th>"+
            "<tr><th data-text='name'></th>"+
            "<tr><th data-text='first_name'></th>"+
            "<tr><th data-text='last_name'></th>"+
            "<tr><th data-text='username'></th>"+
            "<tr><th data-text='price'></th>"
            );

        console.log(payload)

        $.each(payload, function(key, value) {
            var data = value;
            var namn = "<td>"+data["namn"]+"</td>";
            var namn2 = "<td>"+data["namn2"]+"</td>";
            var timestamp = "<td>"+data["timestamp"]+"</td>";
            var first_name = "<td>"+data["first_name"]+"</td>";
            var last_name = "<td>"+data["last_name"]+"</td>";
            var username = "<td>"+data["username"]+"</td>";
            var price = "<td>"+data["price"]+"</td>";
            $table.append("<tr>"+timestamp+namn+namn2+price+first_name+
                last_name+username+"</tr>");
        });
        
        $table.append("</table>");
        $("#statistics").html($table);

    });
});