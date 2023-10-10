function checkSTUNServer(stunConfig, timeout) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (promiseResolved) return;
        resolve(false);
        promiseResolved = true;
      }, timeout || 5000);
  
      var promiseResolved = false,
        myPeerConnection =
          window.RTCPeerConnection ||
          window.mozRTCPeerConnection ||
          window.webkitRTCPeerConnection, // compatibility for Firefox and Chrome
        pc = new myPeerConnection({ iceServers: [{ urls: stunConfig }] }),
        noop = function () {};
      pc.createDataChannel(""); // create a bogus data channel
      pc.createOffer(
        function (sdp) {
          if (sdp.sdp.indexOf("typ srflx") > -1) {
            // "typ srflx" indicates that it's a STUN server
            promiseResolved = true;
            resolve(true);
          }
          pc.setLocalDescription(sdp, noop, noop);
        },
        noop
      ); // create an offer and set local description
    });
  }
  
  // Usage example:
  const stunServerConfig = "stun:stun.bergophor.de:3478";
  const timeout = 5000; // Optional timeout in milliseconds
  
  checkSTUNServer(stunServerConfig, timeout)
    .then((result) => {
      if (result) {
        console.log("WORKSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
      } else {
        console.error("STUN server does not work.");
      }
    })
    .catch((error) => {
      console.error("Error checking STUN server:", error);
    });
  