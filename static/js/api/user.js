/**
 * Created by aleksey on 5/30/16.
 */

var app = app || {};

app.user = new Ractive({
    el: '#authentication',
    template: '#authentication_template',
    partials:{
        auth: $('#template_sign_in').html() + $('#template_sign_up').html()
    },
    data: {
        user: new app.User
    },

    login: function(){
        var email = this.get('email'),
            password = this.get('password'),
            _this = this;
        $.ajax({
            url: window.login_url,
            type: 'POST',
            data:{'email': email, 'password': password},
            error: function(response){
                if(response.status == 401){
                    _this.set('sign_in_error', response.responseText)
                }
            },
            success: function(response){
                _this.set(response);
                _this.set({'is_authenticated': true});
            }
        });

    },

    adapt: [Ractive.adaptors.Backbone]
});

app.user.on({
    sign_in: function(e){
         $.ajax({
            url: window.login_url,
            type: 'POST',
            data:{'email': e.context.email, 'password': e.context.password},
            error: function(response){
                app.user.set('error', response.responseJSON)

            },
            success: function(response){
                console.log(response);
                app.user.set('user', response);
                app.cart.set('cart', response.cart);
            }
        });
    },
    sign_up: function(e){
        console.log('sign_up');
    }

});

