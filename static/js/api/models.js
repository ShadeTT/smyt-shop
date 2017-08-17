var app = app || {};

app.Cart = Backbone.Model.extend({
    urlRoot: '/api/cart/',
    defaults: {
        id: window.cart_id || null,
        user: window.user_id || null,
        product: {
            items: [],
            total_count: 0,
            total_price: 0
        }
    },
    initialize: function () {
        if (this.id) {
            this.fetch();
        }
    },
    url: function () {
        var origUrl = Backbone.Model.prototype.url.call(this);
        return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
    }
});

app.Order = Backbone.Model.extend({
    urlRoot: '/api/order/',
    defaults: {},

    url: function () {
        var origUrl = Backbone.Model.prototype.url.call(this);
        return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
    }
});

app.Orders = Backbone.Collection.extend({
    url: '/api/order/',
    model: app.Order,
    initialize: function () {
        this.fetch();
    }
    //url: function () {
    //    var origUrl = Backbone.Model.prototype.url.call(this);
    //    return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
    //}
});
app.User = Backbone.Model.extend({
    urlRoot: '/api/user/',
    defaults: {
        id: window.user_id,
        is_authenticated: window.user_id ? true : false
    },
    initialize: function () {
        this.on('change', function (model) {
            model.attributes.is_authenticated = model.attributes.id ? true : false;

        });
        if (this.id) {
            this.fetch();
        }
    },
    url: function () {
        var origUrl = Backbone.Model.prototype.url.call(this);
        return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
    }
});