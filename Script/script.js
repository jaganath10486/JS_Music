const PlayBtn = document.getElementById('play');
const PrevBtn = document.getElementById('prev');
const NextBtn = document.getElementById('next');
const MusicContainer = document.getElementsByClassName('music-container');

const audio = document.getElementById('audio');

const progress = document.getElementsByClassName('progressbar');
const ProgressContainer  = document.getElementsByClassName('progressbar-container');

const image = document.getElementById('xyz');

const set = document.getElementsByClassName('set');
const settings = document.getElementsByClassName('settings');


const SoundHandle = document.getElementById('input');
const options = document.getElementsByClassName('options');
const playback = document.getElementById('playback');
const speedRate = document.getElementById('rate');

playback.addEventListener('click',() => {
    options[0].classList.toggle('toggle');
})

const queue = document.getElementsByClassName('queue');


const songs = ['Freinds','got','pb'];
const title = ['Freinds', 'Game of thrones', 'Peaky Blinders'];

const start = 
{
    song : 0,
    currentTime : 0
};


let LocalSong = JSON.parse(localStorage.getItem('LocalSong')) || start;
let currentIndex = LocalSong.song || 0;
localStorage.setItem('LocalSong', JSON.stringify(LocalSong));

let front = currentIndex;
let rear = currentIndex + 1;

loadSong(songs[currentIndex]);

function loadSong(index)
{
    let LocalSong = JSON.parse(localStorage.getItem('LocalSong'));
    audio.src = `/Src/${index}.mp3`;
    image.src = `/Src/${index}.jpg`;
    audio.currentTime = LocalSong.currentTime;

}

function playsong()
{
    MusicContainer[0].classList.add('play');
    PlayBtn.querySelector('i.fa-solid').classList.remove('fa-play');
    PlayBtn.querySelector('i.fa-solid').classList.add('fa-pause');
    audio.play();
}

function pausesong()
{
    MusicContainer[0].classList.remove('play');
    PlayBtn.querySelector('i.fa-solid').classList.remove('fa-pause');
    PlayBtn.querySelector('i.fa-solid').classList.add('fa-play');
    audio.pause();
}

function prevSong() 
{
    currentIndex--;

    if (currentIndex < 0) 
    {
       currentIndex = songs.length - 1;
    }
    front = currentIndex;

    if(currentIndex == songs.length - 1)
    {
       rear = 0;
    }
    else
    {
        rear = currentIndex + 1;
    }
    IntialProgressbar();
    loadSong(songs[currentIndex]);
    speedRate.innerHTML = `1X`;
    playsong();
    QueueSongs();
    audio.currentTime = 0;
    let LocalSong = JSON.parse(localStorage.getItem('LocalSong'));

    LocalSong.song = currentIndex;

    localStorage.setItem('LocalSong',JSON.stringify(LocalSong));

}

function NextSong()
{
    currentIndex++;
    IntialProgressbar();
    if(currentIndex > songs.length - 1)
    {
        currentIndex = 0;
    }
    loadSong(songs[currentIndex]);
    playsong();
    front = currentIndex;
    if(currentIndex + 1 >= songs.length)
    {
        rear = 0;
    }
    else
    {
        rear = currentIndex + 1;
    }
    QueueSongs();

    audio.currentTime = 0;
    speedRate.innerHTML = `1X`;
    let LocalSong = JSON.parse(localStorage.getItem('LocalSong'));

    LocalSong.song = currentIndex;

    localStorage.setItem('LocalSong',JSON.stringify(LocalSong));
}

function updateLocalStorage()
{
    let LocalSong = JSON.parse(localStorage.getItem('LocalSong'));

    LocalSong.song = currentIndex;
    LocalSong.currentTime = audio.currentTime;

    localStorage.setItem('LocalSong',JSON.stringify(LocalSong));
}

function Speed(e)
{
    var speed = e.target.getAttribute('data-value');
    audio.playbackRate = speed;
    speedRate.innerHTML = `${speed}X`;
    console.log(audio.playbackRate);

}

function updateProgressbar(e)
{
    const {duration, currentTime} = e.srcElement;
    const width = (currentTime / duration) * 100;
    progress[0].style.width = `${width}%`;
}

function setProgress(e)
{
    const width = this.clientWidth;
    const clickD = e.offsetX;
    const duration = audio.duration;
    
    audio.currentTime = (clickD / width) * duration;
}

PlayBtn.addEventListener('click', () => {
    let playing = MusicContainer[0].classList.contains('play');
    if(playing)
    {
        pausesong();
    }
    else
    {
        playsong();
    }

});

audio.addEventListener('timeupdate',updateLocalStorage);

PrevBtn.addEventListener('click',prevSong);
NextBtn.addEventListener('click',NextSong);

audio.addEventListener('timeupdate',updateProgressbar);

audio.addEventListener('ended',()=> {
    NextSong();
});

ProgressContainer[0].addEventListener('click',setProgress);

function IntialProgressbar()
{
   progress[0].style.width = '0px';
}

//Reload the music
image.addEventListener('click',()=>
{
    pausesong();
    IntialProgressbar();
    const interval = setTimeout(() => {
        audio.currentTime = 0;
        playsong();
    },500);
});


set[0].addEventListener('click',() => {
    settings[0].classList.toggle('toggle');
});


function QueueSongs()
{
    let div1 = '';
    let div2 = '';
    let div3 = '';
    for(var i=0; i < songs.length; i++)
    {
        if(i == front)
        {
            div1 = `<div class='song' id = 'song${i}'>
                      <button id="playSong">${title[i]}</button>
                    </div>`
        }
        else if(i == rear)
        {
            div2 = `<div class='song' id = 'song${i}'>
                      <button id="playSong">${title[i]}</button>
                    </div>`
        }
        else
        {
            div3 = `<div class='song' id = 'song${i}'>
                      <button id="playSong">${title[i]}</button>
                    </div>`
        }
    }
    queue[0].innerHTML = div1 + div2 + div3;
}

QueueSongs();

SoundHandle.addEventListener('click', (e) => {
    audio.volume = e.target.value / 100;
});

for(var i=0; i<4; i++)
{
    options[0].querySelectorAll('.option')[i].addEventListener('click', Speed);
}