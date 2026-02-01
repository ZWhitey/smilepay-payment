# smilepay-payment

[![npm version](https://img.shields.io/npm/v/smilepay-payment.svg)](https://www.npmjs.com/package/smilepay-payment)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

一個用於整合速買配 (SmilePay) 支付系統的 Node.js 套件，支援多種支付方式包含虛擬帳號、超商代碼、物流取貨付款等。

A Node.js package for integrating with SmilePay payment gateway, supporting multiple payment methods including virtual accounts, convenience store payment codes, and cash on delivery.

## 功能特色 Features

- ✅ 完整的 TypeScript 支援 / Full TypeScript support
- ✅ 支援多種支付方式 / Multiple payment methods support
- ✅ 自動 XML 解析 / Automatic XML parsing
- ✅ 詳細的錯誤處理 / Comprehensive error handling
- ✅ 型別安全 / Type-safe APIs

## 支援的支付方式 Supported Payment Methods

- 虛擬帳號/ATM (Virtual Account/ATM)
- 超商帳單 (Convenience Store Bill)
- 7-11 ibon
- FamiPort
- 超商取貨付款 (C2C/B2C)
- 黑貓物流 (T-Cat Logistics)

## 安裝 Installation

使用 npm:
```bash
npm install smilepay-payment
```

使用 pnpm:
```bash
pnpm add smilepay-payment
```

使用 yarn:
```bash
yarn add smilepay-payment
```

## 快速開始 Quick Start

### 基本使用 Basic Usage

```typescript
import { SmilePay, EPayZG } from 'smilepay-payment';

// 初始化 SmilePay 客戶端
// Initialize SmilePay client
const smilePay = new SmilePay({
  Dcvc: 'YOUR_MERCHANT_CODE',      // 商家代號
  Rvg2c: 'YOUR_PARAMETER_CODE',    // 參數碼
  Verify_key: 'YOUR_VERIFY_KEY'    // 檢查碼
});

// 產生虛擬帳號付款
// Generate virtual account payment
try {
  const response = await smilePay.generate({
    Pay_zg: EPayZG.VirtualAccountATM,  // 虛擬帳號/ATM
    Data_id: 'ORDER_12345',             // 訂單編號
    Amount: 1000,                       // 金額
    Deadline_date: '2026/12/31',        // 繳款截止日期
    Deadline_time: '23:59:59',          // 繳款截止時間
    Pur_name: '王小明',                 // 購買人姓名
    Mobile_number: '0912345678',        // 行動電話
    Email: 'customer@example.com'       // 電子信箱
  });

  console.log('SmilePay 追蹤碼:', response.SmilePayNO);
  console.log('虛擬帳號:', response.AtmNo);
  console.log('銀行代碼:', response.AtmBankNo);
  console.log('繳款截止日:', response.PayEndDate);
} catch (error) {
  console.error('支付產生失敗:', error);
}
```

### 超商代碼支付 Convenience Store Payment

```typescript
// 使用 7-11 ibon 繳費
// Using 7-11 ibon payment
const response = await smilePay.generate({
  Pay_zg: EPayZG.Ibon,
  Data_id: 'ORDER_67890',
  Amount: 500,
  Deadline_date: '2026/12/31',
  Deadline_time: '23:59:59',
  Pur_name: '李小華',
  Mobile_number: '0987654321',
  Email: 'customer@example.com'
});

console.log('ibon 繳費代碼:', response.IbonNo);
```

### 超商取貨付款 Convenience Store Pickup with Payment

```typescript
import { EPayZG, EPaySubzg } from 'smilepay-payment';

// C2C 取貨付款
// C2C pickup with cash on delivery
const response = await smilePay.generate({
  Pay_zg: EPayZG.C2CPickupPayment,
  Pay_subzg: EPaySubzg.SEVEN,        // 7-11
  Od_sob: '商品名稱',                // 商品名稱（必填）
  Data_id: 'ORDER_11111',
  Amount: 1500,
  Pur_name: '陳小明',
  Mobile_number: '0911222333',
  Address: '台北市信義區信義路五段7號',
  Email: 'customer@example.com',
  Logistics_store: '123456',         // 取件門市代號
  Logistics_Roturl: 'https://your-domain.com/logistics-callback'
});
```

## API 文件 API Documentation

### SmilePay 類別 Class

#### 建構子 Constructor

```typescript
new SmilePay(config: {
  Dcvc: string;      // 商家代號 (Merchant code)
  Rvg2c: string;     // 參數碼 (Parameter code)
  Verify_key: string; // 檢查碼 (Verification key)
})
```

#### generate() 方法 Method

產生 SmilePay 支付訂單。

Generate SmilePay payment order.

```typescript
async generate(input: SmilePayInput): Promise<SmilePayResponseData>
```

**參數 Parameters (SmilePayInput):**

| 參數 Field | 類型 Type | 必填 Required | 說明 Description |
|-----------|----------|--------------|-----------------|
| Pay_zg | EPayZG | 否 No | 收費模式 Payment method |
| Od_sob | string | 條件 Conditional | 消費項目，超商取貨付款時必填 Product name, required for pickup payment |
| Pay_subzg | EPaySubzg | 否 No | 超商或物流公司 Convenience store or logistics company |
| Data_id | string | 否 No | 訂單號碼 Order number |
| Deadline_date | string | 否 No | 繳款截止日期 (yyyy/mm/dd) Payment deadline date |
| Deadline_time | string | 否 No | 繳款截止時間 (HH:mm:ss) Payment deadline time |
| Amount | number | 否 No | 金額 Amount |
| Pur_name | string | 否 No | 購買人姓名 Buyer name |
| Tel_number | string | 否 No | 聯絡電話 Telephone |
| Mobile_number | string | 否 No | 行動電話 Mobile phone |
| Address | string | 否 No | 送貨地址 Delivery address |
| Logistics_store | string | 否 No | 取件門市 Pickup store |
| Email | string | 否 No | 電子信箱 Email |
| Invoice_name | string | 否 No | 發票抬頭 Invoice title |
| Invoice_num | string | 否 No | 統一編號 Tax ID |
| Remark | string | 否 No | 備註 Remark |
| Roturl | string | 否 No | 交易完成回傳網址 Transaction callback URL |
| Logistics_Roturl | string | 否 No | 物流資料接收網址 Logistics callback URL |
| Roturl_status | string | 否 No | 回送處理情形 Callback status |

**回傳值 Returns (SmilePayResponseData):**

| 欄位 Field | 類型 Type | 說明 Description |
|-----------|----------|-----------------|
| Status | string | 取號狀態 Status code |
| Desc | string | 描述 Description |
| Dcvc | string | 商家代號 Merchant code |
| SmilePayNO | string | SmilePay 追蹤碼 Tracking number |
| Data_id | string | 訂單編號 Order number |
| Amount | number | 金額 Amount |
| PayEndDate | string | 繳款截止期限 Payment deadline |
| AtmBankNo | string | ATM 銀行代碼 Bank code |
| AtmNo | string | ATM 虛擬帳號 Virtual account |
| Barcode1 | string | 條碼 1 Barcode 1 |
| Barcode2 | string | 條碼 2 Barcode 2 |
| Barcode3 | string | 條碼 3 Barcode 3 |
| IbonNo | string | ibon 繳費代碼 ibon payment code |
| FamiNo | string | 全家繳費代碼 FamiPort payment code |

### 列舉 Enums

#### EPayZG - 支付方式 Payment Methods

```typescript
enum EPayZG {
  VirtualAccountATM = 2,        // 虛擬帳號/ATM
  CVSBill = 3,                  // 超商帳單
  Ibon = 4,                     // 7-11 ibon
  FamiPort = 6,                 // FamiPort
  C2CPickupPayment = 51,        // C2C 取貨付款
  C2CPickupOnly = 52,           // C2C 純取貨
  B2CPickupPayment = 55,        // B2C 取貨付款
  B2CPickupOnly = 56,           // B2C 純取貨
  BlackCatCOD = 81,             // 黑貓貨到收現
  BlackCatDelivery = 82,        // 黑貓宅配
  BlackCatReverseLogistics = 83 // 黑貓逆物流
}
```

#### EPaySubzg - 物流公司 Logistics Companies

```typescript
enum EPaySubzg {
  SEVEN = '7NET',      // 統一超商 7-11
  TCAT = 'TCAT',       // 黑貓 T-Cat
  FAMIMART = 'FAMI'    // 全家 FamilyMart
}
```

#### SmilePayStatus - 狀態碼 Status Codes

常見狀態碼 Common status codes:
- `1`: 取號成功 Success
- `-2001`: 無參數碼及商家代號錯誤 Invalid merchant code
- `-2002`: 檢查碼錯誤 Invalid verification key
- `-2003`: 無付款模式 Missing payment method
- `-2005`: 無交易金額 Missing amount
- `-3001`: 無此商家代號 Merchant not found
- `-3003`: 商家未開啟此付款方式 Payment method not enabled

完整狀態碼請參考 [types.ts](src/types.ts)

For complete status codes, see [types.ts](src/types.ts)

## 錯誤處理 Error Handling

```typescript
try {
  const response = await smilePay.generate({
    Pay_zg: EPayZG.VirtualAccountATM,
    Amount: 1000,
    // ... 其他參數
  });
  
  // 成功處理
  console.log('支付成功:', response);
} catch (error) {
  // 錯誤處理
  if (error instanceof Error) {
    console.error('錯誤訊息:', error.message);
    
    // 可能的錯誤:
    // - "SmilePay error: 檢查碼錯誤"
    // - "SmilePay error: 無交易金額"
    // - "Failed to generate SmilePay"
  }
}
```

## 開發 Development

### 安裝依賴 Install Dependencies

```bash
pnpm install
```

### 建置專案 Build

```bash
pnpm run build
```

### 執行測試 Run Tests

```bash
pnpm test
```

## 授權 License

ISC

## 作者 Author

Whitey

## 相關連結 Links

- [GitHub Repository](https://github.com/ZWhitey/smilepay-payment)
- [npm Package](https://www.npmjs.com/package/smilepay-payment)
- [SmilePay 官方網站](https://www.smse.com.tw/)

## 貢獻 Contributing

歡迎提交 Issue 或 Pull Request！

Issues and Pull Requests are welcome!

## 注意事項 Notes

1. 請確保您已向 SmilePay 申請商家帳號並取得必要的金鑰 / Please ensure you have registered with SmilePay and obtained the necessary credentials
2. 測試環境與正式環境的設定可能不同 / Test and production environment settings may differ
3. 請妥善保管您的商家金鑰，不要將其提交至版本控制系統 / Keep your merchant credentials secure and do not commit them to version control
