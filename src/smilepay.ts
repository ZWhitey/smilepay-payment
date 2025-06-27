import axios from 'axios';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import _ from 'lodash';

import {
  getSmilePayStatusMessage,
  type SmilePayInput,
  type SmilePayResponse,
  SmilePayStatus,
} from './types.js';

const API_URL = 'https://ssl.smse.com.tw/api/SPPayment.asp';

export class SmilePay {
  Dcvc: string;
  Rvg2c: string;
  Verify_key: string;
  constructor({
    Dcvc,
    Rvg2c,
    Verify_key,
  }: {
    Dcvc: string;
    Rvg2c: string;
    Verify_key: string;
  }) {
    this.Dcvc = Dcvc;
    this.Rvg2c = Rvg2c;
    this.Verify_key = Verify_key;
  }

  async generate(input: SmilePayInput) {
    try {
      // 準備所有參數
      const params = {
        ...input,
        Dcvc: this.Dcvc,
        Rvg2c: this.Rvg2c,
        Verify_key: this.Verify_key,
      };

      // 將參數轉換成 querystring 格式
      const queryString = _.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        )
        .join('&');

      const response = await axios.post(API_URL, queryString, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
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
      console.error('Error generating SmilePay:', error);
      throw new Error('Failed to generate SmilePay');
    }
  }

  parseXMLResponse(xml: string) {
    const validResult = XMLValidator.validate(xml);
    if (validResult !== true && validResult?.err) {
      console.error('Invalid XML response format:', validResult.err);
      throw new Error('Invalid XML response format');
    }

    const parser = new XMLParser({
      parseTagValue: false,
      tagValueProcessor: (tagName, tagValue) => {
        if (tagName === 'Amount') {
          return parseInt(tagValue, 10); // Convert Amount to integer
        }
      },
    });
    const result: SmilePayResponse = parser.parse(xml, true);
    return result.SmilePay;
  }
}
