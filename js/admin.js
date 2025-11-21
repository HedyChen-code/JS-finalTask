// 宣告 dom 變數
const orderList = document.querySelector('.js-orderList');
const discardAllBtn = document.querySelector('.discardAllBtn');
const chart = document.querySelector('#chart');

// 畫面初始化
const init = () => {
  getOrderList();
}

init();

// ** 訂單列表

// 取得訂單列表
let orderData = [];

async function getOrderList () {
  let Url = `${baseUrl}/api/livejs/v1/admin/${apiPath}/orders`;
  
  try {
    const res = await axios.get(Url, headers);
    orderData = res.data.orders;
    if (!orderData || orderData.length === 0) {
      let str = 
        `<tr class="noDataYet">
          <td colspan="8">尚無資料</td>
        </tr>`;
      orderList.innerHTML = str;

      Toast.fire ({
        icon: 'warning',
        title: '尚無訂單資料',
      })
    return;
    }

    orderData.sort((a,b) => b.createdAt - a.createdAt);
    renderOrderList(orderData);
  }
  catch (err) {
    Toast.fire ({
      icon: 'error',
      title: `取得訂單失敗`
    })
  }
}

// 渲染訂單列表
const renderOrderList = orders => {
  let str = '';
  orders.forEach(order => {
    // 組訂單品項字串
    let productStr = '';
    order.products.forEach(function (productItem) {
      productStr += 
      `<p>${productItem.title}x${productItem.quantity}</p>`
    })
    // 判斷訂單處理狀態
    let orderStatus = '';
    if (order.paid === true) {
      orderStatus = '已處理'
    }
    else {
      orderStatus = '未處理'
    }
    // 組時間字串
    const timeStamp = new Date(order.createdAt * 1000);
    const orderTime = timeStamp.toLocaleString ('zh-TW', {
      hour12: false
    })
    // 組訂單字串
    str += `<tr>
              <td>${order.id}</td>
              <td>
                <p>${order.user.name}</p>
                <p>${order.user.tel}</p>
              </td>
              <td>${order.user.address}</td>
              <td>${order.user.email}</td>
              <td>
                <p>${productStr}</p>
              </td>
              <td>${orderTime}</td>
              <td class="orderStatus">
                <a href="#" class="orderStatus" data-id="${order.id}" data-status="${order.paid}">${orderStatus}</a>
              </td>
              <td>
                <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${order.id}" value="刪除">
              </td>
            </tr>`
  })
  orderList.innerHTML = str;
  // 修改訂單狀態的文字顏色
  const orderStatusColor = document.querySelectorAll('.orderStatus a');
  orderStatusColor.forEach(item => {
    if (item.textContent === '已處理') {
      item.style.color = '#358fbb';
    }
  });

  if (orderData.length > 1) {
    renderC3_prodItem();
  }
  else {
    chart.textContent = '訂單資料不足，圖表不顯示'
  }
  
}

// ** 修改訂單
// 先取出該筆訂單的 orderId 和 訂單狀態
orderList.addEventListener('click', e => {
  e.preventDefault();

  let targetClass = e.target.getAttribute('class');
  let orderId = e.target.dataset.id;

  if (targetClass === 'delSingleOrder-Btn js-orderDelete') {
    deleteSingleOrder(orderId);
  }

  if (targetClass === 'orderStatus') {
    // 取值 dataset 會回傳字串 'true'/'false'
    let status = JSON.parse(e.target.dataset.status);
    changeOrderStatus(status, orderId);
  }
})

// 修改訂單狀態
async function changeOrderStatus (status, orderId) {
  let currentStatus ;
  currentStatus = !status;

  let Url = `${baseUrl}/api/livejs/v1/admin/${apiPath}/orders`;
  let data = {
    data: {
      id: orderId,
      paid: currentStatus
    }
  };

  try {
    const res = await axios.put(Url, data, headers);
    Toast.fire ({
      icon: 'success',
      title: '修改訂單成功',
    });
    getOrderList();
  }
  catch (err) {
    Toast.fire ({
      icon: 'error',
      title: `修改訂單失敗 ${err.status}`,
    })
  }
}

// 刪除全部訂單
discardAllBtn.addEventListener('click', e => {
  e.preventDefault();
  deleteAllOder();
})

async function deleteAllOder () {
  let Url = `${baseUrl}/api/livejs/v1/admin/${apiPath}/orders`;

  try {
    const res = await axios.delete(Url, headers);
    Toast.fire ({
      icon: 'success',
      title: '已清除全部的訂單',
    });
    getOrderList();
  }
  catch (err) {
    Toast.fire ({
      icon: 'error',
      title: `清除全部訂單失敗 ${err.status}`,
    })
  }
}

