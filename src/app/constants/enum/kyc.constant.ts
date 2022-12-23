export const KYC={
    farmer:{
        back:"farmers"
    },
    reeler:{
        back:"reelers"
    },
    weaver:{
        back:"weavers"
    },
    retailer:{
        back:"retailers"
    }
}

export const VerificationType = [
  'MANUAL',
  // 'SYSTEM',
  'NOT_APPLICABLE'
];

export const CustomerTypesLookUp = {
    REELER:{
     apiEndPoint:'reeler',
     projection:'reelerProjection',
     keyNeedToBePrint:{
         profile:{
            id:'id',
            name:"name",
            phone:'phone',
            center:'centerName',
            'Customer Type':'customerTypeName'
         },
         Address:{
            address: "address,address",
            city: "address,city",
            district: "address,district",
            pincode: "address,pincode",
            state: "address,state"
         }
     }
    },
    FARMER:{
     apiEndPoint:'farmer',
     projection:'farmerProjection',
     keyNeedToBePrint:{
        profile:{
           id:'id',
           name:"name",
           phone:'phone',
           center:'centerName',
           'Customer Type':'customerTypeName'
        },
        Address:{
            address: "address,address",
            city: "address,city",
            district: "address,district",
            pincode: "address,pincode",
            state: "address,state"
        }
    }
    },
    WEAVER:{
        apiEndPoint:'weaver',
        projection:'weaverProjection',
        keyNeedToBePrint:{
           profile:{
              id:'id',
              name:"name",
              phone:'phone',
              center:'centerName',
              'Customer Type':'customerTypeName'
           },
           Address:{
               address: "address,address",
               city: "address,city",
               district: "address,district",
               pincode: "address,pincode",
               state: "address,state"
           }
       }
       },
       GINNER:{
        apiEndPoint:'ginner',
        projection:'ginnerProjection',
        keyNeedToBePrint:{
           profile:{
              id:'id',
              name:"name",
              phone:'phone',
              center:'centerName',
              'Customer Type':'customerTypeName'
           },
           Address:{
               address: "address,address",
               city: "address,city",
               district: "address,district",
               pincode: "address,pincode",
               state: "address,state"
           }
       }
       }
}
