import axios from "axios";
import { XMLParser, XMLValidator } from "fast-xml-parser";

const API_URL = 'https://ssl.smse.com.tw/api/SPPayment.asp';
type SmilePayInput = {
	Dcvc: string; // 商家代號
	Rvg2c: string; // 參數碼
	Verify_key: string; // 檢查碼
	Od_sob?: string; // 消費項目
	Pay_zg?: number; // 收費模式 (int, 2位)
	Pay_subzg?: string; // 交付運送之超商或物流公司
	Data_id?: string; // 訂單號碼
	Deadline_date?: string; // 繳款截止期限 (格式: yyyy/mm/dd)
	Deadline_time?: string; // 繳款截止時間 (格式: HH:mm:ss)
	Amount?: number; // 金額
	Pur_name?: string; // 購買人姓名
	Tel_number?: string; // 聯絡電話
	Mobile_number?: string; // 行動電話
	Address?: string; // 送貨地址
	Logistics_store?: string; // 取件門市
	Email?: string; // 電子信箱
	Invoice_name?: string; // 發票抬頭
	Invoice_num?: string; // 統一編號
	Remark?: string; // 備註
	Roturl?: string; // 交易完成後要回送的位置
	Logistics_Roturl?: string; // 超商物流資料接收位置
	Roturl_status?: string; // 回送處理情形
};

type SmilePayResponse = {
	SmilePay: SmilePayResponseData;
};

type SmilePayResponseData = {
	Status: string; // 狀態碼
	Desc: string; // 狀態描述
	Rvg2c: string; // 參數碼
	Dcvc: string; // 商家代號
	SmilePayNO: string; // 交易編號
	Data_id: string; // 訂單號碼
	Amount: number; // 金額
	AtmBankNo: string; // ATM銀行代碼
	AtmNo: string; // ATM交易序號
};

enum SmilePayStatus {
  Succeeded = "1", // 取號成功
  DcvcOrRvg2cError = "-2001", // 無參數碼及商家代號錯誤
  VerifyKeyError = "-2002", // 檢查碼錯誤
  PayZgError = "-2003", // 無付款模式
  DeadlineDateOrTimeError = "-2004", // 日期格式錯誤
  AmountIsEmpty = "-2005", // 無交易金額
  C2CItemError = "-2006", // 7-11超商取貨付款相關參數錯誤
  OrderParameterError = "-2007", // 訂單參數錯誤(內容字數過多)
  TradingControlFail = "-2009", // SmielPay限制交易，無法建立訂單
  DcvcFail = "-3001", // 無此商家代號
  DcvcOffline = "-3002", // 商家使用期限已到期
  PayZgServiceStore = "-3003", // 商家未開啟此付款方式
  AmountFail = "-3004", // 超過付款模式設定金額
  PayZgServiceSmilePay = "-3005", // SmielPay關閉此付款方式
  AtmPaymentFail = "-4000", // 此銀行不提供ATM帳號
  GetIbonFamiportFail = "-4001", // 超商代碼取號錯誤
  SmseServiceFail = "-4002", // 簡訊服務忙錄中
  IbonServiceFail = "-4003", // ibon 服務忙錄中
  FamiportServiceFail = "-4004", // Fami 服務忙錄中
  SmseBalanceFail = "-4005", // 簡訊餘額不足
  SmseExecuteFail = "-5000", // Smse 執行錯誤
  IbonExecuteFail = "-5001", // ibon 執行錯誤
  FamiportExecuteFail = "-5002", // fami 執行錯誤
  C2CServiceFail = "-5003", // 7-11超商取貨付款 執行錯誤
  PaymentError = "-6001", // Payment error
  DataIdError = "-8001", // 『訂單編號』資料錯誤
  PurNameError = "-8002", // 『購買者姓名』資料錯誤
  AddressError = "-8004", // 『地址』資料錯誤
  MobileOrTelError = "-8005", // 『聯絡電話』、『行動電話』資料錯誤
  PackageSizeError = "-8006", // 『尺寸』資料錯誤
  TemperatureError = "-8007", // 『溫層』資料錯誤
  DateOrTimeError = "-8008", // 『日期/時段』資料錯誤
  RemarkError = "-8013", // 『備註』資料錯誤
  AmountError = "-8014", // 『金額』資料錯誤
  EzcatServiceError = "-8100", // 黑貓服務錯誤
}

