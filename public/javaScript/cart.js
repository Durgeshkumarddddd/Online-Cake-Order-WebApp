// Add to Cart
let neg = document.getElementById('neg')
let pos = document.getElementById('pos')
let value = document.getElementById('c-value')

let i = 0

neg.addEventListener('click', () => {
  if (i>0) {
    i--
    value.textContent = i;
    console.log("hi");
        
  }
  else{
    value.textContent = 0;

  }
})

pos.addEventListener('click', () => {
  i++
  value.textContent = i;
})