var loginCon  = $('#logincontainer');
var forgetCon = $('#forgetcontainer');
var resetCon  = $('#resetcontainer');
var forgetbtn = $( ".forgetbtn" );
var requestbtn = $( ".requestbtn" );
var resetbtn = $( ".resetbtn" );



forgetbtn.click(function() {
loginCon.hide();
forgetCon.show();
});

requestbtn.click(function() {
forgetCon.hide();
resetCon.show();
});

resetbtn.click(function() {
resetCon.hide();
loginCon.show();
});

$(function () {
$(".selectall").change(function(){
    var status = $(this).is(":checked") ? true : false;
    $(".singleSelect").prop("checked",status);
});


});
