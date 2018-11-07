navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

// var video;
var webcamStream;

function startWebcam() {
init();
console.log('staring webcam');
video = document.querySelector('video');
var constraints = window.constraints = {
audio: false,
video: true
};
navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {
var videoTracks = stream.getVideoTracks();
console.log('Got stream with constraints:', constraints);
console.log('Using video device: ' + videoTracks[0].label);
stream.onremovetrack = function() {
console.log('Stream ended');
};
//window.stream = stream; // make variable available to browser console
webcamStream = stream;
video.srcObject = stream;
})
.catch(function(error) {
if (error.name === 'ConstraintNotSatisfiedError') {
console.log('The resolution ' + constraints.video.width.exact + 'x' +
   constraints.video.width.exact + ' px is not supported by your device.');
} else if (error.name === 'PermissionDeniedError') {
console.log('Permissions have not been granted to use your camera and ' +
 'microphone, you need to allow the page access to your devices in ' +
 'order for the demo to work.');
}
console.log('getUserMedia error: ' + error.name, error);
});

function errorMsg(msg, error) {
//errorElement.innerHTML += '<p>' + msg + '</p>';
if (typeof error !== 'undefined') {
console.log(error);
}
}
}
function stopWebcam() {
webcamStream.stop();
}
//---------------------
// TAKE A SNAPSHOT CODE
//---------------------
var canvas, ctx;

function init() {
// Get the canvas and obtain a context for
// drawing in it
canvas = document.getElementById("myCanvas");
ctx = canvas.getContext('2d');
}

function snapshot(e) {
// Draws current image from the video element into the canvas
//alert("here!")
ctx.drawImage(video, 0,0, canvas.width, canvas.height);
stopWebcam();
var dataURL = canvas.toDataURL('image/png');
//alert(dataURL);
// var img = document.getElementById("image");
// img.value = dataURL;
$("#im").val(dataURL);
// var submit_btn = document.getElementById("submit_btn");
// submit_btn.disabled = false;
// var videoElement = document.getElementById('video');
// videoElement.pause();
// videoElement.removeAttribute('src'); // empty source
// videoElement.load();
}

function check_password() {
var actual_password = document.getElementById("password").value;
var repeat_password = document.getElementById("repassword").value;
console.log(actual_password);
console.log(repeat_password);

if(actual_password != repeat_password) {
    $("#errorbox").val("The entered passwords don't match!");
    $("#errorbox").attr('class', 'visible');
} else {
    $("#errorbox").attr('class', 'hidden');
}
}
function check_username() {
//alert($("#uname").val()); 
$.ajax({
         type: "GET",
         url: "/check_user_name_exists?username=" + $("#uname").val()
   }).done(function(o) {
        if(o == ""){
            $("#errorbox").attr('class', 'hidden');   
        }
        else {
         $("#errorbox").val(o);
         $("#errorbox").attr('class', 'visible');
        }
   });
}