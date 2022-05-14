function getInputVal(id){
  return document.getElementById(id).value;
}

//sees which radio button has been checked
function getRadioVal(form, name) {
    var val;
    // get list of radio buttons with specified name
    var radios = form.elements[name];
    // loop through list of radio buttons
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) { // radio checked?
            val = radios[i].value; // if so, hold its value in val
            break; // and break out of for loop
        }
    }
    return val; // return value of checked radio or undefined if none checked
}

// See which languages have been checked
function getCheckedBoxes(chkboxName) {
  var checkboxes = document.getElementsByName(chkboxName);
  var checkboxesChecked = [];
  // loop over them all
  for (var i=0; i<checkboxes.length; i++) {
     // And stick the checked ones onto an array...
     if (checkboxes[i].checked) {
        if (checkboxes[i].value!= "OtherLanguage"){
          checkboxesChecked.push(checkboxes[i].value);
        }
        else{
          var userChosenLanguage= getInputVal('specifymore3');
          checkboxesChecked.push(userChosenLanguage);
        }
     }
  }
  // Return the array.Because of HTML/JS restrictions, you know it is not empty
  return checkboxesChecked;
}

// Call as
var checkedBoxes = getCheckedBoxes("mycheckboxes");


/*------------------------------------------ upload project form javascript -----------------------------*/

var LanguagesArray=["HTML", "CSS", "Javascript", "Python", "Java", "C++", "pHp"]; //used in addCheckBoxLang and seeIfLanguageBoxisChecked functions

function moveNext(param){
  current_fs = $(param).parent(); //param is "this"
  next_fs = $(param).parent().next();
  //activate next step on progressbar using the index of next_fs
  $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
  current_fs.hide();
  //show the next fieldset
  next_fs.show();
}