const SmilePayStatusMessage: Record<SmilePayStatus, string> = {
  [SmilePayStatus.Succeeded]: "取號成功",
  [SmilePayStatus.DcvcOrRvg2cError]: "無參數碼及商家代號錯誤",
  [SmilePayStatus.VerifyKeyError]: "檢查碼錯誤",
  [SmilePayStatus.PayZgError]: "無付款模式",
  [SmilePayStatus.DeadlineDateOrTimeError]: "日期格式錯誤",
  [SmilePayStatus.AmountIsEmpty]: "無交易金額",
  [SmilePayStatus.C2CItemError]: "7-11超商取貨付款相關參數錯誤",
  [SmilePayStatus.OrderParameterError]: "訂單參數錯誤(內容字數過多)",
  [SmilePayStatus.TradingControlFail]: "SmielPay限制交易，無法建立訂單",
  [SmilePayStatus.DcvcFail]: "無此商家代號",
  [SmilePayStatus.DcvcOffline]: "商家使用期限已到期",
  [SmilePayStatus.PayZgServiceStore]: "商家未開啟此付款方式",
  [SmilePayStatus.AmountFail]: "超過付款模式設定金額",
  [SmilePayStatus.PayZgServiceSmilePay]: "SmielPay關閉此付款方式",
  [SmilePayStatus.AtmPaymentFail]: "此銀行不提供ATM帳號",
  [SmilePayStatus.GetIbonFamiportFail]: "超商代碼取號錯誤",
  [SmilePayStatus.SmseServiceFail]: "簡訊服務忙錄中",
  [SmilePayStatus.IbonServiceFail]: "ibon 服務忙錄中",
  [SmilePayStatus.FamiportServiceFail]: "Fami 服務忙錄中",
  [SmilePayStatus.SmseBalanceFail]: "簡訊餘額不足",
  [SmilePayStatus.SmseExecuteFail]: "Smse 執行錯誤",
  [SmilePayStatus.IbonExecuteFail]: "ibon 執行錯誤",
  [SmilePayStatus.FamiportExecuteFail]: "fami 執行錯誤",
  [SmilePayStatus.C2CServiceFail]: "7-11超商取貨付款 執行錯誤",
  [SmilePayStatus.PaymentError]: "Payment error",
  [SmilePayStatus.DataIdError]: "『訂單編號』資料錯誤",
  [SmilePayStatus.PurNameError]: "『購買者姓名』資料錯誤",
  [SmilePayStatus.AddressError]: "『地址』資料錯誤",
  [SmilePayStatus.MobileOrTelError]: "『聯絡電話』、『行動電話』資料錯誤",
  [SmilePayStatus.PackageSizeError]: "『尺寸』資料錯誤",
  [SmilePayStatus.TemperatureError]: "『溫層』資料錯誤",
  [SmilePayStatus.DateOrTimeError]: "『日期/時段』資料錯誤",
  [SmilePayStatus.RemarkError]: "『備註』資料錯誤",
  [SmilePayStatus.AmountError]: "『金額』資料錯誤",
  [SmilePayStatus.EzcatServiceError]: "黑貓服務錯誤",
};

export function getSmilePayStatusMessage(status: string): string | undefined {
  return SmilePayStatusMessage[status as SmilePayStatus];
}

export class SmilePay {
	Dcvc: string;
	Rvg2c: string;
	Verify_key: string;
	constructor({
		Dcvc,
		Rvg2c,
		Verify_key,
	}: { Dcvc: string; Rvg2c: string; Verify_key: string }) {
		this.Dcvc = Dcvc;
		this.Rvg2c = Rvg2c;
		this.Verify_key = Verify_key;
	}

	async generate(input: SmilePayInput) {
    try {
      const response = await axios.post(API_URL, input);
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const xmlResponse = response.data;
      const parsedResponse = this.parseXMLResponse(xmlResponse);
      if (parsedResponse.Status !== SmilePayStatus.Succeeded) {
        const errorMessage = getSmilePayStatusMessage(parsedResponse.Status);
        if (errorMessage) {
          throw new Error(`SmilePay error: ${errorMessage}`);
        } else {
          throw new Error(`Unknown SmilePay error: ${parsedResponse.Status}`);
        }
      }
      return parsedResponse;
    } catch (error) {
      console.error("Error generating SmilePay:", error);
      throw new Error("Failed to generate SmilePay");
    }
  }

	parseXMLResponse(xml: string) {
    const validResult = XMLValidator.validate(xml);
    if (validResult !== true && validResult?.err) {
      console.error("Invalid XML response format:", validResult.err);
      throw new Error("Invalid XML response format");
    }

		const parser = new XMLParser({
			parseTagValue: false,
			tagValueProcessor: (tagName, tagValue) => {
				if (tagName === "Amount") {
					return parseInt(tagValue, 10); // Convert Amount to integer
				}
			},
		});
		const result: SmilePayResponse = parser.parse(xml, true);
		return result.SmilePay;
	}
}
