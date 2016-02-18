var items = [];
var cart = [];
var cartCount = 0;

$(document).ready(function(){
  $.getJSON('http://pub.jamaica-inn.net/fpdb/api.php?username=svetor&password=svetor&action=inventory_get',function(data){
    items = data.payload;
    $.each(items, function(i, item){
      if (item.namn != "") {
        var beerList = $('#beerList');
        var beer = $('<div class="beerItem" draggable="true" ondragstart="drag(event)" id="' + item.beer_id + '"></div>');
        var beerName = $('<div class="beerName">' + item.namn + '</div>');
        var beerPubPrice = $('<div class="beerPubPrice">£' + item.pub_price + '</div>');

        beer.append(beerName);
        beer.append(beerPubPrice);
        beerList.append(beer);
      }
    });
  });
});

function allowDrop(e) {
  e.preventDefault();
}

function drag(e) {
  e.dataTransfer.setData("text", e.target.id);
}

/**
 * Adds an item to cart when drag and dropped
 */
function drop(e) {
  e.preventDefault();
  var id = e.dataTransfer.getData("text");

  for (var i = 0; i < items.length; i++){
    if(id == items[i].beer_id && cartCount < 5) {
      addToCart(items[i]);
      cartCount++;
      break;
    }
  }
}

/**
  * Remove beer from cart
  */
function beerRemove(e) {
  var id = e.target.id;

  if (inCart(id)) {
    updateCart(false, id);
    cartCount--;
  }
};

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
 *  Update quantity of item with ID id in cart
 *  +1 if increase = true, else -1
 */
function updateCart(increase, id) {
  var obj = null;
  var index = -1;
  for (var i = 0; i < cart.length; i++) {
    if (id == cart[i].item.beer_id) {
      obj = cart[i];
      index = i;
    }
  }

  if (increase){
    obj.count++;
  } else {
    obj.count--;
    if (obj.count < 1){
      cart.splice(index, 1);
      $('#cartObj' + obj.item.beer_id).remove();
    }
  }

  $('#cart' + id).html('X' + obj.count);
}

/**
 *  Update an item in the cart if the item is in cart,
 *  else creates new item and adds to cart.
 */

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
    var cartObj = $('<div class="cartObj" id="cartObj' + cartItem.item.beer_id + '"></div>');
    var beer = $('<div class="beerCartItem" id="' + cartItem.item.beer_id + '"></div>');
    var beerName = $('<div class="beerName">' + cartItem.item.namn + '</div>');
    var beerPubPrice = $('<div class="beerPubPrice">£' + cartItem.item.pub_price + '</div>');
    var beerCount = $('<div class="beerCount" id="cart' + cartItem.item.beer_id + '">X' + cartItem.count + '</div>');
    var beerRemove = $('<div id="' + cartItem.item.beer_id + '" class="beerRemove" onclick="beerRemove(event)">-</div>');

    beer.append(beerName);
    beer.append(beerPubPrice);
    cartObj.append(beer);
    cartObj.append(beerCount);
    cartObj.append(beerRemove);
    cartList.append(cartObj);
  }
}
