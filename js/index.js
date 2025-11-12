let data = []

async function fetchData() {
  try {
    const res = await fetch('https://dummyjson.com/products')
    const resdata = await res.json()
    // console.log(resdata)
    data = resdata.products  
    // console.log(data)
    display()
  } catch (err) {
    console.log("error", err)
  }
}
fetchData()

function display() {
  let str = ''
  data.forEach(i => {
    str += `
      <div class="card">
      <a href="../pages/details.html?id=${i.id}">
        <img src="${i.thumbnail}" alt="${i.title}">
        <h1>${i.title}</h1>
        <h2>$${i.price}</h2>
        </a>
      </div>
    `
  })
  document.getElementById("cards").innerHTML = str
}
