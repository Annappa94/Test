import { Injectable } from '@angular/core';
import { AnyAaaaRecord } from 'dns';
// import * as CryptoJS from 'crypto-js';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  tempValueData: any = false;
  cottonData:any = false;
  sellCocoon = false;
  buyCoCoon = false;
  tempOrderData: any;
  salesOrderReturnObj = {};
  v4Roles = ['ADMINISTRATOR','RetailSalesAgent', 'RetailSalesManager', 'RetailSourcingAgent', 'RetailSourcingManager', 'LogisticsManager'];
  v3Roles = ['ADMINISTRATOR', 'YOperationsAgent', 'YOperationsManager'];
  v2Roles = ['ADMINISTRATOR', 'COperationsAgent','COCOON_PROCUREMENT_EXEC','COCOON_SALES_EXEC', 'COperationsManager','COCOON_PROCUREMENT_MANAGER',  'COCOON_SALES_MANAGER', 'CCenterAgent', 'CCenterManager','FarmInputAgent','FarmInputManager', 'CottonAgent','CottonManager','PupaeAgent','PupaeManager'];
  v1Roles = ['ADMINISTRATOR', 'COperationsAgent', 'COCOON_PROCUREMENT_EXEC','COCOON_SALES_EXEC', 'COperationsManager','COCOON_PROCUREMENT_MANAGER',  'COCOON_SALES_MANAGER', 'CCenterAgent', 'CCenterManager','FarmInputAgent','FarmInputManager', 'CottonAgent','CottonManager','PupaeAgent','PupaeManager'];
  cottonRoles = ['ADMINISTRATOR','CottonAgent','CottonManager'];
  pupaeRoles = ['ADMINISTRATOR','PupaeAgent','PupaeManager'];
  cottonBales = ['CottonManager'];
  merchandiserRoles = ['Merchandiser'];
  businessHeadRoles = ['BusinessHead'];
  
  getJwtUser(token) {
    const jwtData = token.split('.')[1];
    const decodedJwtJsonData = window.atob(jwtData);
    const userData = JSON.parse(decodedJwtJsonData);

    return userData;
  }
  getEncrypted(data) {
    // const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), environment.CRYPTO_KEY).toString();

    // return encrypted;
  }
  getDecrypted(data) {
    try {
      // const bytes = CryptoJS.AES.decrypt(data, environment.CRYPTO_KEY);
      // const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      // return decrypted;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  getEncryptedHex(data) {
    // const b64 = CryptoJS.AES.encrypt(JSON.stringify(data), environment.CRYPTO_KEY).toString();
    // const e64 = CryptoJS.enc.Base64.parse(b64);
    // const eHex = e64.toString(CryptoJS.enc.Hex);
    // return eHex;
  }
  getDecryptedHex(cipherText) {
    try {
      // const reb64 = CryptoJS.enc.Hex.parse(cipherText);
      // const bytes = reb64.toString(CryptoJS.enc.Base64);
      // const decrypt = CryptoJS.AES.decrypt(bytes, environment.CRYPTO_KEY);
      // const decrypted = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
      // return decrypted;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  tempValue(value) {
    this.tempValueData = value;
  }
  twistingData:any = false;
  twistingValue(type,order){
    this.twistingData={};
    this.twistingData['type'] = type;
    this.twistingData['order'] = order;
    
  }
  globalFarmLotData;
  
farmerLotData(value){
this.globalFarmLotData = value;

}
  getDisplayCocoonType(type){
    switch(type) {
      case 'SEEDCOCOON': 
      return 'Bivoltine Seed';

      case 'CBGOLD': 
      return 'CB Gold';

      case 'BIVOLTINE': 
      return 'Bivoltine Hybrid';

      case 'TUSSAR': 
      return 'TUSSAR';

      default:
        return '-';

    }
  }

  getDisplayYarnTwistedType(type) {
    switch (type) {
      case 'Warp':
        return 'Warp'

      case 'Weft2ply':
        return 'Weft-2ply';

      case 'Weft3ply':
        return 'Weft-3ply';
      
      case 'Weft4ply':
        return 'Weft-4ply';

      case 'Weft5ply':
        return 'Weft-5ply';

      case 'Weft6ply':
        return 'Weft-6ply';

      case 'Warp2ply':
        return 'Warp-2ply';

      case 'Warp3ply':
        return 'Warp-3ply';

      case 'Warp3ply':
        return 'Warp-3ply';

      case 'OPEN_END_CARDED ':
        return 'Open end carded';

      case 'OPEN_END_COMBED':
        return 'Open end combed';

      case 'OPEN_END_SEMI_COMBED':
        return 'Open end semi combed';

      case 'RING_SPUN_CARDED':
        return 'Ring spun carded';

      case 'RING_SPUN_SEMI_COMBED':
        return 'Ring spun semi combed';

      case 'RING_SPUN_COMBED':
        return 'Ring spun combed';

      case 'MVS_YARN':
        return 'Mvs yarn';

      default:
        return '-';
    }
  }

  getDisplayCoconGrade(grade) {
    switch (grade) {
      case 'A':
      return 'A';

      case 'B':
      return 'B';

      case 'C':
      return 'C';

      case 'JHILLI':
      return 'Cocoon Jhilli';

      case 'DOUBLECOCOON':
      return 'Double Cocoon';

      case 'CUTCOCOON':
      return 'Cut Cocoon';

      case 'CHOPA':
      return 'Chopa';

      case 'FRESH':
      return 'Fresh';
        
      default:
        return '-';
    }
  }

  getDisplayYarnCocoonType(grade) {
    switch (grade) {
      case 'CBGold':
        return 'CB Gold';

      case 'BVWhite':
        return 'BV White';

      case 'ARMWhite':
        return 'ARM White';

      case 'ChinaWhite':
        return 'China White';

      case 'Tussar':
        return 'Tussar'

      case 'Dupion':
        return 'Dupion';

      case 'Vietnam':
        return 'Vietnam';

      case 'VISCOSE_YARN':
        return 'Viscose yarn';

      case 'COTTON_YARN':
        return 'Cotton yarn';

      case 'COTTON_GASSED_YARN':
        return 'Cotton gassed yarn';

      case 'COTTON_GASSED_MERCERISED_YARN':
        return 'Cotton gassed Mercerised yarn';

      case 'COTTON_GASSED_MERCERISED_DYED_YARN':
        return 'Cotton gassed Mercerised yarn';

      case 'LINEN_YARN':
        return 'Linen yarn';

      default:
        return '-';
    }
  }

  getDisplayChawkiEquipments(eqp) {

    switch (eqp) {
      case 'CRStands' :
      return 'CR Stands';

      case 'RearingTrays' :
      return 'Rearing Trays';

      case 'Sprayer' :
      return 'Sprayer';

      case 'Humidifier' :
      return 'Humidifier';

      case 'LeafChoppingDevice' :
      return 'Leaf Chopping Device';

      case 'RoomHeater' :
      return 'Room Heater';

      case 'IncubationFrame' :
      return 'Incubation Frame';

      case 'BrushingNets' :
      return 'Brushing Nets';

      case 'BedCleaningNets' :
      return 'Bed Cleaning Nets';

      case 'Microscope' :
      return 'Microscope';

      case 'FeedingStands' :
      return 'Feeding Stands';

      case 'IronStandWithBasin' :
      return 'Iron Stand with Basin';

      case 'DisinectionMask' :
      return 'Disinection Mask';

      case 'WetAndDryBulbThermometer' :
      return 'Wet and Dry bulb thermometer';

      case 'FlameGunWithCylinder' :
      return 'Flame gun with cylinder';

      case 'LeafChoppingDevice' :
      return 'Leaf Chopping Device';

      default:
        return '-';

    }
  }

  getDisplayFollowupType(type) {
    if(type.toUpperCase() == 'PURCHASE_FROM_RM') {
      return 'Purchase from RM';
    } else if(type.toUpperCase() == 'SALE_TO_RM') {
      return 'Sale to RM'
    } 
    else if(type.toUpperCase() == 'APP_FOLLOWUP') {
      return 'App Followup'
    } 
    else if(type.toUpperCase() == 'App_Followup_ReshaMudra') {
      return 'App Reshamudra'
    } 
    else return type;
  }
}
