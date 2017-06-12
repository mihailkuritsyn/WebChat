var wsocket;
var serviceLocation = "ws://" + document.location.host + "/chat/room";
var $nickName;
var $message;
var $chatWindow;
var color = '';

function onMessageReceived(evt) {
    var msg = JSON.parse(evt.data);
    var $messageLine = $('<tr><td class="received">' + msg.received
        + '</td><td class="user label label-default">' + msg.sender
        + '</td><td class="label label-' + msg.color + '">' + msg.message
        + '</td></tr>');
    $chatWindow.append($messageLine);
}
function sendMessage() {
    var msg = '{"message":"' + $message.val() + '", "sender":"' + $nickName.val() + '", "color":"' + color + '", "received":""}';
    wsocket.send(msg);
    $message.val('').focus();
}

function connectToChatserver() {
    color = $('#color option:selected').val();
    wsocket = new WebSocket(serviceLocation);
    wsocket.onmessage = onMessageReceived;
}

function leaveRoom() {
    wsocket.close();
    $chatWindow.empty();
    $('.chat-wrapper').hide();
    $('.chat-signin').show();
    $nickName.focus();
}

$(document).ready(function () {
    $nickName = $('#nickname');
    $message = $('#message');
    $chatWindow = $('#response');
    $('.chat-wrapper').hide();
    $nickName.focus();

    $('#enterRoom').click(function (evt) {
        evt.preventDefault();
        connectToChatserver();
        $('.chat-wrapper h2').text('Hello, ' + $nickName.val());
        $('.chat-signin').hide();
        $('.chat-wrapper').show();
        $message.focus();
    });
    $('#do-chat').submit(function (evt) {
        evt.preventDefault();
        sendMessage()
    });

    $('#leave-room').click(function () {
        leaveRoom();
    });
});