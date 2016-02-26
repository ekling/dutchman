var items = [];
var beers = [];
var cart = [];
var cartCount = 0;

/**
*  Fetch beers and populates beer list
*/
$(document).ready(function(){
  $.getJSON('http://pub.jamaica-inn.net/fpdb/api.php?username=svetor&password=svetor&action=inventory_get',function(inventory){
    items = inventory.payload;
    $.each(items, function(i, item){
      if (item.namn != "") {
        var $beerList = $('#beerList');
        var $beer = $('<div class="beerItem" draggable="true" ondragstart="drag(event)" id="' + item.beer_id + '"></div>');
        var $beerName = $('<div class="beerName">' + item.namn + '</div>');
        var $beerPubPrice = $('<div class="beerPubPrice">£' + item.pub_price + '</div>');
        var $beerAdd = $('<div id="' + item.beer_id + '" class="beerAddList">+</div>');

        $beerAdd.on('click', function() {
          event.stopPropagation();
          for (var i = 0; i < items.length; i++) {
            if (items[i].beer_id == this.id && cartCount < 5) {
              cartCount++;
              addToCart(items[i])
              break;
            }
          }
        });

        var $beerCategory = $('<div class="beerCategory" id="category' + item.beer_id + '"></div>');
        var $beerCountry= $('<div class="beerCountry" id="country' + item.beer_id + '"></div>');
        var $beerAlc= $('<div class="beerAlc" id="alc' + item.beer_id + '"></div>');

        $beer.append($beerName);
        $beer.append($beerPubPrice);
        $beer.append($beerAdd);
        $beer.append($beerCategory);
        $beer.append($beerCountry);
        $beer.append($beerAlc);

        $beer.on('click', function(){
          if ($beer.hasClass('expanded')) {
            $beer.removeClass('expanded')
          }
          else {
            var id = this.id;
            $.getJSON('http://pub.jamaica-inn.net/fpdb/api.php?username=jorass&password=jorass&action=beer_data_get&beer_id=' + id, function(beerData) {
              $('#category' + id).html(beerData.payload[0].varugrupp);
              $('#country' + id).html(beerData.payload[0].ursprunglandnamn);
              $('#alc' + id).html(beerData.payload[0].alkoholhalt);
            });
            $beer.addClass('expanded');
          }
        });
        $beerList.append($beer);
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

function beerAdd(e) {
  if (typeof(e) == "object") {
    var id = e.target.id;
  } else {
    id = e;
  }

  if (inCart(id) && cartCount < 5) {
    updateCart(true, id)
    cartCount++;
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
    updateCartSum(true, obj.item.pub_price);
  } else {
    obj.count--;
    updateCartSum(false, obj.item.pub_price);
    if (obj.count < 1){
      cart.splice(index, 1);
      $('#cartObj' + obj.item.beer_id).remove();
    }
  }

  $('#cart' + id).html('X' + obj.count);
}

function updateCartSum(increase, amount) {
  amount = parseInt(amount);
  var sum = parseInt($('#cartSumAmount').html());
  increase ? sum = sum + amount : sum = sum - amount;
  $('#cartSumAmount').html(sum);
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
    updateCartSum(true, item.pub_price);

    var $cartList = $('#cartList');
    var $cartObj = $('<div class="cartObj" id="cartObj' + cartItem.item.beer_id + '"></div>');
    var $beer = $('<div class="beerCartItem" id="' + cartItem.item.beer_id + '"></div>');
    var $beerName = $('<div class="beerName">' + cartItem.item.namn + '</div>');
    var $beerPubPrice = $('<div class="beerPubPrice">£' + cartItem.item.pub_price + '</div>');
    var $beerCount = $('<div class="beerCount" id="cart' + cartItem.item.beer_id + '">X' + cartItem.count + '</div>');
    var $beerAddRemove = $('<div class="beerAddRemove"</div>');
    var $beerRemove = $('<div id="' + cartItem.item.beer_id + '" class="beerRemove" onclick="beerRemove(event)">-</div>');
    var $beerAdd = $('<div id="' + cartItem.item.beer_id + '" class="beerAdd" onclick="beerAdd(event)">+</div>');

    $beer.append($beerName);
    $beer.append($beerPubPrice);
    $cartObj.append($beer);
    $cartObj.append($beerCount);
    $beerAddRemove.append($beerRemove);
    $beerAddRemove.append($beerAdd);
    $cartObj.append($beerAddRemove);
    $cartList.append($cartObj);
  }
}