$(".next").click(function(){
  //placeToAlert is the ID in which error messages will get displayed
  if ($(document.getElementById('no2')).is(":visible")){ //if we are on the first fieldsset, the place we will deliver an error message is __
    var placeToAlert="errorMessage2";
  }
  else if ($(document.getElementById('no3')).is(":visible")){ //if we are on the first fieldsset
    var placeToAlert="errorMessage3";
  }
  if ($(document.getElementById('no1')).is(":visible")){ //if we are on the first fieldsset
      var email=document.getElementById("email");
      var password=document.getElementById("password"); 
  //Checks whether the entered email and password are valid Firebase accounts
  const promise=auth.signInWithEmailAndPassword(email.value, password.value);
  promise.catch(e => 
    //alert(e.message)
    document.getElementById("errorMessage1").innerHTML=e.message);
  //promise.catch(e => console.log("Error"));
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      moveNext(this);
    } 
    else{
      //promise.catch(e => alert(e.message));
      /*//JUST TO SEE ERROR MESSAGES
      moveNext(this);*/
    }
  });
  }//end of first fieldset
  else{
    /*if ($(document.getElementById('no4')).is(":visible")){ 
      moveNext(this);
    }//end of 4th fieldset
    else{*/
  var choices=document.getElementsByClassName("required");
  var ArrayOfChoices=Array.from(choices); //makes choices an array
  var res= "The following argument(s) must be filled out: ";
  var arg1Array=[];
  for (var i = 0; i < ArrayOfChoices.length; i++) { //the length of the number of parameters
    if ($(ArrayOfChoices[i]).is(":visible")) {  //if the class is not hidden (ensures that we are only looking at the argumenets in the current fieldset)
      var arg1=ArrayOfChoices[i].name;
      var x=document.forms["myForm"][arg1].value;
      if (x ==="") { //if x is empty
        if (arg1Array[arg1Array.length -1]!= arg1) { //ensures that in radio buttons or checklists where there are multiple error messages for the same error, only one of the errors is added to the list.
          arg1Array[arg1Array.length]= arg1;
          var res= res + arg1 +  ", " ;
          res = res.replace(/-/g, ' ');
        } //end of (if arg1Array[length] != arg1)
      } //end of if x is empty
    }//end of if visible
  }//end of for loop
  if ($(document.getElementById('no3')).is(":visible")){
  if (document.getElementById("checkBoxLang").style.display=="block"){
    returnedmessage= seeIfLanguageBoxisChecked();
    if (returnedmessage!=null){
      if (document.getElementById('otherlanguage').checked==false){ //only if other is not checked
        var res=res+ returnedmessage+ ', ';
      }
    }
  }
}
  if(res.valueOf() != "The following argument(s) must be filled out: "){
    //alert(res);
    res = res.slice(0, -2);  //remove the last 2 character from the string (aka remove the final space and final comma)
    document.getElementById(placeToAlert).innerHTML=res;
  }
  else{ //if all the argumenets are filled out
    document.getElementById(placeToAlert).innerHTML=""; 
    if ($(document.getElementById('no3')).is(":visible")){
      if (SelectedTags.length==0){
        document.getElementById(placeToAlert).innerHTML="Please select atleast one tag that describes your project";
        return; //leave function (don't let them advance to moveNext)
      }
      var interviewlink= document.getElementById("InterviewLink").value;
      var presentationlink= document.getElementById("PresentationLink").value;
      //assume that both links are valid unless otherwise shown
      var ValidityOfURL=true;
      var ValidityOfURL2=true;
      if (interviewlink!=""){ //as long as interviewlink is filled in, check if the URL is valid
        var ValidityOfURL= checkURL('InterviewLink'); 
        if (ValidityOfURL==true){ //if the URL is valid, ensure that no error messages are displayed
          document.getElementById("InterviewLinkValidation").innerHTML=""; //ensure no error messages show if the url is valid
        }
        else{
          document.getElementById("InterviewLinkValidation").innerHTML="<span style='color:red; font-size:14px;'>Please enter a valid youtube link or remove the Interview. Check the video above for more assistance </span>"
        }
      }

      if (presentationlink!=""){
        var ValidityOfURL2=checkURL('PresentationLink');
        if (ValidityOfURL2==true){ //if the URL is valid, ensure that no error messages are displayed
          document.getElementById("PresentationLinkValidation").innerHTML=""; //ensure no error messages show if the url is valid
        }
        else{
          document.getElementById("PresentationLinkValidation").innerHTML="<span style='color:red; font-size:14px;'>Please enter a valid youtube link or remove the Presentation. Check the video above for more assistance </span>"
        }
      }

      if (ValidityOfURL==false || ValidityOfURL2==false){ //if either URL is invalid, then stop the user from moving forward
        return; //leave function (don't let them advance to moveNext)
      }
      whetherToUploadCode= document.getElementById("YesCodeUpload").checked;
    } 
    //clear all error messages on the current fieldset before advancing
    document.getElementById("InterviewLinkValidation").innerHTML="";
    document.getElementById("PresentationLinkValidation").innerHTML="";
    moveNext(this);
    if ($(document.getElementById('no4')).is(":visible")){
      if (whetherToUploadCode==true){ //if the user says that they have code to upload, then make the "Upload Code" div on fieldset4 visible
        //the "upload Code" div
        document.getElementById("UploadCodeFiles").style.display="block";
        document.getElementById("uploadcode").required = true;
        //the "2 photos of code" div
        document.getElementById("Upload2CodePhotos").style.display="block";
        document.getElementById("twocodeimages").required=true;
      }
      else{
        document.getElementById("UploadCodeFiles").style.display="none";
        document.getElementById("uploadcode").required = false;
        //the "2 photos of code" div
        document.getElementById("Upload2CodePhotos").style.display="none";
        document.getElementById("twocodeimages").required=false;
      }
    }
  
  } //end of else
//}
}
});

