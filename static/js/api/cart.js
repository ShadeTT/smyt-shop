/**
 * Created by aleksey on 5/25/16.
 */

var app = app || {};

Ractive.prototype.unset = function(keypath){
    var lastDot = keypath.lastIndexOf( '.' ),
        parent = keypath.substr( 0, lastDot ),
        property = keypath.substring( lastDot + 1 );

    this.set(keypath);
    delete this.get(parent)[property];
    return this.update(keypath);
};

app.base_cart = Ractive.extend({

    data: {cart: new app.Cart},
    adapt: [Ractive.adaptors.Backbone],
    initialize: function(){

    },
    onrender: function () {
        this.on({
            'remove_product': function (e) {
                var index = e.keypath.split('.').pop();
                // удаляет элемент из массива по индексу
                this.splice('cart.product.items', index, 1);
                this.get('cart').save();
            },
            'change_count': function(e){
                this.get('cart').save();
            }
        });
    }
});



app.cart = new app.base_cart({
    el: '#shopping_cart',
    template: '#template_cart_item'
});


app.header_cart = new app.base_cart({
    el: '#header_cart',
    template: '#template_header_cart'
});

//app.cart.observe('cart.product.items.*.count', function (val, old, keypath) {
//    debugger
//    if(old &&  val && old != val){
//        app.cart.get('cart').save();
//
//    }
//
//});

/*
 Add to cart
 */
$('[data-name=add_to_cart]').click(function (e) {
    e.preventDefault();
    var id = parseInt($(this).data('id')),
        $input = $('input[name=count_product]'),
        count = parseInt($input.val() || 1);
    if (id && count) {
        var cart = new app.Cart({id:null, 'product_id': id, 'count': count});
        cart.save({},{
            isNew :true,
            success: function(model, response, option){
                app.cart.set('cart', response)
            }
        });

    }
});