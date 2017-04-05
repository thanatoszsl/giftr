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

/* Giftr app write by Zed 2017/03/29  */
/*
1. claim two global variables, one for updating the local storage and other one for define different person.
2. a init function to define we are using phone or on page
3. if device is ready we should in contact people page and we can click the add button to ad person
4. next we should create a function for change page, we will use swich case here, there are two diierent situation one for people page and one for gift page. Defalut page is peopple page.
5. then we working on people page.















*/
 var app = {
     // idea from kai
     // temporary stroage list in JS part for updating the local storage data
     // we can find the index of the existing person for edit
     // we also can use this index to find the gift informaiton of the person have being clicked 
     localStorageList: {
         people: []
     }
     , clickedPerson: null
        
        
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
         window.addEventListener('push', app.pageChanged);
         // I give an id in html for the add person button this will be easier to type XD
         let getPersonBtn = document.getElementById("getBtn");
         getPersonBtn.addEventListener("touchstart", function (ev) {
             // first we set the clickedPerson to 0, we need it define user is editing or adding a person 
             app.clickedPerson = 0;
             console.log(app.clickedPerson);
             // make use modal window is clear then user can add information
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
             let getPersonBtn = document.getElementById("getBtn");
             getPersonBtn.addEventListener("touchstart", function (ev) {
                 app.clickedPerson = 0;
                 console.log(app.clickedPerson);
                 document.getElementById("name").value = "";
                 document.getElementById("dateOfBirth").value = "";
             });
             document.getElementById("btnSavePersonModal").addEventListener("touchend", app.savePerson);
             document.getElementById("btnCancelPersonModal").addEventListener("touchend", app.cancelPerson);
         app.showPeoplePage();
             break;
                 
         // gifts page
         case "gift-page":
             let getGiftBtn = document.getElementById("getBtnGift");
             getGiftBtn.addEventListener("touchstart", function(ev){
                 document.getElementById("idea").value = "";
                 document.getElementById("store").value = "";
                 document.getElementById("url").value = "";
                 document.getElementById("cost").value = "";
             });
             document.getElementById("btnSaveGiftModal").addEventListener("touchend", app.saveGift);
             document.getElementById("btnCancelGiftModal").addEventListener("touchend", app.cancelGift);
         app.showGiftPage();
             break;
         default:
             app.showPeoplePage();
         }
     }
     , showPeoplePage: function () {
         // find the contact-people page then clear it up before loading
         let listPeople = document.querySelector('#people-list');
         listPeople.innerHTML = "";
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
            
             
        // variables for find current date   
         let newDate = new Date();
         let currentMonth = (newDate.getMonth()+1).toString();
         let currentDay = newDate.getDate().toString();
         let numMonthDay = -1;
             if(newDate.getDate() < 10){
                numMonthDay = parseInt(currentDay)*100 + parseInt(currentDay);
               
             }else{
                 numMonthDay = parseInt(currentMonth+currentDay);
             }
//             if(person.monthDay < monthDayCurrentNum){
//                 li.classList.add("grey");
//             }
             
             
         // now we set a new attribute to determine user is editing or adding.
         
         // set attribute
             li.setAttribute("data-id", person.id);
             
         let nameSpan = document.createElement("span");
         let aModal = document.createElement("a");   
             nameSpan.className = "name";
             aModal.href = "#personModal";
             aModal.innerHTML = person.fullname;
             nameSpan.appendChild(a_modal);
             
             
         aModal.addEventListener("touchstart", function (ev) {
            // now we can get attribute from the html tag
             let aTemp = ev.currentTarget;
                 app.clickedPerson = aTemp.parentNode.parentNode.getAttribute("data-id"); 
            
            // if users are editing a person, this will keep the original data
                 document.getElementById("name").value = person.fullname;
                 document.getElementById("dateOfBirth").value = person.dateOfBirth;
             });
           
            
        
         let aChev = document.createElement("a");
             aChev.href = "gifts.html"; 
             aChev.className = "navigate-right pull-right goToGiftPage";
        
         aChev.addEventListener("touchstart", function (ev) {
         // we can get attribute from li html tag
             let aTemp = ev.currentTarget;
                 app.clickedPerson = aTemp.parentNode.getAttribute("data-id");
             });
             
        
         let spanDob = document.createElement("span");
             spanDob.className = "dob";
         let dateMoment = moment(person.dateOfBirth).format("MMMM D");
             spanDob.innerHTML = dateMoment;
             aChev.appendChild(spanDob);
             li.appendChild(nameSpan);
             li.appendChild(aChev);
             list.appendChild(li);
         });
     }
     , showGiftPage: function () {
         let listGift = document.getElementById("gift-list");
         list.innerHTML = "";
         app.localStorageList = JSON.parse(localStorage.getItem("giftr-zhou0121"));
         
         
         
         if (!app.localStorageList) {
             app.localStorageList = {
                 people: []
             };
         }
         
         
         
         let tempIndex = -1;
         for (var i = 0, len = app.localStorageList.people.length; i < len; i++) {
             if (app.clickedPerson == app.localStorageList.people[i].id) {
                 tempIndex = i;
                 break;
             }
         }
         
         
         
         // use person's name as the heading on gift page and modal window
         let nameHeadingPage = document.getElementById("name-heading");
         let nameHeadingModal = document.getElementById("headind-name-modal");
         nameHeadingPage.textContent = "Ideas for " + app.localStorageList.people[tempIndex].fullname;
         nameHeadingModal.textContent = "Buying a gift for " + app.localStorageList.people[tempIndex].fullname;
         
         for (var i = 0, len = app.localStorageList.people[tempIndex].ideas.length; i < len; i++) {
             let li = document.createElement("li");
             let span = document.createElement("span");
             li.className = "table-view-cell media";
             span.className = "pull-right icon icon-trash midline";
             span.setAttribute("gift-idea-id", app.localStorageList.people[tempIndex].ideas[i].id);
             span.addEventListener("touchend",function(ev){
                 let iconDelete = ev.currentTarget;
                 let idDelele = iconDelete.getAttribute("gift-idea-id");
                 let leng = app.localStorageList.people[tempIndex].ideas.length;
                 let itemIndexDelete = -1;
                 for(let i=0; i<len; i++){
                     if(idDelele == app.localStorageList.people[tempIndex].ideas[i].id){
                         itemIndexDelete = i;
                         
                         break;
                     } 
                 }
                 
                 if(itemIndexDelete > -1){
                     
                     app.localStorageList.people[tempIndex].ideas.splice(itemIndexDelete,1);
                     localStorage.setItem("giftr-zhou0121", JSON.stringify(app.localStorageList));
                     ev.currentTarget.parentElement.parentElement.removeChild(ev.currentTarget.parentElement);
                 }
                
                 
                 
             });
             
             let div = document.createElement("div");
             let a = document.createElement("a");
             let pstore = document.createElement("p");
             let pcost = document.createElement("p");
             let purl = document.createElement("p");
             div.className = "media-body";
             div.textContent = app.localStorageList.people[tempIndex].ideas[i].idea;
             a.href = "http://" + app.localStorageList.people[tempIndex].ideas[i].url;
             a.target = "_blank";
             a.innerHTML = app.localStorageList.people[tempIndex].ideas[i].url;
             pstore.textContent = app.localStorageList.people[tempIndex].ideas[i].at; 
             pcost.innerHTML = app.localStorageList.people[tempIndex].ideas[i].cost;
             purl.appendChild(a);
             div.appendChild(pstore);
             div.appendChild(purl);
             div.appendChild(pcost);
             li.appendChild(span);
             li.appendChild(div);
             list.appendChild(li);
         }
     }
     , saveGift: function () {
         // first we should find the which one is the person that users want to add gift 
         let tempIndexa = -1;
         for (var i = 0, len = app.localStorageList.people.length; i < len; i++) {
             if (app.clickedPerson == app.localStorageList.people[i].id) {
                 tempIndexa = i;
                 break;
             }
         } 
         let tempIdea = {
             id: Date.now()
             ,idea: document.getElementById("idea").value
             , at: document.getElementById("store").value
             , url: document.getElementById("url").value
             , cost: document.getElementById("cost").value
         };
         
         // here we can save the gift idea to localstorage
         if(document.getElementById("idea").value){
             app.localStorageList.people[tempIndexa].ideas.push(ideaEachTemp);
             localStorage.setItem("giftr-zhou0121", JSON.stringify(app.localStorageList));
         }
         var touchEndEv = new CustomEvent("touchend", {bubbles:true});
         var giftModalClose = document.getElementById("closeGiftModal");
         giftModalClose.dispatchEvent(touchEndEv);  

         app.showGiftPage();
     }
     , cancelGift: function () {
         var touchEndEv = new CustomEvent("touchend", {bubbles:true});
         var giftModalClose = document.getElementById("closeGiftModal");
         giftModalClose.dispatchEvent(touchEndEv);  
     }   
     , savePerson: function () {
          // adding new person, will also add a new element into the localstorage on js side
         if (app.clickedPerson == 0) {
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
             }    
         }
         else {
             // if users are editing existing person, updating the array into the localstorage on js side
             var clickedIndex = -1;
             // here we find the current lickedIndex by loop through the localStorageList.people
             for (var i = 0, len = app.localStorageList.people.length; i < len; i++) {
                 if (app.clickedPerson == app.localStorageList.people[i].id) {
                     clickedIndex = i;
                 }
             }
             
             
             
             
             app.localStorageList.people[clickedIndex].fullname = document.getElementById("name").value;
             app.localStorageList.people[clickedIndex].dateOfBirth = document.getElementById("dateOfBirth").value;
             
             // and now we should editing the monthDay
             var tempAr = document.getElementById("dateOfBirth").value.split("-");
             var monthDaySt = tempAr[1] + tempAr[2];
             app.localStorageList.people[clickedIndex].monthDay = parseInt(monthDaySt);
         }
         
         
         localStorage.setItem("giftr-gao00078", JSON.stringify(app.localStorageList));
        
         
         
         
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
    

 };
 app.init();
 