const Order = require("../../../models/order")
const moment = require('moment')
function orderController(){
    return{
        async index(req,res){
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort:{ 'createdAt':-1 }})
                res.header('Cache-Controller','no-cache','private','no-store')
            res.render('customers/orders',{orders:orders,moment:moment})
        },
        store(req,res){
            //validate request
            const {phone,address}=req.body
            if(!phone || !address){
                req.flash('error','All fields are required')
                res.redirect('/cart')
            }
            const order = new Order({
                customerId : req.user._id,
                items : req.session.cart.items,
                phone,
                address
            })
            order.save().then(result=>{    
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderPlaced', result)            
                req.flash('success','Order placed successfully')
                delete req.session.cart
                return res.redirect('/customer/orders')
            }).catch(err=>{
                req.flash('error','something went wrong')
                return res.redirect('/cart')
            })
        },
        async show(req,res){
            const order = await Order.findById(req.params.id)
            //Authorized user

            if(req.user._id.toString() === order.customerId.toString()){
                return res.render('customers/singleOrders',{order})
            }           
               return res.redirect('/')

        }
    }
}

module.exports = orderController