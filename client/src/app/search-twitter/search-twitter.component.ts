import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpParams, HttpClient } from '@angular/common/http';
import { TwitterUserService } from '../twitter-user.service';

@Component({
  selector: 'search-twitter',
  templateUrl: './search-twitter.component.html',
  styleUrls: ['./search-twitter.component.css'],
})
export class SearchTwitterComponent{
  data: any = null;
  array: Array<any> = [0,0,0,0,0];
  twitterHandle: any = null;
  tweetsList: any = null;
  sentimentsList: Array<any> = [];
  item: any;
  emotion: any;
  constructor(private twitterService : TwitterUserService, public http : HttpClient){}


  onSubmit(form : NgForm) {
    this.data = null;
    this.array = [0,0,0,0,0];
    this.tweetsList = null;
    this.sentimentsList = [];

    this.twitterService.getTwitterHandle(form).subscribe(data=> {
      this.twitterHandle = data[0];
    });
    this.item = form.value.searchBar;
    this.open(this.item);
  }


  public open(item){

    this.twitterService.getTweets(item).subscribe(data => {
      this.tweetsList = data;
      var bestGuess;
      this.sentimentsList = [];
      for(let tweet of this.tweetsList){
        if(tweet.hasOwnProperty('retweeted_status')){
          this.twitterService.sentimentAnalysis(tweet.retweeted_status.full_text).subscribe(data => {
            var maxVal = 0;
            var bestGuess = "temp";
            var temp = JSON.parse(JSON.stringify(data));
            var keys = Object.keys(temp);
            for (var i = 0; i < keys.length; i++){
              var key = keys[i];
              if(maxVal < temp[key]){
                  maxVal = temp[key];
                  bestGuess = key;
              }

            }
            if(bestGuess == 'anger') this.array[0]+=1;
            else if(bestGuess == 'joy') this.array[1]+=1;
            else if(bestGuess == 'fear') this.array[2]+=1;
            else if(bestGuess == 'sadness') this.array[3]+=1;
            else this.array[4]+=1;
            this.sentimentsList.push(bestGuess);
            if(this.sentimentsList.length == this.tweetsList.length) {
              this.displayChart();
              this.HighestEmotion();
            }
          })

        }
        else{
          this.twitterService.sentimentAnalysis(tweet.full_text).subscribe(data => {
            var maxVal = 0;
            var bestGuess = "temp";
            var temp = JSON.parse(JSON.stringify(data));
            var keys = Object.keys(temp);

            for (var i = 0; i < keys.length; i++){
              var key = keys[i];
              if(maxVal < temp[key]){
                  maxVal = temp[key];
                  bestGuess = key;
              }

            }
            if(bestGuess == 'anger') this.array[0]+=1;
            else if(bestGuess == 'joy') this.array[1]+=1;
            else if(bestGuess == 'fear') this.array[2]+=1;
            else if(bestGuess == 'sadness') this.array[3]+=1;
            else this.array[4]+=1;
            this.sentimentsList.push(bestGuess);
            if(this.sentimentsList.length == this.tweetsList.length) {
              this.displayChart();
              this.HighestEmotion();
            }
          })
        }
      }
    });
  }

  displayChart(){
      this.data = {
      labels: ['anger','joy','fear', 'sadness', 'surprise'],
      datasets: [
          {
              data: [this.array[0],this.array[1],this.array[2],this.array[3],this.array[4]],
              hoverBackgroundColor: [
                "#FF1919",
                "#FFD032",
                "#C96A19",
                '#250396',
                '#035C07'
              ],
              backgroundColor: [
                  "#FF1919",
                  "#FFD032",
                  "#C96A19",
                  '#250396',
                  '#035C07'

              ]
          }]
      };
  }

  HighestEmotion(){
    var max = this.array.indexOf(Math.max(...this.array));
    if (max == 0) this.emotion = 'This person is a very very angry person.';
    else if (max == 1) this.emotion = 'Happy happy happy.';
    else if (max == 2) this.emotion = 'Why is this person so scared?';
    else if (max == 3) this.emotion = 'Very sad...';
    else if (max == 4) this.emotion = 'Wow! Surprising tweets everywhere!';
  }

}
