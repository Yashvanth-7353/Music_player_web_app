console.log("Lets write the JS");
let currentsong = new Audio();
let songs;

async function get_songs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response =await a.text();
    let div =document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
        
    }
    return songs;
}
const playMusic= (track,pause=false)=>{
    // let audio = new Audio("/songs/" + track)
    currentsong.src =  "/songs/" + track
    if(!pause){
        currentsong.play()
        play.src="assets\\pause.svg";
    }
    
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}

function formatTime(seconds) {
    // 1. Handle "Not a Number" (NaN) cases if the song hasn't loaded yet
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    // 2. Calculate Minutes (discard the decimal part)
    const minutes = Math.floor(seconds / 60);

    // 3. Calculate Remaining Seconds (using the modulo % operator)
    const remainingSeconds = Math.floor(seconds % 60);

    // 4. Add a leading zero to seconds if less than 10 (e.g., "5" becomes "05")
    const formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    // 5. Return the final string
    return `${minutes}:${formattedSeconds}`;
}

async function main() {

    
    
    songs = await get_songs();
    // console.log(songs)
    playMusic(songs[0],true)

    

    let songUL=document.querySelector(".song-list").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+ `<li>
              <img class="invert" src="assets/music.svg" alt="">
              <div class="song-info">
                <div>${song.replaceAll("%20"," ")}</div>
                <div>YAsh</div>
              </div>
              <img class="invert" src="assets/play-btn.svg" alt="">
            </li>
        `;
        
    } 
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        
        e.addEventListener("click", ()=> {
            
            console.log(e.querySelector(".song-info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".song-info").firstElementChild.innerHTML)
        });
            
        
    });
    play.addEventListener("click",() => {
        if(currentsong.paused){
            currentsong.play();
            play.src="assets\\pause.svg";
        }
        else{
            currentsong.pause()
            play.src="assets\\play-btn.svg";
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML=`${formatTime(currentsong.currentTime)} : ${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100 + "%"
    })

    document.querySelector(".seek-bar").addEventListener("click", e=> {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=percent + "%";
        currentsong.currentTime=(currentsong.duration*percent)/100
        
    })

    previous.addEventListener("click", () => {
        currentsong.pause();
        console.log("previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1) [0])
        if((index-1)>=0){
            playMusic(songs[index+1])
        }
        
    })
    next.addEventListener("click", () => {
        currentsong.pause();
        console.log("next clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1) [0])
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
        
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e=> {
        console.log(e, e.target, e.target.value)
         currentsong.volume=parseInt(e.target.value)/100;
    })
}
main();
