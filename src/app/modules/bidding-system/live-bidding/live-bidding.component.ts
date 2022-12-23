import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiService } from 'src/app/services/api/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timer } from 'rxjs';
@Component({
  selector: 'app-live-bidding',
  templateUrl: './live-bidding.component.html',
  styleUrls: ['./live-bidding.component.scss']
})
export class LiveBiddingComponent implements OnInit {
  id;
  startTime: any;
  endTime:any;
  countdownTime: any;
  countDown: any;
  timedisplay: string;
  constructor(private route:ActivatedRoute,
    private firestore: AngularFirestore,
    private api:ApiService, 
    private ngxLoader:NgxUiLoaderService,
    private util:UtilsService,
    private router:Router,
    private snackBar:MatSnackBar,
    private _cd:ChangeDetectorRef
    ) { 
      const { id , status } = this.route.snapshot.params;
      this.id = id;
      if(status == 'COMPLETED'){
        this.getWinnerList()
      }else{
        this.getLiveBidResults();
      }
    }
    searchText:any='';
    res:any;
    tableHeaders:any=[
      {name:"Table",sort:true},
      {name:"Partition Id",sort:true},
      {name:"Lot ID",sort:true},
      {name:"Reeler",sort:true},
      {name:"Lot Weight",sort:true},
      {name:"Count Of Bids",sort:true},
      {name:"Min Bid Value",sort:true},
      // {name:"Avg Bid Value",sort:true},
      {name:"Max Bid Value",sort:true}
   ];
  ngOnInit(): void {
    this.firestore.collection('Users').valueChanges().subscribe(x=>console.log(x))
    this.getIndiduvalBiddibgDetails();
  }
  liveList = [];
  getLiveBidResults(){
    
    this.ngxLoader.stop();
    this.api.getLiveBids(this.id).then((res:any)=>{
      this.res = res;
      this.liveList = [];
    res.forEach((liveResult:any) => {

       this.liveList.push({
         "Table": 'T'+liveResult.table,
         "Partition Id": liveResult['id']['partitionId'] ? liveResult['id']['partitionId'] : '-',
         "Lot ID": liveResult['entityId'] ? liveResult['entityId'] : '-',
         "Lot Weight": liveResult['quantity'] ? liveResult['quantity'] : '-',
         "Reeler": liveResult?.name + '-' + liveResult?.phone,
         "Count Of Bids": liveResult['countOfBids'],
         "Min Bid Value": liveResult['minBidValue'],
        //  "Avg Bid Value": liveResult['avgBidValue'],
         "Max Bid Value": liveResult['maxBidValue'],
      });
    });
    this._cd.detectChanges();
    })
  }
  disableEndBidButn = true;
  getWinnerList(){
    this.disableEndBidButn = false;
    this.ngxLoader.stop();
    this.api.getWinnersOfBid(this.id).then((res:any)=>{
      if(res){
        this.liveList = [];
        res.forEach((winnerResult:any) => {
          this.liveList.push({
            "Table": 'T'+winnerResult.table,
            "Partition ID": winnerResult['id']['partitionId'] ?  winnerResult['id']['partitionId'] : '-',
            "Lot ID": winnerResult['entityId'] ? winnerResult['entityId'] : '-',
            "Reeler": winnerResult?.name + '-' + winnerResult?.phone,
            "Lot Weight": winnerResult['quantity'],
            "Count Of Bids": winnerResult['countOfBids'],
            "Min Bid Value": winnerResult['minBidValue'],
            // "Avg Bid Value": winnerResult['avgBidValue'],
            "Max Bid Value": winnerResult['maxBidValue'],
         });
       });
       this._cd.detectChanges();
      }
    })
  }
  endBidding(){
    this.api.endLiveBid(this.id).then(res=>{
      
      if(res['responseCode'] === 200){

        this.snackBar.open(res['message'], 'Ok', {
          duration: 3000
        });
        this.getWinnerList();

      } else {
        this.snackBar.open(res['message'], 'Ok', {
          duration: 3000
        });
      }
      const { id , status } = this.route.snapshot.params;
      this.router.navigate(['bid/live-bidding',id,status]);      
    })
  }

  getIndiduvalBiddibgDetails(){
    this.api.getBidDetails(this.id).then(res=>{
      this.startTime = res['startTime'];
      this.endTime = res['endTime'];   
      let interval = 1000;
      this.countdownTime =  setInterval(() => {
        let currentTime:any = new Date();
        let minutesrunning = new Date(this.endTime).getTime() - currentTime.getTime();   
        var hours:any = Math.floor((minutesrunning % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes:any = Math.floor((minutesrunning % (1000 * 60 * 60)) / (1000 * 60));
        var seconds:any = Math.floor((minutesrunning % (1000 * 60)) / 1000);   
        if (hours < 10) {hours = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        this.timedisplay = hours + "h:"+ minutes + " m: " +seconds + 's'         
        if (minutesrunning < 0) {          
          this.timedisplay = "Bid Ended"
          clearInterval(this.countdownTime);
          this._cd.detectChanges();
        }
        this._cd.detectChanges();
      }, interval);
    })
  }
}
