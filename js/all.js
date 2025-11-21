
// 宣告 dom 變數
const productList = document.querySelector('.productWrap');
const productSelect = document.querySelector('.productSelect');
const cartList = document.querySelector('.shoppingCart-tableList');

// 畫面初始化
const init = () => {
  getProductList();
  getCartList();
}

init();

// ＊＊產品列表

// 取得產品列表
let productData = [];

async function getProductList () {
  let Url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/products`;

  try {
    const res = await axios.get(Url);
    productData = res.data.products;
    renderProductList(productData);
  }
  catch (err) {
    Toast.fire ({
      icon: 'error',
      title: `商品取得失敗 ${err.response.status}`,
    })
  }
}

// 產品列表的卡片字串
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

// 渲染產品列表
const renderProductList = products => {
  let str = '';
  products.forEach(product => {str += productListItemStr(product);})
  productList.innerHTML = str;
}

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
    if (cartData.length === 0) {
      let str = `<tr><td colspan="5" class="noDataYet">目前購物車沒有資料</td></tr>`;
      cartList.innerHTML = str;
      return;
    }
    renderCartList(cartData);
  }
  catch (err) {
    Toast.fire ({
      icon: 'error',
      title: `購物車列表取得失敗 ${err.response.status}`
    })
  }
}

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

// ＊＊加入購物車
// 監聽「加入購物車」按鈕-> 取得要加入的購物車內的 產品 id 、產品數量
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

// 將要加入的項目，加入到購物車資料庫
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
  catch (err) {
    Toast.fire ({
      icon: 'error',
      title: `加入購物車失敗 ${err.response.status}`,
    })
  }
}

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
      title: '已清空所有購物車',
    })
    getCartList();
  }
  catch (err) {
    if (cartData.length < 1) {
      Toast.fire ({
        icon: 'warning',
        title: '購物車已清空，請勿重複點擊',
      })
    }
    else {
      Toast.fire ({
        icon: 'error',
        title: `清空購物車失敗 ${err.response.status}`
      })
    }
    
  }
}

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
    Toast.fire ({
      icon: 'error',
      title: `刪除失敗 ${err.response.status}`,
    })
  }
}

// ＊＊送出購買訂單

// validate.js 驗證格式

const inputs = document.querySelectorAll('.orderInfo-input');
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

inputs.forEach (item => {
  item.addEventListener('change', e => {
    e.preventDefault();
    item.nextElementSibling.textContent = '';
    // 若欄位的格式不符合限制，或欄位為空 -> errors
    let errors = validate(form, constraints) || '';

    if (errors) {
      Object.keys(errors).forEach(key => {
        const messageElement = document.querySelector(`[data-message="${key}"]`);
        messageElement.textContent = errors[key];
        return;
      })
    }
  });
});

// 送出 購買訂單
const submitOrderBtn = document.querySelector('.orderInfo-btn');

submitOrderBtn.addEventListener('click', () => {
  const customerName = document.querySelector('#customerName').value.trim();
  const customerPhone = document.querySelector('#customerPhone').value.trim();
  const customerEmail = document.querySelector('#customerEmail').value.trim();
  const customerAddress = document.querySelector('#customerAddress').value.trim();
  const customerTradeWay = document.querySelector('#tradeWay').value;

  submitOrder(customerName,customerPhone,customerEmail,customerAddress,customerTradeWay);
})

async function submitOrder (customerName,customerPhone,customerEmail,customerAddress,customerTradeWay) {
  let Url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/orders`;
  let data = {
    data: {
      user: {
        name: customerName,
        tel: customerPhone,
        email: customerEmail,
        address: customerAddress,
        payment: customerTradeWay,
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
      title: `${err.response.data.message}`  || '訂單送出失敗',
    })
  }
}

