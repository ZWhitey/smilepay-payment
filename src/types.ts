export enum EPayZG {
  /** 虛擬帳號/ATM */
  VirtualAccountATM = 2,
  /** 超商帳單 */
  CVSBill = 3,
  /** 7-11 ibon */
  Ibon = 4,
  /** FamiPort */
  FamiPort = 6,
  /** C2C取貨付款 */
  C2CPickupPayment = 51,
  /** C2C純取貨 */
  C2CPickupOnly = 52,
  /** B2C取貨付款 */
  B2CPickupPayment = 55,
  /** B2C純取貨 */
  B2CPickupOnly = 56,
  /** 黑貓貨到收現 */
  BlackCatCOD = 81,
  /** 黑貓宅配 */
  BlackCatDelivery = 82,
  /** 黑貓逆物流 */
  BlackCatReverseLogistics = 83,
}

/**
 * 交付運送之超商或物流公司枚舉
 */
export enum EPaySubzg {
  /** 統一超商 */
  SEVEN = '7NET',
  /** 黑貓*/
  TCAT = 'TCAT',
  /** 全家 */
  FAMIMART = 'FAMI',
}

/**
 * SmilePay 請求參數型別
 * @property Od_sob 消費項目，例如：貨品名稱或貨品編號，使用超商取貨付款時為必要欄位
 * @property Pay_zg 收費模式 (int, 2位)
 * @property Pay_subzg 交付運送之超商或物流公司
 * @property Data_id 訂單號碼
 * @property Deadline_date 繳款截止期限 (格式: yyyy/mm/dd)
 * @property Deadline_time 繳款截止時間 (格式: HH:mm:ss)
 * @property Amount 金額
 * @property Pur_name 購買人姓名
 * @property Tel_number 聯絡電話
 * @property Mobile_number 行動電話
 * @property Address 送貨地址
 * @property Logistics_store 取件門市
 * @property Email 電子信箱
 * @property Invoice_name 發票抬頭
 * @property Invoice_num 統一編號
 * @property Remark 備註
 * @property Roturl 交易完成後要回送的位置
 * @property Logistics_Roturl 超商物流資料接收位置
 * @property Roturl_status 回送處理情形
 */
export type SmilePayInput = {
  /** 消費項目 例如：貨品名稱或貨品編號，使用超商取貨付款時為必要欄位 */
  Od_sob?: string;
  /** 收費模式 */
  Pay_zg?: EPayZG;
  /** 交付運送之超商或物流公司 */
  Pay_subzg?: EPaySubzg;
  /** 訂單號碼 */
  Data_id?: string;
  /** 繳款截止期限 (格式: yyyy/mm/dd) */
  Deadline_date?: string;
  /** 繳款截止時間 (格式: HH:mm:ss) */
  Deadline_time?: string;
  /** 金額 */
  Amount?: number;
  /** 購買人姓名 */
  Pur_name?: string;
  /** 聯絡電話 */
  Tel_number?: string;
  /** 行動電話 */
  Mobile_number?: string;
  /** 送貨地址 */
  Address?: string;
  /** 取件門市 */
  Logistics_store?: string;
  /** 電子信箱 */
  Email?: string;
  /** 發票抬頭 */
  Invoice_name?: string;
  /** 統一編號 */
  Invoice_num?: string;
  /** 備註 */
  Remark?: string;
  /** 交易完成後要回送的位置 */
  Roturl?: string;
  /** 超商物流資料接收位置 */
  Logistics_Roturl?: string;
  /** 回送處理情形 */
  Roturl_status?: string;
};

/**
 * SmilePay 回應型別
 */
export type SmilePayResponse = {
  SmilePay: SmilePayResponseData;
};

/**
 * SmilePay 回應資料型別
 */
export type SmilePayResponseData = {
  /** 狀態碼 */
  Status: string;
  /** 狀態描述 */
  Desc: string;
  /** 參數碼 */
  Rvg2c: string;
  /** 商家代號 */
  Dcvc: string;
  /** 交易編號 */
  SmilePayNO: string;
  /** 訂單號碼 */
  Data_id: string;
  /** 金額 */
  Amount: number;
  /** ATM銀行代碼 */
  AtmBankNo: string;
  /** ATM交易序號 */
  AtmNo: string;
};

/**
 * SmilePay 狀態碼枚舉
 */
