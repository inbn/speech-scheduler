var moment = require('moment');
require('moment/locale/en-gb');

// Inputs
var voiceSelect = document.getElementById('voice');
var volumeInput = document.getElementById('volume');
var rateInput = document.getElementById('rate');
var pitchInput = document.getElementById('pitch');
var messageInput = document.getElementById('message');
var dateInput = document.getElementById('date');
var timeInput = document.getElementById('time');
// Buttons
var speakNowButton = document.getElementById('speak-now');
var speakLaterButton = document.getElementById('speak-later');

function init() {
    dateInput.value = moment(new Date()).format('YYYY-MM-DD');
    timeInput.value = moment(new Date()).format('HH:mm:ss');

    speakNowButton.addEventListener('click', function() { 
        speak(messageInput.value); 
    }, false);

    speakLaterButton.addEventListener("click", function() { 
        scheduleSpeech();
    }, false);

    loadVoices();
}

// Fetch the list of voices and populate the voice options.
function loadVoices() {
      // Fetch the available voices.
      var voices;

      window.speechSynthesis.onvoiceschanged = function() {
          voices = window.speechSynthesis.getVoices();

        // Loop through each of the voices.
        voices.forEach(function(voice, i) {
            // Create a new option element.
            var option = document.createElement('option');

            // Set the options value and text.
            option.value = voice.name;
            option.innerHTML = voice.name;

            // Add the option to the voice selector.
            voiceSelect.appendChild(option);
        });
    };
}

// Create a new utterance for the specified text and add it to the queue
function speak(text) {
    // Create a new instance of SpeechSynthesisUtterance.
    var msg = new SpeechSynthesisUtterance();

    // Set the text.
    msg.text = text;

    // Set the attributes.
    msg.volume = parseFloat(volumeInput.value);
    msg.rate = parseFloat(rateInput.value);
    msg.pitch = parseFloat(pitchInput.value);

    // If a voice has been selected, find the voice and set the utterance instance's voice attribute.
    if (voiceSelect.value) {
        msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == voiceSelect.value; })[0];
    }

    //queue this utterance.
    window.speechSynthesis.speak(msg);
}

function scheduleSpeech() {
    var date = dateInput.value;
    var time = timeInput.value;
    var currentUnixTime = moment().unix();
    var scheduledUnixTime = moment(date + ' ' + time).unix();
    var speechString = messageInput.value;

    var remainingTime = scheduledUnixTime - currentUnixTime;

    if (remainingTime < 0) {
        alert('You can\'t schedule something in the past');
    } else {
        console.log('Message: "' + speechString + '" scheduled for ' + time);

        setTimeout(function() {
            speak(speechString);
        }, remainingTime * 1000);
    }
}

init();