import axios from 'axios'
import Noty from 'noty'

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
        console.log(err)
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