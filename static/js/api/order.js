/**
 * Created by aleksey on 5/27/16.
 */

var app = app || {},
    steps = ['', 'collapse', 'collapse', 'collapse', 'collapseFour', 'collapseFive', 'collapseSix'];

app.order = new Ractive({
    el: '#order_block',
    template: '#template_order',

    data: {
        order: new app.Order,
        orders: new app.Orders,
        user: new app.User,
        cart: new app.Cart,
        pay_choices: window.PAY_CHOICES,
        type_user: 1,
        authorization: this.user_id ?  'empty_template' : 'template_sign_in',
        step: 1
    },
    adapt: [Ractive.adaptors.Backbone]
});

app.order.observe('type_user', function (val, old, keypath) {
    console.log('change type_user');
    if(val=='0'){
        this.get('user').clear(silent=true);
        this.set('authorization', 'empty_template')
    }else if(val == '1'){
        this.set('user', new app.User);
        this.set('authorization', this.get('user.id')? 'empty_template' : 'template_sign_in');
    }
});

app.order.on({
    back: function(e){
        console.log(this.get('step'))
        this.set('step', this.get('step')-1)
        $('a[href=#collapse' + this.get('step') + ']').click();
    },
    go_step_two: function(e){
        var obj = e.context;
        if((obj.type_user && obj.user.id) || obj.type_user==0) {
            this.set('step', 2);
            $('a[href=#collapse2]').click();
        }
    },
    go_step_three: function(e){
        this.set({
            'order.user': this.get('user.id') || null,
            'order.cart': this.get('cart.id') || null,
            'order.full_name': this.get('user.full_name'),
            'order.email': this.get('user.email'),
            'order.phone': this.get('user.phone'),
            'order.total_price': this.get('cart.product.total_price'),
            'order.currency': this.get('cart.product.items.0.currency'),
            'order.total_count': this.get('cart.product.total_count'),
            'order.orderitem_set': this.get('cart.product.items'),
            'order.pre_save': true

        });
        this.get('order').save({},{
            isNew:true,
            success:function(model, response, options){
                model.set('errors', '');
                app.order.set('step', 3);
                $('a[href=#collapse3]').click();
            },
            error:function(model, response, options){
                console.log(response.responseJSON);
                model.set('errors', response.responseJSON);
            }

        });
    },
    create_order: function(e){
        this.get('order').unset('pre_save');
        this.get('order').save({},{
            success:function(model, response, options){
                app.order.unset('order');
                app.order.set('orders', response);
                app.cart.get('cart').fetch({
                    success: function(model, response, options){
                        app.order.set('cart', response);
                    }
                });
                console.log(response);
                },
            error:function(model, response, options){
                console.log(response.responseJSON);
                model.set('errors', response.responseJSON);
            },
            isNew:true

        });
    },
    sign_in: function(e){
        $.ajax({
            url: window.login_url,
            type: 'POST',
            data:{'email': e.context.email, 'password': e.context.password},
            error: function(response){
                app.order.set('error', response.responseJSON)

            },
            success: function(response){
                 app.order.set('user', response);
            }
        });


    },
    sign_up: function(e){
        console.log('sign_up');
    }
});