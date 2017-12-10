import { Injectable } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpParams, HttpClient } from '@angular/common/http';
@Injectable()
export class TwitterUserService {
  // usersList: any = null;
  // constructor(public twitterUsers: SearchTwitterComponent) {
  //   this.usersList = twitterUsers.usersList;
  //  }
  // getTwitterUsers(){
  //   return this.usersList;
  // }

  usersList: any = null;
  constructor(public http : HttpClient){}


  getTwitterHandle(form: NgForm){
    interface twitterUsers {
      data: any
    }
    let params = new HttpParams();
    params = params.append('searchBar', form.value.searchBar);
    return this.http.get<twitterUsers>('/api/search', {
      params: params
    });

  }

  getTweets(item){
    interface tweetsList{
      data: Array<any>
    }
    let params = new HttpParams();
    params = params.append('screen_name', item);
    // params = params.append('tweet_mode','extended');
    return this.http.get<tweetsList>('/api/tweets', {
      params: params
    });
  }

  sentimentAnalysis(tweet){
    interface sentiments{
      data: Array<any>
    }
    let params = new HttpParams();
    params = params.append('tweet', tweet);
    // params = params.append('tweet_mode','extended');
    return this.http.get<sentiments>('/api/sentiment', {
      params: params
    });
  }
}
