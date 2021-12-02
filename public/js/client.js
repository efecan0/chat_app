const socket = io();

//elements
const sendLocationButton = document.querySelector('#sendLocation');
const sendMessageButton = document.querySelector('#send');
const messageInput = document.querySelector('#mesaj');
const receivedMessage = document.querySelector('#receivedMessage');

//templates
const receivedMessageTemplate = document.querySelector('#receivedMessageTemplate').innerHTML;

sendMessageButton.addEventListener('click', ()=>{

sendMessageButton.setAttribute('disabled','disabled');

const messageText = messageInput.value;

socket.emit('sendMessage', messageText,(isDelivered)=>{
  if(isDelivered){
    console.log('Delivered');
  }else{
    console.log('Gönderilemedi');
  }

  messageInput.value='';
  messageInput.focus();
  sendMessageButton.removeAttribute('disabled');
  });
});

socket.on('receivedMessage',(message)=>{
  const template = Handlebars.compile(receivedMessageTemplate);
  receivedMessage.insertAdjacentHTML("beforebegin", template({
    message
  }));
});

sendLocationButton.addEventListener('click',()=>{
//deactive et
sendLocationButton.setAttribute('disabled','disabled')

  if(!navigator.geolocation){
    console.log('hata');
    //tekrar aktif et
    sendLocationButton.removeAttribute('disabled');
    return;
  }
  navigator.geolocation.getCurrentPosition(position=>{
    const { latitude, longitude} = position.coords;
    socket.emit('sendLocation',{
      latitude,
      longitude
    })
    //tekrar aktif et
    sendLocationButton.removeAttribute('disabled');

    const template = Handlebars.compile(receivedMessageTemplate);
    receivedMessage.insertAdjacentHTML("beforebegin", template({
      url:`http://maps.google.com?q=${latitude},${longitude}`
    }));
  });

});
