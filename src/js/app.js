var moment = require('moment');
require('moment/locale/en-gb');

var messages = window.localStorage.getItem('messages') ? JSON.parse(window.localStorage.getItem('messages')) : [];

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

    speakLaterButton.addEventListener('click', function() { 
        scheduleSpeech();
    }, false);

    for (var i = 0; i < messages.length; i++) {
        scheduleSpeech(messages[i]);
    }

    loadVoices();
}

function getInputValues() {
    var inputValues = {
        messageText: messageInput.value,
        date: dateInput.value,
        time: timeInput.value,
        options: {
            volume: parseFloat(volumeInput.value),
            rate: parseFloat(rateInput.value),
            pitch: parseFloat(pitchInput.value),
            voice: voiceSelect.value
        }
    }
    
    return inputValues;
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
function speak(messageText, options) {
    // By default, use the current value of the inputs
    options = (typeof options !== 'undefined') ? options : {
        volume: parseFloat(volumeInput.value),
        rate: parseFloat(rateInput.value),
        pitch: parseFloat(pitchInput.value),
        voice: voiceSelect.value
    };

    // Create a new instance of SpeechSynthesisUtterance.
    var msg = new SpeechSynthesisUtterance();

    // Set the text, rate and pitch
    msg.text = messageText;
    msg.volume = options.volume;
    msg.rate = options.rate;
    msg.pitch = options.pitch;

    // If a voice has been selected, find the voice and set the utterance instance's voice attribute.
    if (options.voice) {
        msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == options.voice; })[0];
    }

    // Queue this utterance.
    window.speechSynthesis.speak(msg);
}

function scheduleSpeech(settings) {
    // If there are no settings supplied, use the current state
    if (!settings) {
        settings = getInputValues();
        // Store in local storage
        messages.push(Object.assign(settings));
        window.localStorage.setItem('messages', JSON.stringify(messages));
    }

    var currentUnixTime = moment().unix();
    var scheduledUnixTime = moment(settings.date + ' ' + settings.time).unix();
    var remainingTime = scheduledUnixTime - currentUnixTime;

    if (remainingTime < 0) {
        console.log(`Message: “${settings.messageText}” cannot be scheduled for ${settings.time}, as that’s in the past.`);
    } else {
        console.log(`Message: “${settings.messageText}” scheduled for ${settings.time}.`);
      
        setTimeout(function() {
            speak(settings.messageText, settings.options);
        }, remainingTime * 1000);
    }
}

init();