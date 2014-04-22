Const = {
  STATE_MENU : 0,
  STATE_ROULETTE : 1,
  STATE_SMASH : 2,

  INIT_NUM_FRUITS : 8,
  INIT_FRUITS_TARGET : 6,
  INIT_SPEED_SCALE : 2,
  INIT_TARGET_ANGLE : 0,
  INIT_ROULETTE_TIME : 4,

  INIT_FRUIT_SIZE : 50,
  
  TIMER_GAME : 0,
  TIMER_ROULETTE : 1,

  DEFAULT_TIMER_INTERVAL : 16.66,

  CANVAS_ROULETTE_CENTER_X : 150,
  CANVAS_ROULETTE_CENTER_Y : 200,

  CANVAS_ROULETTE_RADIUS : 150,

  IMAGES_PATH : 'img/',

  FRUIT_TYPES : ['banana','cherries','pineapple','watermelon'],

  CHUNK_IDENTIFIER : 'Chunk',

  FRUIT_DATA : {
    'banana' : {
      image:'fruit/banana.png',
      chunks: ['fruit/banana.png'],
      numChunks: 4,
      speed: 100,
    },
    'cherries' : {
      image:'fruit/cherries.png',
      chunks: ['fruit/cherries.png'],
      numChunks: 3,
      speed: 100,
    },
    'pineapple' : {
      image:'fruit/pineapple.png',
      chunks: ['fruit/pineapple.png'],
      numChunks: 2,
      speed: 100,
    },
    'watermelon' : {
      image:'fruit/watermelon.png',
      chunks: ['fruit/watermelon.png'],
      numChunks: 10,
      speed: 100,
    },
  },

  SCENE_DATA : {
    'wheel' : {
      image:'wheel.png',
    },
    'clock' : {
      image:'clock.png',
    },
  },
}