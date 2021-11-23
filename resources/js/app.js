import axios from 'axios'
import moment from 'moment'
import Noty from 'noty'
import { initAdmin } from './admin'
let addToCart = document.querySelectorAll('.add-to-cart')

let cartCounter = document.querySelector("#cartContainer")

function updateCart(pizza){
    axios.post('/update-cart',pizza).then(res=>{
        // console.log(res)
        cartCounter.innerText = res.data.totalQty
        new Noty({
            timeout :1000,
            type:'success',
            text: "Item add to cart",
            progressBar: false,
            layout: 'bottomLeft'
          }).show();          
    }).catch(err=>{
        // console.log(err)
        new Noty({
            timeout :10000,
            type:'error',
            text: "Something went wrong",
            progressBar: false,
            layout: 'bottomLeft'
        }).show();  
    })
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        // console.log(e)

        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
        // console.log(pizza)
    })
})

const alertMsg = document.querySelector('#success-alert')

if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}

initAdmin()

//Change order status

let statuses = document.querySelectorAll('.status-line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')
function updateStatus(order){
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
        if(stepCompleted) {
            status.classList.add('step-completed')
        }
       if( dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })
}

updateStatus(order);

//socket

let socket = io()

//join
if(order){
    socket.emit('join',`order_${order_id}`)
}

socket.on('orderUpdated',(data)=>{
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        timeout :1000,
        type:'success',
        text: "Order Updated",
        progressBar: false,
      }).show();          

})

