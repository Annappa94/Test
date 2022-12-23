export interface PersonaDetails {
    amount:{
      total:String,
      paid:String,
      pending:String,
      advanceAmount:String
    },
   date:{
    startDate:String,
    modifiedDate:String,
   },
   progress:number,
   creator: String,
   currentOwner:String,
   address:{},
   personaName:String,
   presonaId:number,
   personaPhone:number,
   personaImageUrl:String
   personaAddress:String,
   skuType:String,
   transitionReject:String,
   businessType:String,
   remarks: String,
   rmRepresentativeName: String,
   merchandiserName: String,
   subBusinessType: String,
   rejectReasonsStr: String
}


export interface OrderDetails {
  date:String,
  description:String
}


export interface docs{
  title:String,
  docUrl:String,
  receiptName:String,
}