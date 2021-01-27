'use strict';


let offerOptions = {
  'offerToReceiveVideo': 1,
}

let startButton = document.getElementById('start');
let callButton = document.getElementById('call');
let hangupButton = document.getElementById('hangup');

let localVideo = document.getElementById('localVideo');
let remoteVideo = document.getElementById('remoteVideo');

let localStream;
let remoteStream;

let localPeerConnection;
let remotePeerConnection;

function getOtherPeer(peerConnection) {
  return peerConnection === localPeerConnection ?
    remotePeerConnection : localPeerConnection;
}

function error_spec(err) {
  console.log("error: ", err);
}

function startAction() {
  startButton.disabled = true;
  navigator.mediaDevices.getUserMedia({ video: true }).then(
    (mediaStream) => {
      localVideo.srcObject = mediaStream;
      localStream = mediaStream;
      callButton.disabled = false;
    }).catch(error_spec);
}

function handleConnection(event)  {
    const peerConnection = event.target;
    const iceCandidate = event.candidate;

    if (iceCandidate) {
      const newIceCandidate = new RTCIceCandidate(iceCandidate);

      const otherPeer = getOtherPeer(peerConnection);
      otherPeer.addIceCandidate(newIceCandidate).then(() => {
        console.log("conn success");
      });
  }
}

function callAction() {
  callButton.disabled = true;
  hangupButton.disabled = false;

  const servers = null;

  localPeerConnection = new RTCPeerConnection(servers);
  localPeerConnection.addEventListener('icecandidate', handleConnection);
  
  remotePeerConnection = new RTCPeerConnection(servers);
  remotePeerConnection.addEventListener('icecandidate', handleConnection);
  remotePeerConnection.addEventListener('addstream', (event) => {
    const stream = event.stream; 
    remoteVideo.srcObject = stream;
    remoteStream = stream;
  });
  
  localPeerConnection.addStream(localStream);
  localPeerConnection.createOffer(offerOptions).then(
    (description) => {
      localPeerConnection.setLocalDescription(description);
      remotePeerConnection.setRemoteDescription(description);

      remotePeerConnection.createAnswer().then((answer_description) => {
        remotePeerConnection.setLocalDescription(answer_description);
        localPeerConnection.setRemoteDescription(answer_description);

      });
    });
}

function hangupAction() {
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  hangupButton.disabled = true;
  callButton.disabled = false;
}

startButton.addEventListener('click', startAction);
callButton.addEventListener('click', callAction);
hangupButton.addEventListener('click', hangupButton);

hangupButton.disabled = true;
callButton.disabled = true;