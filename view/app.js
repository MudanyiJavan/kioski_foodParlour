const ricebtn = document.getElementById("Rice")
const chapoobtn= document.getElementById("chapati")











const cart = document.getElementById("items")
let riceQty = 0 

chapoobtn.addEventListener("click", ()=>{
    if(chapoobtn.innerHTML === "cart"){
        chapoobtn.innerHTML = `
        <button id="decrease">-</button>
        <span id="counter">1</span>
        <button id="add">+</button>
        `
        riceQty=1
        cart.textContent=riceQty
        
        const increamentBtn = document.getElementById("add")
        increamentBtn.addEventListener("click", (e)=>{    
              e.stopPropagation()
            const counter = document.getElementById("counter")
            let qty = parseInt(counter.textContent)
            counter.textContent = qty + 1;
            riceQty+=1
            cart.textContent=riceQty
        })

        const decreamentBtn = document.getElementById("decrease")
        decreamentBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            // Decrement quantity
            riceQty -= 1
            if (riceQty <= 0) {
                riceQty = 0
                chapoobtn.innerHTML = "cart"   // reset button to original
                cart.textContent = ""        // hide number when empty
            } else {
                const counter = document.getElementById("counter")
                counter.textContent = riceQty
                cart.textContent = riceQty
            }
        })
    }

})

ricebtn.addEventListener("click", ()=>{
    if(ricebtn.innerHTML === "cart"){
        ricebtn.innerHTML = `
        <button id="decrease">-</button>
        <span id="counter">1</span>
        <button id="add">+</button>
        `
        riceQty=1
        cart.textContent=riceQty
        
        const increamentBtn = document.getElementById("add")
        increamentBtn.addEventListener("click", (e)=>{    
              e.stopPropagation()
            const counter = document.getElementById("counter")
            let qty = parseInt(counter.textContent)
            counter.textContent = qty + 1;
            riceQty+=1
            cart.textContent=riceQty
        })

        const decreamentBtn = document.getElementById("decrease")
        decreamentBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            // Decrement quantity
            riceQty -= 1
            if (riceQty <= 0) {
                riceQty = 0
                ricebtn.innerHTML = "cart"   // reset button to original
                cart.textContent = ""        // hide number when empty
            } else {
                const counter = document.getElementById("counter")
                counter.textContent = riceQty
                cart.textContent = riceQty
            }
        })
    }

})