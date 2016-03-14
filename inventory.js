var user = sessionStorage.getItem("login");

$(document).ready(function(){
  $.getJSON('http://pub.jamaica-inn.net/fpdb/api.php?username=svetor&password=svetor&action=inventory_get',function(inventory){
    items = inventory.payload;
    $.each(items, function(i, item){
      if (item.namn != "") {
        var $inventory = $('#inventory');
        var $beer = $('<div class="invBeerItem" id="' + item.beer_id + '"></div>');
        var $beerName = $('<div class="invBeerName">' + item.namn + '</div>');
        var $beerSblPrice = $('<div class="invBeerSblPrice">Sbl Price: ' + item.sbl_price + '</div>');
        var $beerPubPrice = $('<div class="invBeerPubPrice">Pub Price: ' + item.pub_price + '</div>');
        var $priceWrapper = $('<div class="invPriceWrapper"></div>');
        var $beerPriceText = $('<div class="invPriceText">Price: </div>');
        var $beerPrice = $('<div class="invBeerPrice" id="price' + item.beer_id + '">' + item.price + '</div>');
        var $countWrapper = $('<div class="invCountWrapper"></div>');
        var $beerCountText = $('<div class="invCountText">Count:</div>')
        var $beerCount = $('<div class="invBeerCount" id="count' + item.beer_id + '">' + item.count + '</div>');
        var $editWrapper = $('<div class="invEditWrapper" id="' + item.beer_id + '"></div>');
        var $edit = $('<div class="invEdit" id="edit' + item.beer_id + '">Edit</div>');
        var $editField = $('<div class="invEditField" id="editField' + item.beer_id + '"><input type="text" class="invInputAmount" id="inputAmount' + item.beer_id + '" placeholder="Amount"/></div>');
        var $editAccept = $('<div class="invEditAccept" id="accept' + item.beer_id + '">');
        var $editDecline = $('<div class="invEditDecline" id="decline' + item.beer_id + '">');

        $beer.append($beerName);
        $beer.append($beerSblPrice);
        $beer.append($beerPubPrice);
        $priceWrapper.append($beerPriceText);
        $priceWrapper.append($beerPrice);
        $countWrapper.append($beerCountText);
        $countWrapper.append($beerCount);
        $editWrapper.append($edit);
        $editWrapper.append($editField);
        $editWrapper.append($editAccept);
        $editWrapper.append($editDecline);
        $beer.append($priceWrapper);
        $beer.append($countWrapper);
        $beer.append($editWrapper);
        $inventory.append($beer);

        $('#editField' + item.beer_id).hide();
        $('#accept' + item.beer_id).hide();
        $('#decline' + item.beer_id).hide();

        if (item.count < 1) {
          $beer.css('background-color', 'red');
        }
        else if (item.count < 50) {
          $beer.css('background-color', 'yellow');
        }

        $edit.on('click', function(){
          var id = $(this).parent()[0].id;

          $('#editField' + id).show();
          $('#accept' + id).show();
          $('#decline' + id).show();
          $('#edit' + id).hide();
          $('#inputAmount' + id).val('');
        });

        $editDecline.on('click', function() {
          var id = $(this).parent()[0].id;

          $('#editField' + id).hide();
          $('#accept' + id).hide();
          $('#decline' + id).hide();
          $('#edit' + id).show();
        });

        $editAccept.on('click', function() {
          var id = $(this).parent()[0].id;
          var price = $('#price' + id).html();
          var amount = $('#inputAmount' + id).val();

          $('#editField' + id).hide();
          $('#accept' + id).hide();
          $('#decline' + id).hide();
          $('#edit' + id).show();

          if (amount != "") {
            $.getJSON('http://pub.jamaica-inn.net/fpdb/api.php?username=' + user + '&password=' + user + '&action=inventory_append&beer_id=' + id + '&amount=' + amount + '&price=' + price,function(inventory){
            });
          }
        });
      }
    });
  });
});
