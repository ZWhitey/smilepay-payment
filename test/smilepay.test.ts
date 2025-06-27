import { SmilePay } from "../src/smilepay";

const Dcvc = "123";
const Rvg2c = "456";
const Verify_key = "789";

describe("smilepay", () => {
	test("should be defined", () => {
		const smilepay = new SmilePay({ Dcvc, Rvg2c, Verify_key });
		expect(smilepay).toBeDefined();
	});

	test("should parse XML response correctly", () => {
		const smilepay = new SmilePay({ Dcvc, Rvg2c, Verify_key });
		const xmlResponse = `
      <SmilePay>
        <Status>1</Status>
        <Desc>Succeeded</Desc>
        <Rvg2c>1</Rvg2c>
        <Dcvc>107</Dcvc>
        <SmilePayNO>00E0001000002913643</SmilePayNO>
        <Data_id></Data_id>
        <Amount>500</Amount>
        <AtmBankNo>004</AtmBankNo>
        <AtmNo>31905792913643</AtmNo>
      </SmilePay>
    `;
		const parsedResponse = smilepay.parseXMLResponse(xmlResponse);
		expect(parsedResponse).toMatchObject({
			Status: "1",
			Desc: "Succeeded",
			Rvg2c: "1",
			Dcvc: "107",
			SmilePayNO: "00E0001000002913643",
			Data_id: "",
			Amount: 500,
			AtmBankNo: "004",
			AtmNo: "31905792913643",
		});
	});

  test("should handle invalid response correctly", () => {
    const smilepay = new SmilePay({ Dcvc, Rvg2c, Verify_key });
    const xmlResponse = `
      <SmilePay
        <Status>-2001</Status>
        <Desc>無參數碼及商家代號錯誤</Desc>
      </SmilePay
    `;
    expect(() => {
      smilepay.parseXMLResponse(xmlResponse);
    }).toThrow("Invalid XML response format");
  });
});
