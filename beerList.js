var items = [];
var cart = [];

$(document).ready(function(){
  $.getJSON('http://pub.jamaica-inn.net/fpdb/api.php?username=svetor&password=svetor&action=inventory_get',function(data){
    items = data.payload;
    $.each(items, function(i, item){
      if (item.namn != "") {
        var beerList = $('#beerList');
        var beer = $('<div class="beerItem" draggable="true" ondragstart="drag(event)" id="' + item.beer_id + '"></div>');
        var beerName = $('<div class="beerName"><p>' + item.namn + '</p></div>');
        var beerPubPrice = $('<div class="beerPubPrice"><p>£' + item.pub_price + '</p></div>');

        beer.append(beerName);
        beer.append(beerPubPrice);
        beerList.append(beer);
      }
    });
  });
});

function appendItemToDiv(div, item, count) {
    if(count != null) {
      var beerCount = $('<div class="beerCount"><p>X' + item.count + '</p></div>');
      beer.append(beerCount);
    }
}

function allowDrop(e) {
  e.preventDefault();
}

function drag(e) {
  e.dataTransfer.setData("text", e.target.id);
}

function drop(e) {
  e.preventDefault();
  var id = e.dataTransfer.getData("text");

  for (var i = 0; i < items.length; i++){
    if(id == items[i].beer_id) {
      addToCart(items[i]);
      break;
    }
  }
}

/**
 *  Return true if beer with ID id is in cart
 */
function inCart(id) {
  for (var i = 0; i < cart.length; i++) {
    if (id == cart[i].item.beer_id) {
      return true;
    }
  }
  return false;
}

/**
 *  Update quantity of an item in cart
 */
function updateCart(increase, id) {
  var obj = null;
  for (var i = 0; i < cart.length; i++) {
    if (id = cart[i].item.beer_id) {
      obj = cart[i];
    }
  }

  if (increase){
    obj.count++;
    $('.beerCount').hide().fadeIn('fast');
  } else {
    obj.count--;
  }
}

function addToCart(item) {
  if (inCart(item.beer_id)) {
    updateCart(true, item.beer_id);
  } else {
    var cartItem = {
      count: 1,
      item: item
    };
    cart.push(cartItem);

    var cartList = $('#cart');
    var beer = $('<div class="beerItem" id="' + cartItem.item.beer_id + '"></div>');
    var beerName = $('<div class="beerName"><p>' + cartItem.item.namn + '</p></div>');
    var beerPubPrice = $('<div class="beerPubPrice"><p>£' + cartItem.item.pub_price + '</p></div>');
    var beerCount = $('<div class="beerCount"><p>X' + cartItem.count + '</p></div>');

    beer.append(beerName);
    beer.append(beerPubPrice);
    cartList.append(beer);
    cartList.append(beerCount);

  }
}
