const winAsh = new Audio("audio/ash_win.mp3");
const winGary = new Audio("audio/gary_win.mp3");
const remis = new Audio('audio/remis.mp3');
const backgroundMusic = new Audio('audio/background.mp3');



let whoseTurn;				//zmienna: string	zawiera informacje, kto wykonuje wych w danej turze
let ashScore = 0;			//zmienna: liczba	wynik asha
let garyScore = 0;			//zmienna: liczba	wynik garego
let oneVisible = false;		//zmienna: bool		pozwala ustalic, czy jedna karta juz zostala odslonieta
let turnCounter = 0;		//zmienna: liczba	zlicza liczbe wykonanych tur
let visibleNr;				//zmienna: liczba	przechowuje numer odslonietej na poczatku tury karty 
let lock = false;			//zmienna: bool		zabezpieczenie zapobiegajace odslonieciu wiecej niz dwoch kart
let pairsLeft = 8;			//zmienna: liczba	przechowje liczbe pozostalych na planszy par
let card;					//zmienna: obiekt	przechowuje element karty (getElementById)
let opacityValue;			//zmienna: obiekt	przechowuje wartosc css opacity dla danego elementu karty (jesli wartosc wynosi 0, to karta zniknela z planszy)

let playerAsh = document.getElementById("ash");
let playerGary = document.getElementById("gary");

playerAsh.addEventListener("click", function() {setFirstPlayer("ash")});
playerGary.addEventListener("click", function() {setFirstPlayer("gary")});

function setFirstPlayer(p){
	backgroundMusic.play();
	whoseTurn = p;
	document.querySelector('.board').innerHTML = '<br/><div class="row"><div class="card" id="c0"></div><div class="card" id="c1"></div><div class="card" id="c2"></div><div class="card" id="c3"></div></div><div class="row"><div class="card" id="c4"></div><div class="card" id="c5"></div><div class="card" id="c6"></div><div class="card" id="c7"></div></div><div class="row"><div class="card" id="c8"></div><div class="card" id="c9"></div><div class="card" id="c10"></div><div class="card" id="c11"></div></div><div class="row"><div class="card" id="c12"></div><div class="card" id="c13"></div><div class="card" id="c14"></div><div class="card" id="c15"></div></div></div><div class="scoreCounter">Turn counter:  '+ turnCounter +'</div>'+ '</div><div class="scoreWhoseTurn">Whose Turn:  '+ whoseTurn +'</div>';
	registerListeners();
	if(whoseTurn === "ash"){
		document.querySelector('.sidePlayerAsh').style.filter = 'brightness(100%)';
		document.querySelector('.scoreWhoseTurn').innerHTML = 'Turn: ' + '<img src="img/ash_head.png" height="40">';
	}
	if(whoseTurn === "gary"){
		document.querySelector('.sidePlayerGary').style.filter = 'brightness(100%)';
		document.querySelector('.scoreWhoseTurn').innerHTML = 'Turn: ' + '<img src="img/gary_head.png" height="40">';
	}
}

let cards = ["1.png", "1.png", "2.png", "2.png", "3.png", "3.png", "4.png", "4.png", "5.png", 
"5.png", "6.png", "6.png", "7.png", "7.png", "8.png", "8.png"];
let c_ = new Array(16);

function registerListeners(){

	for(i=0; i<cards.length; i++){
		c_[i] = document.getElementById("c" + i);
	}
	c_[0].addEventListener("click", function() {revealCard(0);});
	c_[1].addEventListener("click", function() {revealCard(1);}); 
	c_[2].addEventListener("click", function() {revealCard(2);}); 
	c_[3].addEventListener("click", function() {revealCard(3);}); 

	c_[4].addEventListener("click", function() {revealCard(4);}); 
	c_[5].addEventListener("click", function() {revealCard(5);}); 
	c_[6].addEventListener("click", function() {revealCard(6);}); 
	c_[7].addEventListener("click", function() {revealCard(7);}); 

	c_[8].addEventListener("click", function() {revealCard(8);}); 
	c_[9].addEventListener("click", function() {revealCard(9);}); 
	c_[10].addEventListener("click", function() {revealCard(10);}); 
	c_[11].addEventListener("click", function() {revealCard(11);}); 

	c_[12].addEventListener("click", function() {revealCard(12);}); 
	c_[13].addEventListener("click", function() {revealCard(13);}); 
	c_[14].addEventListener("click", function() {revealCard(14);}); 
	c_[15].addEventListener("click", function() {revealCard(15);}); 

	document.querySelector('.left').innerHTML = '<div class="sidePlayerAsh"></div><div class="scoreAsh">Ash score: 0</div>';
	document.querySelector('.right').innerHTML = '<div class="sidePlayerGary"></div><div class="scoreGary">Gary score: 0</div>';
}

