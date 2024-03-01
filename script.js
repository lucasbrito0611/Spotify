const nomedamusica = document.getElementById('nomemusica');
const nomedabanda = document.getElementById('nomebanda');
const nomedaplaylist = document.getElementById('tituloplaylist')
const music = document.getElementById('audio');
const capa = document.getElementById('capa');
const play = document.getElementById('play');
const proximo = document.getElementById('proximo');
const anterior = document.getElementById('anterior');
const progressoatual = document.getElementById('progressoatual');
const progresscontainer = document.getElementById('progress-container');
const botaoembaralhar = document.getElementById('embaralhar');
const botaorepetir = document.getElementById('repetir');
const tempotocado = document.getElementById('tempotocado');
const tempototal = document.getElementById('tempototal');
const botaolike = document.getElementById('like');

const Clocks = {
    nomedamusica : 'Clocks',
    band : 'Coldplay',
    file: 'Clocks',
    liked: false
};
const Sky = {
    nomedamusica : 'Sky Full of Stars',
    band : 'Coldplay',
    file : 'Sky Full of Stars',
    liked: false
};
const Yellow = {
    nomedamusica : 'Yellow',
    band : 'Coldplay',
    file : 'Yellow',
    liked: false
};

const originalplaylist = JSON.parse(localStorage.getItem('playlist')) ?? [Clocks, Sky, Yellow];
let playlistordenada = [...originalplaylist];

let playing = false;
let embaralhado = false;
let repetido = false;
let index = 0;

function playmusic(){
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    music.play();
    music.volume = 0.3
    playing = true;
}

function pausemusic(){
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    music.pause();
    playing = false;
}

function playpausedecider() {
    if (playing == true) {
        pausemusic();
    }
    else {
        playmusic();
    }
    
}

function buttonlikerender() {
    if (playlistordenada[index].liked == true) {
        botaolike.querySelector('.bi').classList.remove('bi-heart');
        botaolike.querySelector('.bi').classList.add('bi-heart-fill');
        botaolike.classList.add('button-active');
    }
    else {
        botaolike.querySelector('.bi').classList.add('bi-heart');
        botaolike.querySelector('.bi').classList.remove('bi-heart-fill');
        botaolike.classList.remove('button-active');
    } 
}

function initializesong() {
    capa.src = `imagens/${playlistordenada[index].file}.jpg`;
    music.src = `sons/${playlistordenada[index].file}.mp3`;
    nomedamusica.innerText = playlistordenada[index].nomedamusica;
    nomedabanda.innerText = playlistordenada[index].band;
    buttonlikerender();
}

function musicaanterior() {
    if (index == 0) {
        index = playlistordenada.length - 1;
    }
    else {
        index -= 1;
    }
    initializesong();
    playmusic();
}

function proximamusica() {
    if (index == 2) {
        index = 0;
    }
    else {
        index += 1;
    }
    initializesong();
    playmusic();
}

function progresso() {
    const larguraBarra = (music.currentTime / music.duration) * 100;
    progressoatual.style.setProperty('--progresso', `${larguraBarra}%`);
    tempotocado.innerText = toHHMMSS(music.currentTime);
}

function jumpTo(event) {
    const width = progresscontainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition /width) * music.duration;
    music.currentTime = jumpToTime;
}

function embaralharArray(Arrayantesdeembaralhar) {
    const size = Arrayantesdeembaralhar.length;
    let currentIndex = size - 1;
    while(currentIndex > 0) {
       let randomindex = Math.floor(Math.random() * size);
       let auxiliar = Arrayantesdeembaralhar[currentIndex];
       Arrayantesdeembaralhar[currentIndex] = Arrayantesdeembaralhar[randomindex];
       Arrayantesdeembaralhar[randomindex] = auxiliar;
       currentIndex -= 1;
    } 
}

function embaralhar () {
    if (embaralhado == false) {
        embaralhado = true;
        embaralharArray(playlistordenada);
        botaoembaralhar.classList.add('button-active');
    }
    else {
        embaralhado = false;
        playlistordenada = [...originalplaylist];
        botaoembaralhar.classList.remove('button-active');
    }
}

function repetir() {
    if (repetido == false) {
        repetido = true;
        botaorepetir.classList.add('button-active'); 
    }
    else {
        repetido = false;
        botaorepetir.classList.remove('button-active'); 
    }
}

function proximaOurepetir() {
    if (repetido == false) {
        proximamusica();
    }
    else {
        playmusic();
    }
}

function toHHMMSS(numeroriginal) {
    let horas = Math.floor(numeroriginal / 3600);
    let minutos = Math.floor((numeroriginal - (horas * 3600)) / 60);
    let segundos = Math.floor((numeroriginal - (horas * 3600)) - (minutos * 60))
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`
}

function tempotodo() {
    tempototal.innerText = toHHMMSS(music.duration);
}

function buttonlikeclicked() {
    if (playlistordenada[index].liked == false) {
        playlistordenada[index].liked = true;
    }
    else {
        playlistordenada[index].liked = false;
    }
    buttonlikerender();
    localStorage.setItem('playlist', JSON.stringify(originalplaylist));
}

initializesong();

play.addEventListener('click', playpausedecider);
anterior.addEventListener('click', musicaanterior);
proximo.addEventListener('click', proximamusica);
music.addEventListener('timeupdate', progresso);
music.addEventListener('ended', proximaOurepetir);
music.addEventListener('loadedmetadata', tempotodo);
progresscontainer.addEventListener('click', jumpTo);
botaoembaralhar.addEventListener('click', embaralhar);
botaorepetir.addEventListener('click', repetir);
botaolike.addEventListener('click', buttonlikeclicked);