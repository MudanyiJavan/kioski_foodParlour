
const containerdiv= document.getElementById("products")
window.onload = function() {
    let savedCart = JSON.parse(localStorage.getItem("kioski")) || [];
    

    savedCart.forEach(item => {
        const div = document.createElement("div")
        const p1= document.createElement("p")
        const p2= document.createElement("p")
        const btn1= document.createElement("button")
        const span =document.createElement("span")
        const btn2 = document.createElement("button")
        const bigbtn = document.createElement("button")

        p1.textContent= item.name
        p2.textContent=`Ksh.${item.price}`

        btn1.textContent="-"
        span.textContent= item.quantity
        btn2.textContent= "+"

        bigbtn.appendChild(btn1)
        bigbtn.appendChild(span)
        bigbtn.appendChild(btn2)

        div.appendChild(p1)
        div.appendChild(p2)
        div.appendChild(bigbtn)

        containerdiv.appendChild(div)
    });

   
};

