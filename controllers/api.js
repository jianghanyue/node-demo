var products = [{
    name: 'iPhone',
    price: 6999
}, {
    name: 'Kindle',
    price: 999
}];

const welcome = 'welcome czs!'

module.exports = {
    'GET /api/products': async (ctx, next) => {
        // 设置Content-Type:
        ctx.rest({products})
    },

    'GET /api': async (ctx, next) => {
        // 设置Content-Type:
        ctx.rest(welcome)
    },
}