// 刪除特定訂單
async function deleteSingleOrder (orderId) {
  let Url = `${baseUrl}/api/livejs/v1/admin/${apiPath}/orders/${orderId}`;

  try {
    const res = await axios.delete(Url, headers);
    Toast.fire ({
      icon: 'success',
      title: '成功刪除該筆訂單',
    });
    getOrderList();
  }
  catch (err) {
    Toast.fire ({
      icon: 'error',
      title: `該筆訂單刪除失敗 ${err.status}`,
    })
  }
}

// ** C3 圖表
const chartTitle = document.querySelector('.section-title');
const chartType = document.querySelector('.chartType');


chartType.addEventListener('click', e => {
  if (e.target.value === '全品項營收比重') {
    
  }
  else if (e.target.value === '全產品類別營收比重') {
    renderC3_category()
  }
})

// 圖表：全品項營收比重
const renderC3_prodItem = () => {
  chartTitle.textContent = '全品項營收比重';
  // 物件資料蒐集
  let prodItemsTotal = {};
  orderData.forEach(order => {
    order.products.forEach(productItem => {
      let prodItem = productItem.title;
      let amount = productItem.price * productItem.quantity;

      if (prodItemsTotal[prodItem] === undefined) {
        prodItemsTotal[prodItem] = amount;
      }
      else {
        prodItemsTotal[prodItem] += amount;
      }
    })
  })
  // 做出資料關聯
  // 原始陣列資料
  let originAry = Object.keys(prodItemsTotal);
  let originData = [];
  originAry.forEach(prodItem => {
    let ary = [];
    ary.push(prodItem);
    ary.push(prodItemsTotal[prodItem]);
    originData.push(ary);
  })
  // 排序後的陣列資料
  // 比大小，降冪排列
  // 目的：營收前三高的品項 -> 各自成一色塊 、 其餘品項加總成一色塊
  let rankSortData = originData.sort((a,b) => b[1] - a[1]);
  // 如果筆數超過 4 筆以上 -> 統整為其他
  if (rankSortData.length > 3) {
    let otherTotal = 0;
    rankSortData.forEach(function (item, index) {
      if (index > 2) {
        otherTotal += rankSortData[index][1]
      }
    })
    rankSortData.splice(3, rankSortData.length - 3);
    rankSortData.push(['其他', otherTotal]);
  }
  // C3.js
  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
      type: "pie",
      columns: rankSortData,
      colors:{
        [rankSortData[0][0]]:"#DACBFF",
        [rankSortData[1][0]]:"#9D7FEA",
        [rankSortData[2][0]]: "#5434A7",
        [rankSortData[3][0]]: "#301E5F",
      }
    },
  });
}

// 圖表：全產品類別營收比重
const renderC3_category = () => {
  chartTitle.textContent = '全產品類別營收比重';

  // 物件資料蒐集
  let categoriesTotal = {};
  orderData.forEach(order => {
    order.products.forEach(productItem => {
      let category = productItem.category;
      let amount = productItem.price * productItem.quantity;
      if (categoriesTotal[category] === undefined) {
        categoriesTotal[category] = amount;
      }
      else {
        categoriesTotal[category] += amount;
      }
    })
  })
  // 做出資料關聯
  let categoryAry = Object.keys(categoriesTotal);
  let categoriesTotalData = [];
  categoryAry.forEach(category => {
    let ary = [];
    ary.push(category);
    ary.push(categoriesTotal[category]);
    categoriesTotalData.push(ary);
  })

  // C3.js
  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
      type: "pie",
      columns: categoriesTotalData,
      colors:{
        [categoriesTotalData[0][0]]:"#DACBFF",
        [categoriesTotalData[1][0]]:"#9D7FEA",
        [categoriesTotalData[2][0]]: "#5434A7",
      }
    },
  });
}

// 預設 JS，請同學不要修改此處
let menuOpenBtn = document.querySelector('.menuToggle');
let linkBtn = document.querySelectorAll('.topBar-menu a');
let menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);

linkBtn.forEach((item) => {
  item.addEventListener('click', closeMenu);
})

function menuToggle() {
  if(menu.classList.contains('openMenu')) {
    menu.classList.remove('openMenu');
  }else {
    menu.classList.add('openMenu');
  }
}
function closeMenu() {
  menu.classList.remove('openMenu');
}