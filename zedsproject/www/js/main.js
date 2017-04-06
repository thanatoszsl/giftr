 /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* Giftr app write by Zed */
/*
1. claim two global variables, one for updating the local storage and other one for define different person.
2. a init function to define we are using phone or on page
3. if device is ready we should in contact people page and we can click the add button to ad person
4. next we should create a function for change page, we will use swich case here, there are two diierent situation one for people page and one for gift page. Defalut page is peopple page.
5. then we working save page, it has 3 steps, save gift, cancel save gift, and show the gift page.
6. do the same thing to people page.
*/
 var app = {
     // temporary stroage list in JS part for updating the local storage data
     // we can find the index of the existing person for edit
     // we also can use this index to find the gift informaiton of the person have being clicked 
     localStorageList: {
         people: []
     }
     , uniqueId: null
     
     
     , init: function () {
         if ('deviceready' in document) {
             document.addEventListener('deviceready', app.onDeviceReady);
         }
         else {
             document.addEventListener('DOMContentLoaded', app.onDeviceReady);
         }
     }
     
     
     , onDeviceReady: function () {
         // add a  event listeners for push events
         window.addEventListener('push', app.changePage);
         // I give an id in html for the add person button this will be easier to type XD
         var getBtnPerson = document.getElementById("getBtn");
         getBtnPerson.addEventListener("touchstart", function (ev) {
             app.uniqueId = 0;
             // make use modal window is clear then user can add information
             // clear the input fields when adding a new peronson in modal window
             document.getElementById("name").value = "";
             document.getElementById("dateOfBirth").value = "";
         });
         // add listeners for save and cancel button for modal window
         document.getElementById("btnSavePersonModal").addEventListener("touchend", app.savePerson);
         document.getElementById("btnCancelPersonModal").addEventListener("touchend", app.cancelPerson);
         app.showPeoplePage();
     }
     
     
     , changePage: function () {
         // this function is for paeg change
         // if user click the date of birth or the arrow it will link to gift.html page
         // if user click the back button on gift.html page it will link to index.html page 
         let divContent = document.querySelector(".content");
         let id = divContent.id;
         // two different situations
         switch (id) {
         // people contact page
         case "page-people":
             app.showPeoplePage();
             var getBtnPerson = document.getElementById("getBtn");
             getBtnPerson.addEventListener("touchstart", function (ev) {
                 app.uniqueId = 0;
                 document.getElementById("name").value = "";
                 document.getElementById("dateOfBirth").value = "";
             });
             document.getElementById("btnSavePersonModal").addEventListener("touchend", app.savePerson);
             document.getElementById("btnCancelPersonModal").addEventListener("touchend", app.cancelPerson);
             break;
                 
         // gifts page       
         case "page-gift":
             app.showGiftPage();
         // set values
             var getBtnGift = document.getElementById("getBtnGift");
             getBtnGift.addEventListener("touchstart", function(ev){
                 document.getElementById("idea").value = "";
                 document.getElementById("store").value = "";
                 document.getElementById("url").value = "";
                 document.getElementById("cost").value = "";
             });
             document.getElementById("btnSaveGiftModal").addEventListener("touchend", app.saveGift);
             document.getElementById("btnCancelGiftModal").addEventListener("touchend", app.cancelGift);
             break;
         default:
             app.showPeoplePage();
         }
     }
     
     
     , saveGift: function () {
        
         let eachIdea = {
             id: Date.now()
             , idea: document.getElementById("idea").value
             , at: document.getElementById("store").value
             , url: document.getElementById("url").value
             , cost: document.getElementById("cost").value
         };  
         var indexTemp = -1;
         for (var i = 0, len = app.localStorageList.people.length; i < len; i++) {
             if (app.uniqueId == app.localStorageList.people[i].id) {
                 indexTemp = i;
                 break;
             }
         }   
         // here we can save the gift idea to localstorage
         if(document.getElementById("idea").value){
             app.localStorageList.people[indexTemp].ideas.push(eachIdea);
             localStorage.setItem("giftr-zhou0121", JSON.stringify(app.localStorageList));
         }else{
         };
         // combine touch event to the button
         var touchEndEv = new CustomEvent("touchend", {bubbles:true});
         var giftModalClose = document.getElementById("closeGiftModal");
         giftModalClose.dispatchEvent(touchEndEv);  

         app.showGiftPage();
     }
     
     
     , cancelGift: function () {
         var touchEndEv = new CustomEvent("touchend", {bubbles:true});
         var giftModalClose = document.getElementById("giftModalClose");
         giftModalClose.dispatchEvent(touchEndEv);  
     }
     
     
     , showGiftPage: function () {
         let list = document.getElementById("gift-list");
         list.innerHTML = "";
         app.localStorageList = JSON.parse(localStorage.getItem("giftr-zhou0121"));
         if (!app.localStorageList) {
             app.localStorageList = {
                 people: []
             };
         }
         
        // find wich person we are working on
         var indexTemp = -1;
         for (var i = 0, len = app.localStorageList.people.length; i < len; i++) {
             if (app.uniqueId == app.localStorageList.people[i].id) {
                 indexTemp = i;
                 break;
             }
         }
         // headings
         let headingPageGift = document.getElementById("name-heading");
         let headingModalgift = document.getElementById("headind-name-modal");
         headingPageGift.textContent = "Ideas for " + app.localStorageList.people[indexTemp].fullname;
         headingModalgift.textContent = "Buying a gift for " + app.localStorageList.people[indexTemp].fullname;
         
         // use person's name as the heading on gift page and modal window
         for (var i = 0, len = app.localStorageList.people[indexTemp].ideas.length; i < len; i++) {
             let li = document.createElement("li");
             let span = document.createElement("span");
             li.className = "table-view-cell media";
             span.className = "pull-right icon icon-trash midline";
             span.setAttribute("gift-idea-id", app.localStorageList.people[indexTemp].ideas[i].id);
             span.addEventListener("touchend",function(ev){
                 let iconDelete = ev.currentTarget;
                 let iDelete = iconDelete.getAttribute("gift-idea-id");
                 let len = app.localStorageList.people[indexTemp].ideas.length;
                 let indexDeleteItem = -1;
                 for(let i=0; i<len; i++){
                     if(iDelete == app.localStorageList.people[indexTemp].ideas[i].id){
                         indexDeleteItem = i;
                         
                         break;
                     } 
                 }
                 
                 if(indexDeleteItem > -1){
                     app.localStorageList.people[indexTemp].ideas.splice(indexDeleteItem,1);
                     localStorage.setItem("giftr-zhou0121", JSON.stringify(app.localStorageList));
                     ev.currentTarget.parentElement.parentElement.removeChild(ev.currentTarget.parentElement);
                 }
                
                 
                 
             });
             
             let div = document.createElement("div");
             div.className = "media-body";
             div.textContent = app.localStorageList.people[indexTemp].ideas[i].idea;
             
             let pstore = document.createElement("p");
             pstore.textContent = app.localStorageList.people[indexTemp].ideas[i].at;
             
             let purl = document.createElement("p");
             
             let a = document.createElement("a");
             a.href = "http://" + app.localStorageList.people[indexTemp].ideas[i].url;
             a.target = "_blank";
             a.innerHTML = app.localStorageList.people[indexTemp].ideas[i].url; 
             
             let pcost = document.createElement("p");
             // appendchilds
             purl.appendChild(a);
             pcost.innerHTML = app.localStorageList.people[indexTemp].ideas[i].cost;
             div.appendChild(pstore);
             div.appendChild(purl);
             div.appendChild(pcost);
             li.appendChild(span);
             li.appendChild(div);
             list.appendChild(li);
         }
     }
     
     
     , savePerson: function () {
         // adding new person, will also add a new element into the localstorage on js side
         if (app.uniqueId == 0) {
              // here we create monthDay for sorting
             var tempAr = document.getElementById("dateOfBirth").value.split("-");
             var monthDayString = tempAr[1] + tempAr[2];
             let temPerson = {
                 id: Date.now()
                 , fullname: document.getElementById("name").value
                 , dateOfBirth: document.getElementById("dateOfBirth").value
                 , monthDay: parseInt(monthDayString)
                 , ideas: []
             };
              
             if(temPerson.fullname && temPerson.dateOfBirth){
                 app.localStorageList.people.push(temPerson);    
             }else{}
         }
         else {
              // if users are editing existing person, updating the array into the localstorage on js side
             var clickedIndex = -1;
              // here we find the current lickedIndex by loop through the localStorageList.people
             for (var i = 0, len = app.localStorageList.people.length; i < len; i++) {
                 if (app.uniqueId == app.localStorageList.people[i].id) {
                     clickedIndex = i;
                 }
             } 
             app.localStorageList.people[clickedIndex].fullname = document.getElementById("name").value;
             app.localStorageList.people[clickedIndex].dateOfBirth = document.getElementById("dateOfBirth").value;
             
             // and now we should editing the monthDay
             var tempAr = document.getElementById("dateOfBirth").value.split("-");
             var monthDayString = tempAr[1] + tempAr[2];
             app.localStorageList.people[clickedIndex].monthDay = parseInt(monthDayString);
         }
         localStorage.setItem("giftr-zhou0121", JSON.stringify(app.localStorageList));
        
         
         var touchEndEv = new CustomEvent("touchend", {bubbles:true});
         var personModalClose = document.getElementById("closePersonModal"); 
         personModalClose.dispatchEvent(touchEndEv);  
         
         
         
         
         app.showPeoplePage();
     }
     
     
     , cancelPerson: function () {
         var touchEndEv = new CustomEvent("touchend", {bubbles:true});
         var personModalClose = document.getElementById("closePersonModal"); 
         personModalClose.dispatchEvent(touchEndEv);   
     }
     
     
     , showPeoplePage: function () {
         // find the contact-people page then clear it up before loading
         let list = document.querySelector('#contact-list');
         list.innerHTML = "";
         // localstorage, set a new array to local storage if it is empty
         app.localStorageList = JSON.parse(localStorage.getItem("giftr-zhou0121"));
         if (!app.localStorageList) {
             app.localStorageList = {
                 people: []
             };
         }else{
             app.localStorageList.people.sort(function(a,b){
                 return a.monthDay - b.monthDay;
             });
             
         }
         app.localStorageList.people.forEach(function (person) {

         let li = document.createElement("li");
             li.className = "table-view-cell";
        
        // find current date  
        var newDate = new Date();
        var currentMoth = (newDate.getMonth()+1).toString();
        var currentDay = newDate.getDate().toString();
        var montheDN = -1;
               if(newDate.getDate() < 10){
                montheDN = parseInt(currentMoth)*100 + parseInt(currentDay);
               
             }else{
                 montheDN = parseInt(currentMoth+currentDay);
             }
                 
         // now we set a new attribute to determine user is editing or adding.
         
         // set attribute
              li.setAttribute("data-id", person.id);
             
        let nameSpan = document.createElement("span"); 
        let modalA = document.createElement("a");
             nameSpan.className = "name";
             modalA.href = "#personModal";
             modalA.innerHTML = person.fullname;
             nameSpan.appendChild(modalA);
             
             
        modalA.addEventListener("touchstart", function (ev) {
               // now we can get attribute from the html tag   
            var aTemp = ev.currentTarget;
                 app.uniqueId = aTemp.parentNode.parentNode.getAttribute("data-id"); //get attribute from li html tag
               // if users are editing a person, this will keep the original data
                 document.getElementById("name").value = person.fullname;
                 document.getElementById("dateOfBirth").value = person.dateOfBirth;
             });
             
            // arrow atage 
        let arrow = document.createElement("a");
             arrow.href = "gifts.html"; 
             arrow.className = "navigate-right pull-right goToGiftPage";
             arrow.addEventListener("touchstart", function (ev) {
                 var aTemp = ev.currentTarget;
                 app.uniqueId = aTemp.parentNode.getAttribute("data-id"); //get attribute from li html tag
             });
        
        let dobSpan = document.createElement("span");
        let dateToMoment = moment(person.dateOfBirth).format("MMMM D");
             dobSpan.className = "dob";
             dobSpan.innerHTML = dateToMoment;
             arrow.appendChild(dobSpan);
             li.appendChild(nameSpan);
             li.appendChild(arrow);
             list.appendChild(li);
         });
     }

 };
 app.init();
