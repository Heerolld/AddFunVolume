import { playIcon, pauseIcon } from '/v2/icons/svgIcons.js';

class Observer {
  update(event, data) {
    throw new Error("Method 'update(event, data)' must be implemented.");
  }
}

class Subject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers(event, data) {
    this.observers.forEach(observer => observer.update(event, data));
  }
}

class MusicPlayer extends Subject {
  constructor() {
    super();
    this.state = { song: {}, playing: false };
  }

  play(song) {
    this.state = { song: song, playing: true };
    this.notifyObservers('play', this.state);
  }

  stop() {
    this.state = { ...this.state.song, playing: false };
    this.notifyObservers('stop', this.state);
  }
}

class MainPlayer extends Observer {
  constructor(playerElement) {
    super();
    this.playerElement = playerElement;
    this.audio = document.createElement("AUDIO");
    playerElement.appendChild(this.audio);
  }

  update(event, data) {
    switch (event) {
      case 'play':
        this.audio.src = data.song.file;
        this.audio.play();
        this.playerElement.querySelector('.play').innerHTML = pauseIcon();
        break;
      case 'stop':
        this.audio.pause();
        this.playerElement.querySelector('.play').innerHTML = playIcon();
        break;
    }

    if (data.song) {
      this.playerElement.querySelector('.info').innerHTML = `
                <h1>${data.song.title}</h1>
                <p>${data.song.artist}</p>
            `;
      this.playerElement.querySelector('.album-cover').src = `${data.song.cover}`;
    }
  }
}

class SidebarPlayer extends Observer {
  constructor(playerElement) {
    super();
    this.playerElement = playerElement;
  }

  update(event, data) {
    switch (event) {
      case 'play':
        this.playerElement.querySelector('.play').innerHTML = pauseIcon();
        break;
      case 'stop':
        this.playerElement.querySelector('.play').innerHTML = playIcon();
        break;
    }

    if (data.song) {
      this.playerElement.querySelector('.info').innerHTML = `
                <h1>${data.song.title}</h1>
                <p>${data.song.artist}</p>
            `;
      this.playerElement.querySelector('.album-cover').src = `${data.song.cover}`;
    }
  }
}

class MiniPlayer extends Observer {
  constructor(playerElement) {
    super();
    this.playerElement = playerElement;
  }

  update(event, data) {
    switch (event) {
      case 'play':
        this.playerElement.querySelector('.play').innerHTML = pauseIcon();
        break;
      case 'stop':
        this.playerElement.querySelector('.play').innerHTML = playIcon();
        break;
    }
    if (data.song) {
      this.playerElement.querySelector('.info').innerHTML = `
                <h1>${data.song.title}</h1>
                <p>${data.song.artist}</p>
            `;
      this.playerElement.querySelector('.album-cover').src = `${data.song.cover}`;
    }
  }
}

const player = new MusicPlayer();

const mainPlayerElement = document.getElementById('main-player');
const mainPlayer = new MainPlayer(mainPlayerElement);

const sidebarPlayerElement = document.getElementById('sidebar-player');
const sidebarPlayer = new SidebarPlayer(sidebarPlayerElement);

const miniPlayerElement = document.getElementById('mini-player');
const miniPlayer = new MiniPlayer(miniPlayerElement);

player.addObserver(mainPlayer);
player.addObserver(sidebarPlayer);
player.addObserver(miniPlayer);

const handlePlay = () => {
  if (player.state.playing) {
    player.stop();
  } else {
    player.play({
      title: 'Better Day',
      file: 'songs/better-day.mp3',
      artist: 'Penguin Music',
      cover: 'songs/better-day.webp'
    });
  }
}

mainPlayerElement.querySelector('.play').addEventListener('click', handlePlay);
sidebarPlayerElement.querySelector('.play').addEventListener('click', handlePlay);
miniPlayerElement.querySelector('.play').addEventListener('click', handlePlay);

document.addEventListener('DOMContentLoaded', function () {
  var volumeControl = document.getElementById('volume');

  volumeControl.addEventListener('input', function () {
    var volumeValue = volumeControl.value;
    console.log('Volume:', volumeValue);
    mainPlayer.audio.volume = volumeValue / 100;
  });
});