export enum SmilePayStatus {
  /** 取號成功 */
  Succeeded = '1',
  /** 無參數碼及商家代號錯誤 */
  DcvcOrRvg2cError = '-2001',
  /** 檢查碼錯誤 */
  VerifyKeyError = '-2002',
  /** 無付款模式 */
  PayZgError = '-2003',
  /** 日期格式錯誤 */
  DeadlineDateOrTimeError = '-2004',
  /** 無交易金額 */
  AmountIsEmpty = '-2005',
  /** 7-11超商取貨付款相關參數錯誤 */
  C2CItemError = '-2006',
  /** 訂單參數錯誤(內容字數過多) */
  OrderParameterError = '-2007',
  /** SmielPay限制交易，無法建立訂單 */
  TradingControlFail = '-2009',
  /** 無此商家代號 */
  DcvcFail = '-3001',
  /** 商家使用期限已到期 */
  DcvcOffline = '-3002',
  /** 商家未開啟此付款方式 */
  PayZgServiceStore = '-3003',
  /** 超過付款模式設定金額 */
  AmountFail = '-3004',
  /** SmielPay關閉此付款方式 */
  PayZgServiceSmilePay = '-3005',
  /** 此銀行不提供ATM帳號 */
  AtmPaymentFail = '-4000',
  /** 超商代碼取號錯誤 */
  GetIbonFamiportFail = '-4001',
  /** 簡訊服務忙錄中 */
  SmseServiceFail = '-4002',
  /** ibon 服務忙錄中 */
  IbonServiceFail = '-4003',
  /** Fami 服務忙錄中 */
  FamiportServiceFail = '-4004',
  /** 簡訊餘額不足 */
  SmseBalanceFail = '-4005',
  /** Smse 執行錯誤 */
  SmseExecuteFail = '-5000',
  /** ibon 執行錯誤 */
  IbonExecuteFail = '-5001',
  /** fami 執行錯誤 */
  FamiportExecuteFail = '-5002',
  /** 7-11超商取貨付款 執行錯誤 */
  C2CServiceFail = '-5003',
  /** Payment error */
  PaymentError = '-6001',
  /** 『訂單編號』資料錯誤 */
  DataIdError = '-8001',
  /** 『購買者姓名』資料錯誤 */
  PurNameError = '-8002',
  /** 『地址』資料錯誤 */
  AddressError = '-8004',
  /** 『聯絡電話』、『行動電話』資料錯誤 */
  MobileOrTelError = '-8005',
  /** 『尺寸』資料錯誤 */
  PackageSizeError = '-8006',
  /** 『溫層』資料錯誤 */
  TemperatureError = '-8007',
  /** 『日期/時段』資料錯誤 */
  DateOrTimeError = '-8008',
  /** 『備註』資料錯誤 */
  RemarkError = '-8013',
  /** 『金額』資料錯誤 */
  AmountError = '-8014',
  /** 黑貓服務錯誤 */
  EzcatServiceError = '-8100',
}

/**
 * SmilePay 狀態碼對應訊息映射表
 */
const SmilePayStatusMessage: Record<SmilePayStatus, string> = {
  [SmilePayStatus.Succeeded]: '取號成功',
  [SmilePayStatus.DcvcOrRvg2cError]: '無參數碼及商家代號錯誤',
  [SmilePayStatus.VerifyKeyError]: '檢查碼錯誤',
  [SmilePayStatus.PayZgError]: '無付款模式',
  [SmilePayStatus.DeadlineDateOrTimeError]: '日期格式錯誤',
  [SmilePayStatus.AmountIsEmpty]: '無交易金額',
  [SmilePayStatus.C2CItemError]: '7-11超商取貨付款相關參數錯誤',
  [SmilePayStatus.OrderParameterError]: '訂單參數錯誤(內容字數過多)',
  [SmilePayStatus.TradingControlFail]: 'SmielPay限制交易，無法建立訂單',
  [SmilePayStatus.DcvcFail]: '無此商家代號',
  [SmilePayStatus.DcvcOffline]: '商家使用期限已到期',
  [SmilePayStatus.PayZgServiceStore]: '商家未開啟此付款方式',
  [SmilePayStatus.AmountFail]: '超過付款模式設定金額',
  [SmilePayStatus.PayZgServiceSmilePay]: 'SmielPay關閉此付款方式',
  [SmilePayStatus.AtmPaymentFail]: '此銀行不提供ATM帳號',
  [SmilePayStatus.GetIbonFamiportFail]: '超商代碼取號錯誤',
  [SmilePayStatus.SmseServiceFail]: '簡訊服務忙錄中',
  [SmilePayStatus.IbonServiceFail]: 'ibon 服務忙錄中',
  [SmilePayStatus.FamiportServiceFail]: 'Fami 服務忙錄中',
  [SmilePayStatus.SmseBalanceFail]: '簡訊餘額不足',
  [SmilePayStatus.SmseExecuteFail]: 'Smse 執行錯誤',
  [SmilePayStatus.IbonExecuteFail]: 'ibon 執行錯誤',
  [SmilePayStatus.FamiportExecuteFail]: 'fami 執行錯誤',
  [SmilePayStatus.C2CServiceFail]: '7-11超商取貨付款 執行錯誤',
  [SmilePayStatus.PaymentError]: 'Payment error',
  [SmilePayStatus.DataIdError]: '『訂單編號』資料錯誤',
  [SmilePayStatus.PurNameError]: '『購買者姓名』資料錯誤',
  [SmilePayStatus.AddressError]: '『地址』資料錯誤',
  [SmilePayStatus.MobileOrTelError]: '『聯絡電話』、『行動電話』資料錯誤',
  [SmilePayStatus.PackageSizeError]: '『尺寸』資料錯誤',
  [SmilePayStatus.TemperatureError]: '『溫層』資料錯誤',
  [SmilePayStatus.DateOrTimeError]: '『日期/時段』資料錯誤',
  [SmilePayStatus.RemarkError]: '『備註』資料錯誤',
  [SmilePayStatus.AmountError]: '『金額』資料錯誤',
  [SmilePayStatus.EzcatServiceError]: '黑貓服務錯誤',
};

/**
 * 根據狀態碼取得對應的狀態訊息
 * @param status - SmilePay 狀態碼
 * @returns 對應的狀態訊息，如果找不到對應的狀態碼則回傳 undefined
 */
export function getSmilePayStatusMessage(status: string): string | undefined {
  return SmilePayStatusMessage[status as SmilePayStatus];
}
