// 基礎寫法 + 進階寫法
// 進階寫法：箭頭函式、async await、map()、解構賦值、sweetalert.js

// 宣告 dom 變數
const productList = document.querySelector('.productWrap');
const productSelect = document.querySelector('.productSelect');
const cartList = document.querySelector('.shoppingCart-tableList');

// 畫面初始化
const init = () => {
  getProductList();
  getCartList();
}


// function init () {
//   getProductList();
//   getCartList();
// }

init();

// ＊＊產品列表

// 取得產品列表
let productData = [];

// 箭頭函式 + async + sweetalert
async function getProductList () {
  let Url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/products`;

  try {
    const res = await axios.get(Url);
    productData = res.data.products;
    renderProductList(productData);
  }
  catch(err) {
    Toast.fire ({
      icon: 'error',
      title: `商品取得失敗 ${err.status}`,
    })
  }
}

// 問題：async 可以用箭頭函式嗎？

// 箭頭函式寫法
// const getProductList = () => {
//   let Url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/products`;
  
//   axios.get(Url)
//    .then((res) => {
//     productData = res.data.products;
//     renderProductList(productData);
//    })
//    .catch((err) => {
//     console.log(err.response)
//    })
// }

// 基礎寫法
// function getProductList () {
//   let Url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/products`;
  
//   axios.get(Url)
//    .then(function (res) {
//     productData = res.data.products;
//     renderProductList(productData);
//    })
//    .catch(function (err) {
//     console.log(err.response)
//    })
    
// }

// 產品列表的卡片字串
// 箭頭函式
const productListItemStr = product => {
  return `<li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${product.images}" alt="">
        <a href="#" class="addCardBtn" data-id="${product.id}">加入購物車</a>
        <h3>${product.title}</h3>
        <del class="originPrice">NT$ ${toThousands(product.origin_price)}</del>
        <p class="nowPrice">NT ${toThousands(product.price)}</p>
      </li>`;
}
  
// 基礎寫法
// function productListItemStr (product) {
//   return `<li class="productCard">
//         <h4 class="productType">新品</h4>
//         <img src="${product.images}" alt="">
//         <a href="#" class="addCardBtn" data-id="${product.id}">加入購物車</a>
//         <h3>${product.title}</h3>
//         <del class="originPrice">NT$ ${toThousands(product.origin_price)}</del>
//         <p class="nowPrice">NT ${toThousands(product.price)}</p>
//       </li>`;
// }

// 渲染產品列表
const renderProductList = products => {
  let str = '';
  products.forEach((product) => {str += productListItemStr(product);})
  productList.innerHTML = str;
}

// function renderProductList (products) {
//   let str = '';
//   products.forEach(function (product) {
//     str += productListItemStr(product);
//   })
//   productList.innerHTML = str;
  
// }

// 下拉選單，渲染對應產品
productSelect.addEventListener('change', e => {
  const category = e.target.value;
  if (category === '全部') {
    renderProductList(productData);
    return;
  }
  let str = '';
  productData.forEach(product => {
    if (product.category === category) {
      str += productListItemStr(product);
    }
  })
  productList.innerHTML = str;
})

// productSelect.addEventListener('change', function (e) {
//   const category = e.target.value;
//   if (category === '全部') {
//     renderProductList();
//     return;
//   }
//   let str = '';
//   productData.forEach(function (product) {
//     if (product.category === category) {
//       str += productListItemStr(product);
//     }
//   })
//   productList.innerHTML = str;
// })

// ＊＊購物車列表

// 取得購物車列表
async function getCartList () {
  let Url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts`;

  try {
    const res = await axios.get(Url);
    // 訂單總金額
    let totalPrice = toThousands(res.data.finalTotal);
    document.querySelector('.js-totalPrice').textContent = totalPrice;
    // 渲染購物車列表
    cartData = res.data.carts;
    renderCartList(cartData);
  }
  catch(err) {
    console.log(err);
    Toast.fire ({
      icon: 'error',
      title: `購物車列表取得失敗 ${err.status}`
    })
  }
}

// function getCartList () {
//   let Url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts`;

//   axios.get(Url)
//     .then (function (res) {
//       // 訂單總金額
//       let totalPrice = toThousands(res.data.finalTotal);
//       document.querySelector('.js-totalPrice').textContent = totalPrice;
//       // 渲染購物車列表
//       cartData = res.data.carts;
//       renderCartList(cartData);
//     })
//     .catch(function (err) {
//       console.log(err.status || '購物車列表取得失敗');
//     })

// }

// 渲染購物車列表
const renderCartList = carts => {
  let str = '';
  carts.forEach(cart => {
    str += 
    `<tr>
      <td>
        <div class="cardItem-title">
          <img src="${cart.product.images}" alt="">
          <p>${cart.product.title}</p>
        </div>
      </td>
      <td>NT$${toThousands(cart.product.price)}</td>
      <td>${cart.quantity}</td>
      <td>NT$${toThousands(cart.product.price * cart.quantity)}</td>
      <td class="discardBtn">
        <a href="#" class="material-icons" data-id="${cart.id}">
          clear
        </a>
      </td>
    </tr>`;
  })
  cartList.innerHTML = str;
}

// function renderCartList (carts) {
//   let str = '';
//   carts.forEach(function (cart) {
//     str += 
//     `<tr>
//       <td>
//         <div class="cardItem-title">
//           <img src="${cart.product.images}" alt="">
//           <p>${cart.product.title}</p>
//         </div>
//       </td>
//       <td>NT$${toThousands(cart.product.price)}</td>
//       <td>${cart.quantity}</td>
//       <td>NT$${toThousands(cart.product.price * cart.quantity)}</td>
//       <td class="discardBtn">
//         <a href="#" class="material-icons" data-id="${cart.id}">
//           clear
//         </a>
//       </td>
//     </tr>`;
//   })
//   cartList.innerHTML = str;
// }

// ＊＊加入購物車
productList.addEventListener('click', e => {
  e.preventDefault();
  let addCartClass = e.target.getAttribute('class');
  // 排除法
  if (addCartClass !==  'addCardBtn'){
    // alert('你點錯了窩');
    return
  }
  let productId = e.target.dataset.id;
  // 購物車內的產品數量
  // 點擊後 -> 若為
  // 購物車內已有的產品 -> 原有數量 + 1, 尚未有的產品 -> 數量 = 1
  let cartsItemNum = 1;
  cartData.forEach(cart => {
    if (cart.product.id === productId) {
      cartsItemNum = cart.quantity+=1;
    }
  })
  addCartItem(productId, cartsItemNum);
})

// productList.addEventListener('click', function (e) {
//   e.preventDefault();
//   // console.log(e.target.dataset.id)
//   // console.log(e.target)
//   let addCartClass = e.target.getAttribute('class');
//   // 排除法
//   if (addCartClass !==  'addCardBtn'){
//     alert('你點錯了窩');
//     return
//   }
//   let productId = e.target.dataset.id;
//   // 購物車內的產品數量
//   // 點擊後 -> 若為
//   // 購物車內已有的產品 -> 原有數量 + 1, 尚未有的產品 -> 數量 = 1
//   let cartsItemNum = 1;
//   cartData.forEach(function (cart) {
//     if (cart.product.id === productId) {
//       cartsItemNum = cart.quantity+=1;
//     }
//   })
//   console.log(cartsItemNum);
//   addCartItem(productId, cartsItemNum);
// })

async function addCartItem (productId, cartsItemNum) {
  let Url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts`;
  let data = {
  data: {
    productId: productId,
    quantity: cartsItemNum
   }
  };

  try {
    const res = await axios.post(Url,data);
    getCartList();
  }
  catch(err) {
    console.log(err)
    Toast.fire ({
      icon: 'error',
      title: `加入購物車失敗 ${err.status}`,
    })
  }
}

// function addCartItem (productId, cartsItemNum) {
//   let Url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts`;
//   let data = {
//   "data": {
//     productId: productId,
//     quantity: cartsItemNum
//    }
//   };

//   axios.post(Url, data)
//     .then (function (res) {
//       getCartList();
//     })
//     .catch (function (err) {
//       console.log('加入購物車失敗')
//     })
// }

// ＊＊清除購物車內全部產品
const discardAllBtn = document.querySelector('.discardAllBtn');

discardAllBtn.addEventListener('click', e => {
  e.preventDefault();
  delAllCarts();
})

async function delAllCarts () {
  let Url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts`;
  
  try {
    const res = await axios.delete(Url);
    // alert('刪除全部購物車成功')
    Toast.fire ({
      icon: 'success',
      title: '刪除全部購物車成功',
    })
    getCartList();
  }
  catch {
    Toast.fire ({
      icon: 'warning',
      title: '購物車已清空，請勿重複點擊',
    })
  }
}

// discardAllBtn.addEventListener('click', function (e) {
//   e.preventDefault();
//   let Url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts`;
//   axios.delete(Url)
//     .then(function (res) {
//       alert('刪除全部購物車成功');
//       getCartList();
//     })
//     .catch(function (err) {
//       console.log('購物車已清空，請勿重複點擊')
//     }) 
// })

// ＊＊刪除購物車內特定產品
cartList.addEventListener('click', e => {
  e.preventDefault();
  const cartId = e.target.dataset.id;
  if (cartId == null) {
    return;
  }
  delSingleCart(cartId);
})

async function delSingleCart (cartId) {
  let Url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts/${cartId}`;

  try {
    const res = await axios.delete(Url);
    Toast.fire ({
      icon: 'success',
      title: '這個商品已刪除成功'
    })
    getCartList();
  }
  catch (err) {
    console.log(err);
    Toast.fire ({
      icon: 'error',
      title: `刪除失敗 ${err.status}`,
    })
  }
}

// cartList.addEventListener('click', function (e) {
//   e.preventDefault();
//   const cartId = e.target.dataset.id;
//   if (cartId == null) {
//     alert('你點到其他東西了唷～');
//     return;
//   }
//   delSingleCart(cartId);
// })

// function delSingleCart (cartId) {
//   let Url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts/${cartId}`;
//   axios.delete(Url)
//     .then(function (res) {
//       alert('刪除單筆購物車成功');
//       getCartList();
//     })
//     .catch(function (err) {
//       alert('刪除失敗')
//     })
// }

// ＊＊送出購買訂單
const orderInfoBtn = document.querySelector('.orderInfo-btn');

// validate.js

const inputs = document.querySelectorAll('input[name]');
console.log(inputs)
// -> 找出所有有 name 屬性的 <input> 元素
const form = document.querySelector('.orderInfo-form');
const constraints = {
  '姓名': {
    presence: {
      message: '是必填欄位'
    }
  },
  '電話': {
    presence: {
      message: '是必填欄位'
    },
    format: {
      pattern: /^[09]{2}\d{8}$/,
      message: '請輸入正確的手機號碼 09-開頭，共十碼'
    }
  },
  'Email': {
    presence: {
      message: '是必填欄位'
    },
    email: {
      message: '格式錯誤'
    }
  },
  '寄送地址': {
    presence: {
      message: '是必填欄位'
    }
  },
};

inputs.forEach ((item) => {
  console.log(item)
  item.addEventListener('change', (e) => {
    e.preventDefault();
    item.nextElementSibling.textContent = '';
    // 若欄位的格式不符合限制，或欄位為空 -> errors
    let errors = validate(form, constraints) || '';
    console.log(errors)

    if (errors) {
      Object.keys(errors).forEach((key) => {
        console.log(key);
        document.querySelector(`[data-message="${key}"]`).textContent = errors[key];
        return;
      })
    }
  });
});

// orderInfoBtn.addEventListener('click', (e) => {
//   e.preventDefault();
//   if (cartData.length === 0) {
//     alert('請加入購物車');
//     return
//   }

//   const customerName = document.querySelector('#customerName').value.trim();
//   const customerPhone = document.querySelector('#customerPhone').value.trim();
//   const customerEmail = document.querySelector('#customerEmail').value.trim();
//   const customerAddress = document.querySelector('#customerAddress').value.trim();
//   const customerTradeWay = document.querySelector('#tradeWay').value;
//   // console.log(customerName,customerPhone,customerEmail,customerAddress,customerTradeWay)

//   if (!errors) {
//     submitOrder(customerName,customerPhone,customerEmail,customerAddress,customerTradeWay);
//   }
// })



// // 表單驗證
// const nameMessage = document.querySelector('[data-message="姓名"]');
// const phoneMessage = document.querySelector('[data-message="電話"]');
// const emailMessage = document.querySelector('[data-message="Email"]');
// const addressMessage = document.querySelector('[data-message="寄送地址"]');

// orderInfoBtn.addEventListener('click', function (e) {
//   e.preventDefault();
//   // 條件 1：購物車內有訂單
//   if (cartData.length === 0) {
//     alert('請加入購物車');
//     return;
//   }
  const customerName = document.querySelector('#customerName').value.trim();
  const customerPhone = document.querySelector('#customerPhone').value.trim();
  const customerEmail = document.querySelector('#customerEmail').value.trim();
  const customerAddress = document.querySelector('#customerAddress').value.trim();
  const customerTradeWay = document.querySelector('#tradeWay').value;
  // console.log(customerName,customerPhone,customerEmail,customerAddress,customerTradeWay)

//   const messages = document.querySelectorAll('.orderInfo-message');
//   console.log(messages)
//   // 條件 2：表單中每個欄位都有填寫
//   if (customerName === '' || customerPhone === '' || customerEmail === '' || customerAddress === '' || customerTradeWay === '') {
//     alert('請勿輸入空資訊');
//     messages.forEach ((item) => {
//       item.textContent = '必填欄位';
//     })
//     return;
//   }
//   else {
//     messages.forEach(item => {
//       item.textContent = '';
//     })
//   }

//   // 條件 3：各欄位格式正確
//   // 電話格式驗證
//   if (validatePhone(customerPhone) === false || validateEmail(customerEmail) === false) {
//     return
//   }
//   // 信箱格式驗證
//   // if (validateEmail(customerEmail) === false) {
//   //   return
//   // }
  

//   submitOrder(customerName,customerPhone,customerEmail,customerAddress,customerTradeWay);
// })

async function submitOrder (customerName,customerPhone,customerEmail,customerAddress,customerTradeWay) {
  let Url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/orders`;
  let data = {
    data: {
      user: {
        name: customerName,
        tel: customerPhone,
        email: customerEmail,
        address: customerAddress,
        payment: customerTradeWay
      }
    }
  }

  try {
    const res = await axios.post(Url, data);
    Toast.fire ({
      icon: 'success',
      title: '訂單建立成功',
    });
    document.querySelector('#customerName').value = '';
    document.querySelector('#customerPhone').value = '';
    document.querySelector('#customerEmail').value = '';
    document.querySelector('#customerAddress').value = '';
    document.querySelector('#tradeWay').value = 'ATM';
    getCartList();
  }
  catch (err) {
    Toast.fire ({
      icon: 'error',
      title: `訂單送出失敗 ${err.status}`,
    })
  }
}

// function submitOrder (customerName,customerPhone,customerEmail,customerAddress,customerTradeWay) {
//   let Url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/orders`;
//   let data = {
//   "data": {
//     "user": {
//       name: customerName,
//       tel: customerPhone,
//       email: customerEmail,
//       address: customerAddress,
//       payment: customerTradeWay
//     }
//   }
//   }
//   axios.post(Url, data)
//     .then(function (res) {
//       Toast.fire ({
//         icon: 'success',
//         title: '訂單建立成功',
//       });
//       // nameMessage.textContent = '';
//       // phoneMessage.textContent = '';
//       // emailMessage.textContent = '';
//       // addressMessage.textContent = '';

//       document.querySelector('#customerName').value = '';
//       document.querySelector('#customerPhone').value = '';
//       document.querySelector('#customerEmail').value = '';
//       document.querySelector('#customerAddress').value = '';
//       document.querySelector('#tradeWay').value = 'ATM';
//       getCartList();
//     })
//     .catch(function (err) {
//       Toast.fire ({
//         icon: 'error',
//         title: '訂單送出失敗',
//       })
//       // alert('訂單送出失敗');
//     })
// }

// util js

// 千分位
const toThousands = x => {
  let parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');
  return parts.join('.')
}

// function toThousands (x) {
//   let parts = x.toString().split('.');
//   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');
//   return parts.join('.')
// }

console.log(toThousands(1234567.1234567))

//信箱驗證
const validateEmail = mail => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    emailMessage.textContent = '';
    return (true)
  }
  emailMessage.textContent = '無效的信箱地址！';
  return (false)
}

// function validateEmail(mail) 
// {
//  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
//   {
//     emailMessage.textContent = '';
//     return (true)
//   }
//   emailMessage.textContent = '無效的信箱地址！';
//   return (false)
// }

// 手機號碼驗證
const validatePhone = phone => {
  if (/^[09]{2}\d{8}$/.test(phone)) {
    return true
  }
  return false
}

// function validatePhone (phone) {
//   if (/^[09]{2}\d{8}$/.test(phone)) {
//     phoneMessage.textContent = '';
//     return true
//   }
//   phoneMessage.textContent = '請填寫正確的手機號碼'
//   return false
// }
