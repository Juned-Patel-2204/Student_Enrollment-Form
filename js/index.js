var jpdbBaseURL="http://api.login2explore.com:5577"
var stDbName="SCHOOL-DB"
var stRelation="STUDENT-TABLE"
var connToken="90932033|-31949219869378663|90962272"
var jpdbIML="/api/iml"
var jpdbIRL="/api/irl"

function resetForm(){
    
    $("#id").prop('disabled', false);
    document.getElementById("myform").reset();
    $("#save").prop('disabled', true);    
    $("#reset-button").prop('disabled', true);
    
    $("#change").prop('disabled', true);    
}

function saveData(){
    var jsonStrObj=validatedata();
    if(jsonStrObj===""){
        return "";
    }
    var putRequest=createPUTRequest(connToken,jsonStrObj,stDbName,stRelation);
    jQuery.ajaxSetup({async:false});
    var resJsonObj=executeCommandAtGivenBaseUrl(putRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    $('#id').focus();
   return resJsonObj;
}


function validatedata(){
    var stid, stname,stclass,dob,add,enroll;

    stid=$("#id").val();
    stname=$("#name").val();
    stclass=$("#class").val();
    dob=$("#dob").val();
    add=$("#add").val();
    enroll=$("#enroll").val();
    if(stid===""){
        alert("Student roll no. is required")
        $("#id").focus();
        return "";
    }

    if(stname===""){
        alert("Student name is required")
        $("#name").focus();
        return "";
    }if(stclass===""){
        alert("Student class is required")
        $("#class").focus();
        return "";
    }if(dob===""){
        alert("Student Date of birth is required")
        $("#dob").focus();
        return "";
    }if(add===""){
        alert("Student Address is required")
        $("#add").focus();
        return "";
    }if(enroll===""){
        alert("Student Enrollment date is required")
        $("#enroll").focus();
        return "";
    }

    var jsonStrObj={
        ROLL_NO: stid,
        FULL_NAME: stname,
        CLASS: stclass,
        DATE_OF_BIRTH: dob,
        ADDRESS: add,
        ENROLL_DATE: enroll        
    }
    return JSON.stringify(jsonStrObj); 
}

function changeData(){
    $("#change").prop("disabled", true);
    jsonChg=validatedata();
    var updateRequest=createUPDATERecordRequest(connToken,jsonChg,stDbName,stRelation,localStorage.getItem("recno"));
    jQuery.ajaxSetup({async:false});
    var resJsonObj=executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    $('#id').focus();
}

function getStudent(){
    var stIdJsonObj= getStIdAsJsonObj();
    var getRequest= createGET_BY_KEYRequest(connToken,stDbName,stRelation,stIdJsonObj)
    jQuery.ajaxSetup({async:false});
    var resJsonObj=executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL);
    jQuery.ajaxSetup({async:true});
   
    console.log(resJsonObj.status)
    if(resJsonObj.status===400){
       $("#save").prop('disabled', false);    
       $("#reset-button").prop('disabled', false);
       $("#name").focus();
    }else if(resJsonObj.status===200){
       
       $("#id").prop('disabled', true);
       fillData(resJsonObj);
       
       $("#save").prop('disabled', true);  
       $("#change").prop('disabled', false);
       $("#reset-button").prop('disabled', false);
       $("#name").focus();
    }
   }
   function saveRecNo2LS(jsonObj){
    var lvData=JSON.parse(jsonObj.data);
    localStorage.setItem("recno",lvData.rec_no);
}
function getStIdAsJsonObj(){
    var stid=$("#id").val();
    var jsonStr={
        ROLL_NO: stid
    };
    return JSON.stringify(jsonStr);
}
function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var data=JSON.parse(jsonObj.data).record;
    $("#name").val(data.FULL_NAME);
    $("#class").val(data.CLASS);
    $("#dob").val(data.DATE_OF_BIRTH);
    $("#add").val(data.ADDRESS);
    $("#enroll").val(data.ENROLL_DATE);
    
}