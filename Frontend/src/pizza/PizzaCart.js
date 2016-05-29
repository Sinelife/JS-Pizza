/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

var allpizzaNum = 0;
var $counter = $("#allpizzaNum");

var $deleteAll = $(".title2");

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

var $summa = $("#summa");
var $SummaCount = 0;

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

var Storage =   require('../storage/storage');

function addToCart(pizza, size)
{
    //Додавання однієї піци в кошик покупок

    //Приклад реалізації, можна робити будь-яким іншим способом
    for(var i = 0; i < Cart.length; i++)
    {
        if(Cart[i].pizza.id == pizza.id && Cart[i].size == size)
        {
            Cart[i].quantity++;
            allpizzaNum++;
            exist = true;
            break;
        }
    }

    if(exist === false)
    {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
        allpizzaNum++;
    }
    $SummaCount += pizza[size].price;

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item)
{
    //Видалити піцу з кошика
    //TODO: треба зробити
    var index = Cart.indexOf(cart_item);
    Cart.splice(index, 1);
    allpizzaNum -= cart_item.quantity;
    $SummaCount -= cart_item.pizza[cart_item.size].price*cart_item.quantity;
    Storage.set("cart", Cart);
    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() 
{
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...
    var saved_orders = Storage.get("cart");
    if(saved_orders) { 
        $('.no-orders').hide();
        Cart = saved_orders; 
    }

    updateCart();
}

function getPizzaInCart() 
{
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() 
{
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) 
    {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);
        var $money = $node.find(".amountPrice");

        $node.find(".plus").click(function()
        {
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            allpizzaNum++;
            $SummaCount += cart_item.pizza[cart_item.size].price;
            //Оновлюємо відображення
            updateCart();
            $money.hide();
        });

        $node.find(".minus").click(function()
        {
            cart_item.quantity -= 1;
            allpizzaNum--;
            $money.show();
            $SummaCount -= cart_item.pizza[cart_item.size].price;
            if(cart_item.quantity == 0)
            {
                removeFromCart(cart_item);
            }
            //Оновлюємо відображення
            updateCart();
        });
        
        $node.find(".delete").click(function()
        {
            removeFromCart(cart_item);
        });

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);

    $deleteAll.click(function()
    {
        Cart = [];
        $SummaCount = 0;
        updateCart();
    });
    
    allpizzaNum = 0;
    $SummaCount = 0;
    
    for(var i=0; i<Cart.length; i++)
    {
        allpizzaNum += Cart[i].quantity;
        $SummaCount += allpizzaNum * Cart[i].pizza[Cart[i].size].price;
    }
    
    $counter.text(allpizzaNum);
    if(allpizzaNum == 0){
        $('#makeOrder').addClass('disabled');
        $('.no-orders').show();
        $('#totalPrice').hide();
        $('.orders').css('height','100%');
        $('.no-orders').show();
    } 
    else
     {
        $('.no-orders').hide();
        $('#makeOrder').removeClass('disabled');
        $('#totalPrice').show();
        $('.orders').css('height','70%');
    }
    
    $sum.text($countSum);
    Storage.set("cart", Cart);
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;