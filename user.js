/**
  * View to display the systems users.
  */
$( document ).ready(function() {
    // Fetches users from api
    var user_api_string = iou_get_all_string();
    $.getJSON(user_api_string, function( json ) {
        var payload = json["payload"];
        var $table = $("<table />");

        // Populates table with users
        $.each(payload, function(key, value) {
            var data = value;
            var username = "<td class='username'>"+data["username"]+"</td>";
            var first_name = "<td class='first_name'>"+data["first_name"]+"</td>";
            var last_name = "<td class='last_name'>"+data["last_name"]+"</td>";
            var assets = "<td>"+data["assets"]+"</td>";
            var edit = "<td class='edit'></td>";
            $table.append("<tr>"+username+first_name+last_name+assets+edit+"</tr>");
        });

        $table.append("</table>");
        $("#users").html($table);

        // Open form to edit user information
        $(".edit").on('click', function() {
            var $item = $(this).closest("tr");
            var $username = $item.find(".username").text();
            var $first_name = $item.find(".first_name").text();
            var $last_name = $item.find(".last_name").text();
            $("#dialog").dialog({modal: true, height: 300, width: 300 });

            // Closes form and makes call to API to update new user information.
            $("#submitUser").on('click', function() {
              var $newUsername = $('#newUsername').val().toLowerCase();
              var $newPassword = $('#newPassword').val().toLowerCase();
              var $email = $('#newEmail').val().toLowerCase();
              var $phoneNr = $('#newPhoneNr').val().toLowerCase();

              if ($newUsername != "" && $newPassword != "" && $email != "" && $phoneNr != "") {
                $.getJSON('http://pub.jamaica-inn.net/fpdb/api.php?username=' + user + '&password=' + user + '&action=user_edit&new_username=' + $newUsername + '&new_password=' + $newPassword + '&first_name=' + $first_name + '&last_name=' + $last_name + '&email=' + $email + '&phone=' + $phoneNr, function (){
                });
                $(this).closest('.ui-dialog-content').dialog('close');
                $('#newUsername').val("");
                $('#newPassword').val("");
                $('#newEmail').val("");
                $('#newPhoneNr').val("");
              }
            });

            $("#closeUser").on('click', function() {
              $(this).closest('.ui-dialog-content').dialog('close');
            });
        });
    });



});
