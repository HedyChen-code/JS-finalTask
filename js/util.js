// util js

// 千分位
const toThousands = x => {
  let parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');
  return parts.join('.')
}

//信箱驗證
const validateEmail = mail => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
  return (false)
} 

// 手機號碼驗證
const validatePhone = phone => {
  if (/^[09]{2}\d{8}$/.test(phone)) {
    return true
  }
  return false
}