$(".previous").click(function(){
  current_fs = $(this).parent();
  previous_fs = $(this).parent().prev();
  //de-activate current step on progressbar
  $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
  current_fs.hide();
  previous_fs.show();
}); //end of previous click



//appends all the languages used to "checkBoxLang" div in uploadProj.html
function addCheckBoxLanguage() {
    for (var i=0; i<LanguagesArray.length; i++){
        var codeBlockLang=
        `<input type="checkbox" id="language`+ i + `" name="Languages-Used" value="` + LanguagesArray[i]+ `">
            <label class="labelForSelectOrInput" for="` + LanguagesArray[i]+ `">`+ LanguagesArray[i] + `</label><br>`;
        $("#checkBoxLangInterior").append(codeBlockLang);
    } 
    //adds an "other" option 
    $("#checkBoxLangInterior").append("<input type='checkbox' id='otherlanguage' name='Languages-Used' value='OtherLanguage'> <label class='labelForSelectOrInput' for='OtherLanguage'> Other</label><br>");
    //adds a text box where users can specify other languages used
    $("#checkBoxLang").append("<input class='required regularinput' id='specifymore3' style='display:none;padding:3px' type='text' name='Specify-Languages-Used' placeholder='Specify what languages were used'/>");
    $('#no3 input[type=checkbox]').change(function(){ //decides when the text option should show or not
      if (document.getElementById('otherlanguage').checked ===true){
        document.getElementById("specifymore3").style.display="block";
      }
      else{
        document.getElementById("specifymore3").style.display="none";
      }
    })
}//end of addCheckBoxLanguage

function addYearDropdown(){
  var date = new Date();
  var currentYear = date.getFullYear();
  currentYear= parseInt(currentYear);
  for (var i=2007; i<=currentYear; i++){
    var codeBlock=
    `<option value="` + i + `">` + i+ `</option>`;
    $("#Year-When-you-Were-A-Mentee").append(codeBlock);
  }
}

/*append the "pop up" image code wherever pop ups need to be there*/
function addPopUps(){
  var ArrayOfPopUpImages=["ProjectDescription", "MenteeRelationship", "ProjectSummaryEx", "Thumbnail1", "ProjectPhotos", "CodePhotos", "ZippedCodeUpload"];
  var listOfDiv=document.getElementsByClassName("popup");
  for (var i=0; i< listOfDiv.length; i++){
      var newId="popupid"+i;
      var newSpanId="myPopuptest"+i;
      listOfDiv[i].setAttribute("id", newId);
      var codeBlock=
      `<img class="questbutt" src="images/PopUpForm/question_popup.jpeg">
      <span class="popuptext" id=`+ newSpanId + `><img class="imghehe" src="images/PopUpForm/` + ArrayOfPopUpImages[i] + `.png"></span>`;
      var newIdNew="#" + newId;
      $(newIdNew).append(codeBlock);
  }
}

/*whenever someone clicks the "question" button, this displays the pop up image and ensures that multiple pop ups cannot be open at the same time for aesthetic reasons */
function displayPopUpImage(CurrentID) {
  var idofDiv="#"+CurrentID;
  var x= $(idofDiv).find("span"); //$(idofDiv)
  var span_Id_current= x.attr("id"); //get the Id of the span element inside the given div
  var currentpopup = document.getElementById(span_Id_current);
  //Stops multiple pop-ups from being open at the same time 
  var listofPopUpText=document.getElementsByClassName("popuptext");
  for (var i=0; i<listofPopUpText.length; i++){
    if (listofPopUpText[i].id != span_Id_current){ //if the id is not equal to teh current id, remove hte class "show"
      listofPopUpText[i].classList.remove("show");
    }
  }
  //if the current pop up is showing, it hides. if the current pop up is hiding, it shows. 
  if (currentpopup.classList.contains("show") === false) {
    currentpopup.classList.add("show");
  }
  else {
    currentpopup.classList.remove("show");
  }
}