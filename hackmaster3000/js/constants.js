var Constants = {
  CANVAS_WIDTH: 880,    // NOTE: These need to be changed in index.html on the canvas tag too!
  CANVAS_HEIGHT: 650,    // NOTE: Same as above

  INITIAL_MONEY: 20,
  INITIAL_RESOURCES: 1,
  INITIAL_DAYS: 30,

  MONEY_GOAL: 50000,
  
  INITIAL_LOCATIONS: [
    'Library',
  ],
  INITIAL_ACTIONS: [
    'Forgot',
  ],

  MISC_IMAGES: {
    'map': 'map.png',
    'Forgot_sm': 'forgot_sm.png',
    'SpoofWebsite_sm': 'spoof_sm.png',
    'Keylogger_sm': 'keylogger_sm.png',
    'Wifi_sm': 'wifi_sm.png',
    'Scam_sm': 'scam_sm.png',
	'Lock' : 'LockIcon.png',
    'dudes': 'dudes.png',
    'activities': 'activities.png',
    'text_bg': 'text_bg.png',
    'resources': 'resources.png',
    'Play': 'PlayButton.png',
	'Unlock':'UnlockIcon.png',
    'meter': 'meter.png',
  },

  DEFAULT_TEXTBOX_TEXT: 'Welcome to Hackmaster 3000!',

  NEWS_STORIES: {
    'Forgot': {
      text: 'Someone forgot there password and was robbed of hundreds of dollars.',
    },
    'SpoofWebsite': {
      text: 'Angads grandmother logs onto a spoof gmail site and immidiatley enters credit card information ending in Angads withdrawal from SBU.',
    },
    'Keylogger': {
      text: 'Angads grandmother got key logged!',
    },
    'Wifi': {
     text: 'Angad logged onto Feel Bigs unsecure wifi network and her entire session was tracked by Mr Feels himself',
    },
    'Scam': {
      text: 'Andriy is a scam lover',
    },
  },

  ALL_ACTIONS: {
    'Forgot': {
      parent: 'Forgot',
      risk: 1,
      riskIncrease: 1,
      scoreMult: 1,
      resources: 1,
      cost: 1,
      description: 'Someone forgot to log off!',
      image: 'forgot.png',
	    color: '#af0000',
      modalMethod: 'showForgotMethod',
    },
    'SpoofWebsite': {
      parent: 'SpoofWebsite',
      risk: 1.2,
      scoreMult: 1.2,
      riskIncrease: 1.1,
      resources: 2,
      cost: 100,
      description: 'Leave a fake website open to lure people into logging in.',
      image: 'spoof.png',
      color: '#af0000',
      modalMethod: 'showSpoofMethod',
    },
    'Keylogger': {
      parent: 'Keylogger',
      scoreMult: 2.3,
      risk: 1.5,
      riskIncrease: 1.4,
      resources: 3,
      cost: 400,
      description: 'Install keyloggers to capture people\'s log in info.',
      image: 'keylogger.png',
      color: '#af0000',
      modalMethod: 'showKeyLoggerMethod',
    },
    'Wifi': {
      parent: 'Wifi',
      scoreMult: 3.5,
      risk: 2,
      riskIncrease: 1.3,
      resources: 6,
      cost: 800,
      description: 'Setup a fake open wireless access point and record traffic.',
      image: 'wifi.png',
      color: '#af0000',
      modalMethod: 'showWifiMethod',
    },
    'Scam': {
      parent: 'Scam',
      scoreMult: 5,
      risk: 4,
      riskIncrease: 2,
      resources: 8,
      cost: 1000,
      description: 'Place scammers who can use social engineering to steal passwords.',
      image: 'scam.png',
      color: '#af0000',
      modalMethod: 'showScamMethod',
    },
  },

  ALL_DUDES: {
    'Highschooler': {
      resourceGain: 1,
      cost: 30,
	  location: "Highschool",
      lockDescription: 'Gain access to the local high school.\n\nThose poor kids...',
      description: 'Shady high school kid',
      image: 'highschooler.png',
    },
    'NetCafeOwner': {
      cost: 120,
	  location: "Netcafe",
      resourceGain: 5,
      lockDescription: 'Unlocks the local cafe.\n\nFree donuts and coffee 4Life!',
      description: 'Hates his customers',
      image: 'netcafe.png',
    },
    'ApartmentOwner': {
      cost: 450,
	  location: "Apartment",
      resourceGain: 20,
      lockDescription: 'Receive keys to the apartment.\n\nI will give you the keys to happiness....',
      description: 'Has acces to lots of things ;)',
      image: 'apartmentowner.png',
    },
    'Scammer': {
      cost: 800,
	  location: "Computer Store",
      resourceGain: 45,
      lockDescription: 'Unlock access to the computer score.\n\nI will do whatever you want... For a price ;)',
      description: 'Hates life and loves money',
      image: 'scammer.png',
    },
  },
  
  ALL_LOCATIONS: {
    'Library': {
      parent: 'Library',
      awarness: 0,
  	  riskModifier: 1,
	    unlock:"none",
      rewardDeath: 100,
      reward: 10,
      description: 'Library',
      image: 'hello.png',
  	  mapx:105,
  	  mapy:120,
	  mapr:70,
    },
	'Netcafe': {
    parent: 'Netcafe',
    risk: 0,
	  riskModifier: 0.4,
	  unlock:"NetCafeOwner",
    rewardDeath: 100,
    reward: 20,
    description: 'Netcafe',
    image: 'hello.png',
	  color: '#ff0000',
	  mapx:510,
	  mapy:175,
	  mapr:50,
    },
	'Highschool': {
    parent: 'Highschool',
    risk: 0,
	  riskModifier: 0.8,
    reward: 12,
    rewardDeath: 100,
	  unlock:"Highschooler",
    description: 'Netcafe',
    image: 'hello.png',
	  color: '#ff0000',
	  mapx:340,
	  mapy:110,
	  mapr:50,
    },
	'Apartment': {
    parent: 'Apartment',
    risk: 0,
	  riskModifier: 0.2,
	  unlock:"ApartmentOwner",
    rewardDeath: 100,
    reward: 30,
    description: 'Apartment',
    image: 'hello.png',
	  color: '#ff0000',
	  mapx:395,
	  mapy:240,
	  mapr:50,
    },
	'Computer Store': {
    parent: 'Computer Store',
    risk: 0,
	  riskModifier: .1,
	  unlock:"Scammer",
    rewardDeath: 100,
    reward: 50,
    description: 'Computer Store',
    image: 'hello.png',
	  color: '#ff0000',
	  mapx:165,
	  mapy:230,
	  mapr:50,
    },
  },

  LOCK_IMAGES: {
    'SpoofLocked' : 'SpoofLocked.png',
    'KeyloggerLocked' : 'KeyloggerLocked.png',
    'WifiLocked' : 'WifiLocked.png',
    'ScamLocked' : 'ScamLocked.png',
  },

  LESSON_IMAGES: {
    'ForgotDontSave': 'DontSave.png',
    'ForgotSignOut': 'SignOut.png',
    'ForgotStaySignedIn': 'StaySignedIn.png',
    'SpoofBadUrl': 'Spoofed.png',
    'KeyLoggingKeyboard': 'KeyLogging.png',
    'BadWifi': 'BadWifi.png',
    'BadSsid': 'BadWifi2.png',
    'EmployeeScam': 'EmployeeScam.png',
    'MapSmall': 'MapSmall.png',
    'Clippy': 'Clippy.png',
    'Splash': 'splash.png',
    'GameOver': 'GameOver.png',
    'Success': 'success.png'
  },

  INTRO_STRING: 'Thank you for purchasing the Hackmaster 3000!' + 
                ' There are plenty of uneducated computer users in this town,' +
                ' let\'s see how much $$$ we can make off of them...'
};