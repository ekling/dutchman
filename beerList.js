var items = [];
var beers = [];
var cart = [];
var undo = []
var redo = []
var cartCount = 0;
var user = sessionStorage.getItem("login");

$(document).ready(function(){
  /**
  *  Fetch beers and populates beer list
  */
  updateCredit();
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
          var item = getItemById(this.id);
          if (item != null && cartCount < 5) {
            cartCount++;
            addToCart(item)
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
  /**
    * Search function for beer list
    */
  $('#searchBeer').on('keyup', function(){
    var searchStr = $(this).val().toLowerCase();
    $(".beerName").each(function(){
      var str = $(this).html().toLowerCase();
      str.indexOf(searchStr) !== -1 ? $(this).parent().show() : $(this).parent().hide();
    });
  });

  $('#orderButton').on('click', function(){
    if (cartCount) {
      for (i = 0; i < cart.length; i++) {
        for (j = 0; j < cart[i].count; j++) {
          $.getJSON('http://pub.jamaica-inn.net/fpdb/api.php?username=' + user + '&password=' + user + '&action=purchases_append&beer_id' + cart[i].item.beer_id, function (){
          });
        }
      }

      $.getJSON('http://pub.jamaica-inn.net/fpdb/api.php?username=' + user + '&password=' + user + '&action=payments_append&amount' + $('#cartSumAmount').html(), function (){
      });

      $('#cartList').empty();
      cart = [];
      undo = [];
      redo = [];
      cartCount = 0;
      updateCredit();
      $('#cartSumAmount').html(0);
      $('#cartUndo').css('opacity', 0.5);
      $('#cartUndo').css('cursor', 'default');
      $('#cartRedo').css('opacity', 0.5);
      $('#cartRedo').css('cursor', 'default');
      orderButtonStatus(0);
    }
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
  var item = getItemById(id);

  if(item != null && cartCount < 5) {
    addToCart(item);
    cartCount++;
  }
}

/**
  * Return the item with matching id in items. If no element is found null is returned
  */
function getItemById(id){
  for (var i = 0; i < items.length; i++) {
    if (id == items[i].beer_id) {
      return items[i];
    }
  }
  return null;
}

/**
  * Return id from event or int
  */
function getId(e) {
  if (typeof(e) == "object") {
    return e.target.id;
  }
  else {
    return e;
  }
}

/**
  * Remove beer from cart
  */
function beerRemove(e) {
  var id = getId(e);

  if (inCart(id)) {
    updateCart(false, id);
    cartCount--;
    var action = {
      action: 'remove',
      id: id
    };
    if (cartCount == 0) {
      orderButtonStatus(0);
    }
    undo.push(action);
  }
};

/**
  * Add beer to cart
  */
function beerAdd(e) {
  var id = getId(e);

  if (inCart(id) && cartCount < 5) {
    updateCart(true, id)
    cartCount++;
    var action = {
      action: 'add',
      id: id
    };
    undo.push(action);
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

function updateCredit() {
  $.getJSON('http://pub.jamaica-inn.net/fpdb/api.php?username=' + user + '&password=' + user + '&action=iou_get',function(inventory){
    console.log(inventory.payload[0].assets);
    $("#userCreditAmount").html(inventory.payload[0].assets);
  });
}

function orderButtonStatus(status) {
  if (status) {
    $('#orderButton').css('opacity', 1);
    $('#orderButton').css('cursor', 'pointer');
  }
  else {
    $('#orderButton').css('opacity', 0.5);
    $('#orderButton').css('cursor', 'default');
  }
}

/**
  *  Update an item in the cart if the item is in cart,
  *  else creates new item and adds to cart.
  */

function addToCart(item) {
  if (inCart(item.beer_id)) {
    updateCart(true, item.beer_id);
  }
  else {
    var cartItem = {
      count: 1,
      item: item
    };
    cart.push(cartItem);
    orderButtonStatus(1);
    $('#cartUndo').css('opacity', 1);
    $('#cartUndo').css('cursor', 'pointer')
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
    $beerAddRemove.append($beerAdd);
    $beerAddRemove.append($beerRemove);
    $cartObj.append($beerAddRemove);
    $cartList.append($cartObj);
  }
  var action = {
    action: 'add',
    id: item.beer_id
  };
  undo.push(action);
}

$("#cartUndo").click(function() {
  if (undo.length > 0) {
    var action = undo.splice(-1,1);
    if (action[0].action == 'remove' && cartCount < 5) {
      addToCart(getItemById(action[0].id));
      cartCount++;
      redo.push(action[0]);
      undo.pop();
    }
    else {
      beerRemove(action[0].id);
      redo.push(action[0]);
      undo.pop();
    }
    $('#cartRedo').css('opacity', 1);
    $('#cartRedo').css('cursor', 'pointer')
  }
  if (undo.length == 0) {
    $(this).css('opacity', 0.5);
    $(this).css('cursor', 'default')
  }
});

$("#cartRedo").click(function() {
  if (redo.length > 0 && cartCount < 5) {
    var action = redo.splice(-1,1);
    if (action[0].action == 'add' && cartCount < 5) {
      cartCount++;
      addToCart(getItemById(action[0].id));
    }
    else {
      beerRemove(action[0].id);
    }
  }
  if (redo.length == 0) {
    $(this).css('opacity', 0.5);
    $(this).css('cursor', 'default')
  }
});