shuffle(cards);

function shuffle(array) {

	let currentIndex = array.length
	let randomIndex;

  	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];

	}
  }

//funkcja odslaniajaca karte
function revealCard(nr) {
	card = document.getElementById("c" + nr);
	opacityValue = window.getComputedStyle(card).getPropertyValue('opacity');

	if(opacityValue !=0 && lock == false){
		lock = true;
		card.style.backgroundImage = "url(img/" + cards[nr] + ")";
		if(nr!=visibleNr) card.classList.toggle('cardA');

		//Pierwsza karta w turze
		if(oneVisible == false){
			oneVisible = true;
			visibleNr = nr;
			lock = false;
			return;
		}

		//Druga karta w turze
		if(nr != visibleNr){
			//identyczne karty w parze
			if(cards[nr] == cards[visibleNr]) setTimeout(function() { hide2Cards(nr, visibleNr)}, 750); 
			//rozne kary w parze
			else setTimeout(function() { restore2Cards(nr, visibleNr)}, 1000);
			turnCounter++;
			oneVisible = false;
			return;
		}
		lock = false;
	}
}

//funkcja zaslaniajaca dwie karty wybrane w turze
function restore2Cards(nr1, nr2) {

	let card1 = document.querySelector('#c' + nr1);
	card1.style.backgroundImage = 'url(img/background.png)';
	card1.classList.add('card');
	card1.classList.remove('cardA');
  
	let card2 = document.querySelector('#c' + nr2);
	card2.style.backgroundImage = 'url(img/background.png)';
	card2.classList.add('card');
	card2.classList.remove('cardA');

	lock = false;
	changeWhoseTurn();
	updateStats();
}

//funkcja usuwajaca z planszy pare identycznych kart
function hide2Cards(nr1, nr2){

	document.querySelector('#c' + nr1).style.opacity = '0';
	document.querySelector('#c' + nr2).style.opacity = '0';

	pairsLeft--;

	addScore();
	updateStats();
	if(pairsLeft==0){

		if(ashScore > garyScore) {
			document.querySelector('.board').innerHTML = '<img src="img/ash-win.gif"><h1>Ash win!<br/>Done in ' + turnCounter + ' turns!';
			document.querySelector('.left').innerHTML = '';
			document.querySelector('.right').innerHTML = '';
			winAsh.play();
			return;
		}
		if(ashScore === garyScore) {
			document.querySelector('.board').innerHTML = '<img src="img/remis.gif"><h1>Remis!<br/>Done in ' + turnCounter + ' turns!';
			document.querySelector('.left').innerHTML = '';
			document.querySelector('.right').innerHTML = '';
			remis.play();
			return;
		}
		if(ashScore < garyScore) {
			document.querySelector('.board').innerHTML = '<img src="img/gary-win.gif"><h1>Gary win!<br/>Done in ' + turnCounter + ' turns!';
			document.querySelector('.left').innerHTML = '';
			document.querySelector('.right').innerHTML = '';
			winGary.play();
			return;
		}
		lose.play();
	}
	lock = false;
}

function changeWhoseTurn(){
	p = whoseTurn;
	if (p === "ash") {
		whoseTurn = "gary";
		document.querySelector('.sidePlayerAsh').style.filter = 'brightness(20%)';
		document.querySelector('.sidePlayerGary').style.filter = 'brightness(100%)';
	}
	if (p === "gary"){
		whoseTurn = "ash"; 
		document.querySelector('.sidePlayerAsh').style.filter = 'brightness(100%)';
		document.querySelector('.sidePlayerGary').style.filter = 'brightness(20%)';
	}
}

function addScore(){
	if (whoseTurn === "ash") ashScore++;
	if (whoseTurn === "gary") garyScore++; 
}

function updateStats(){
	document.querySelector('.scoreCounter').innerHTML = 'Turn counter: ' + turnCounter;
	document.querySelector('.scoreAsh').innerHTML = 'Ash score: ' + ashScore;
	document.querySelector('.scoreGary').innerHTML = 'Gary score: ' + garyScore;
	if(whoseTurn === "ash") document.querySelector('.scoreWhoseTurn').innerHTML = 'Turn: ' + '<img src="img/ash_head.png" height="40">';
	if(whoseTurn === "gary") document.querySelector('.scoreWhoseTurn').innerHTML = 'Turn: ' + '<img src="img/gary_head.png" height="40">';


}
