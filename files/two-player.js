const ashWin = new Audio("audio/ash_win.mp3");
const garyWin = new Audio("audio/gary_win.mp3");
const remis = new Audio('audio/remis.mp3');
const backgroundMusic = new Audio('audio/background.mp3');

let whoseTurn;				//zmienna: string	zawiera informacje, kto wykonuje wych w danej turze
let ashScore = 0;			//zmienna: liczba	wynik asha
let garyScore = 0;			//zmienna: liczba	wynik garego
let cardsImages;			//zmienna: tablica	tablica przechowujaca nazwy obrazow kart
let cardNr;					//zmienna: tablica	tablica przechowujaca elementy kart (getElementById)
let oneVisible = false;		//zmienna: bool		pozwala ustalic, czy jedna karta juz zostala odslonieta
let turnCounter = 0;		//zmienna: liczba	zlicza liczbe wykonanych tur
let visibleNr;				//zmienna: liczba	przechowuje numer odslonietej na poczatku tury karty 
let lock = false;			//zmienna: bool		zabezpieczenie zapobiegajace odslonieciu wiecej niz dwoch kart
let pairsLeft = 8;			//zmienna: liczba	przechowje liczbe pozostalych na planszy par
let card;					//zmienna: obiekt	przechowuje element karty (getElementById)
let opacityValue;			//zmienna: obiekt	przechowuje wartosc css opacity dla danego elementu karty (jesli wartosc wynosi 0, to karta zniknela z planszy)
let gameMode = "eevee";		//zmienna: string	przechowuje informacje o trybie gry z session storage

document.getElementById("ash").addEventListener("click", () => generateBoard("ash"));
document.getElementById("gary").addEventListener("click", () => generateBoard("gary"));

gameMode = sessionStorage.getItem('gameMode');

if (gameMode === "eevee"){
	document.body.style.backgroundColor = '#fdc100';
	document.body.style.color = '#040c22';
	cardsImages = ["1.png", "1.png", "2.png", "2.png", "3.png", "3.png", "4.png", "4.png", "5.png", "5.png", "6.png", "6.png", "7.png", "7.png", "8.png", "8.png"];
}
if (gameMode=== "battle"){
	document.body.style.backgroundColor = '#040c22';
	document.body.style.color = '#fdc100';
	cardsImages = ["1b.png", "1b.png", "2b.png", "2b.png", "3b.png", "3b.png", "4b.png", "4b.png", "5b.png", "5b.png", "6b.png", "6b.png", "7b.png", "7b.png", "8b.png", "8b.png"];
}

cardNr = new Array(16);

//funkcja generujaca poczatek rozgrywki
const generateBoard = (player) =>{
	backgroundMusic.play();
	whoseTurn = player;
	document.querySelector('.board').innerHTML = '<br/><div class="row"><div class="card" id="c0"></div><div class="card" id="c1"></div><div class="card" id="c2"></div><div class="card" id="c3"></div></div><div class="row"><div class="card" id="c4"></div><div class="card" id="c5"></div><div class="card" id="c6"></div><div class="card" id="c7"></div></div><div class="row"><div class="card" id="c8"></div><div class="card" id="c9"></div><div class="card" id="c10"></div><div class="card" id="c11"></div></div><div class="row"><div class="card" id="c12"></div><div class="card" id="c13"></div><div class="card" id="c14"></div><div class="card" id="c15"></div></div></div><div class="scoreCounter">Turn counter:  '+ turnCounter +'</div>'+ '</div><div class="scoreWhoseTurn">Whose Turn:  '+ whoseTurn +'</div>';
	registerListeners();
	if(whoseTurn === "ash"){
		document.querySelector('.sidePlayerAsh').style.filter = 'brightness(100%)';
		document.querySelector('.scoreWhoseTurn').innerHTML = 'Turn: ' + '<img src="img/ash_head.png" height="40"/>';
	}
	if(whoseTurn === "gary"){
		document.querySelector('.sidePlayerGary').style.filter = 'brightness(100%)';
		document.querySelector('.scoreWhoseTurn').innerHTML = 'Turn: ' + '<img src="img/gary_head.png" height="40"/>';
	}
}
//funkcja rejestrujaca listenery
const registerListeners = () =>{
	cardNr = document.querySelectorAll('.card');
	cardNr.forEach((card, index) => {
		if (gameMode === 'battle') card.style.backgroundImage = 'url(img/backgroundb.png)';
		card.addEventListener("click", () => {revealCard(index);});
	});

	document.querySelector('.left').innerHTML = '<div class="sidePlayerAsh"></div><div class="scoreAsh">Ash score: 0</div>';
	document.querySelector('.right').innerHTML = '<div class="sidePlayerGary"></div><div class="scoreGary">Gary score: 0</div>';
}


const shuffle = (array) => {

	let currentIndex = array.length
	let randomIndex;

  	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];

	}
}

shuffle(cardsImages);

//funkcja odslaniajaca karte
const revealCard = (nr) => {
	card = document.getElementById("c" + nr);
	opacityValue = window.getComputedStyle(card).getPropertyValue('opacity');

	if(opacityValue !=0 && lock == false){
		lock = true;
		if(gameMode === "eevee") card.style.backgroundImage = "url(img/" + cardsImages[nr] + ")";
		if(gameMode === "battle") card.style.backgroundImage = "url(img/" + cardsImages[nr] + ")";
		if(nr!=visibleNr) card.classList.toggle('cardA');
		//Pierwsza karta w turze
		if(oneVisible === false){
			oneVisible = true;
			visibleNr = nr;
			lock = false;
			return;
		}
		//Druga karta w turze
		if(nr != visibleNr){
			//identyczne karty w parze
			if(cardsImages[nr] === cardsImages[visibleNr]) setTimeout(function() { hide2Cards(nr, visibleNr)}, 750); 
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
const restore2Cards = (firstCard, secondCard) => {
	restoreCard(firstCard);
	restoreCard(secondCard);
	lock = false;
	changeWhoseTurn();
	updateStats();
}

//funkcja zaslaniajaca jedna karte
const restoreCard = (cardNr) =>{
	let cardToRestore = document.querySelector('#c' + cardNr);
	if(gameMode === "eevee") cardToRestore.style.backgroundImage = 'url(img/background.png)';
	if(gameMode === "battle") cardToRestore.style.backgroundImage = 'url(img/backgroundb.png)';
	cardToRestore.classList.add('card');
	cardToRestore.classList.remove('cardA');
}

//funkcja usuwajaca z planszy pare identycznych kart
const hide2Cards = (nr1, nr2) =>{
	document.querySelector('#c' + nr1).style.opacity = '0';
	document.querySelector('#c' + nr2).style.opacity = '0';
	pairsLeft--;
	addScore();
	updateStats();
	if(pairsLeft === 0){
		if(ashScore > garyScore) {
			showResult("ash_win");
			ashWin.play();
			return;
		}
		if(ashScore === garyScore) {
			showResult("remis");
			remis.play();
			return;
		}
		if(ashScore < garyScore) {
			showResult("gary_win");
			garyWin.play();
			return;
		}
	}
	lock = false;
}
const changeWhoseTurn = () =>{
	tmp = whoseTurn;
	if (tmp === "ash") {
		whoseTurn = "gary";
		document.querySelector('.sidePlayerAsh').style.filter = 'brightness(20%)';
		document.querySelector('.sidePlayerGary').style.filter = 'brightness(100%)';
	}
	if (tmp === "gary"){
		whoseTurn = "ash"; 
		document.querySelector('.sidePlayerAsh').style.filter = 'brightness(100%)';
		document.querySelector('.sidePlayerGary').style.filter = 'brightness(20%)';
	}
}

const addScore = () =>{
	if (whoseTurn === "ash") ashScore++;
	if (whoseTurn === "gary") garyScore++; 
}

const updateStats = () =>{
	document.querySelector('.scoreCounter').innerHTML = 'Turn counter: ' + turnCounter;
	document.querySelector('.scoreAsh').innerHTML = 'Ash score: ' + ashScore;
	document.querySelector('.scoreGary').innerHTML = 'Gary score: ' + garyScore;
	if(whoseTurn === "ash") document.querySelector('.scoreWhoseTurn').innerHTML = 'Turn: ' + '<img src="img/ash_head.png" height="40"/>';
	if(whoseTurn === "gary") document.querySelector('.scoreWhoseTurn').innerHTML = 'Turn: ' + '<img src="img/gary_head.png" height="40"/>';
}

const showResult = (winner) =>{
	if (winner === "remis") document.querySelector('.board').innerHTML = '<img src="img/' + winner + '.gif"/><h1>Remis!<br/>Done in ' + turnCounter + ' turns!';
	if (winner === "ash_win") document.querySelector('.board').innerHTML = '<img src="img/' + winner + '.gif"/><h1>Ash win!<br/>Done in ' + turnCounter + ' turns!';
	if (winner === "gary_win") document.querySelector('.board').innerHTML = '<img src="img/' + winner + '.gif"/><h1>Gary win!<br/>Done in ' + turnCounter + ' turns!';
	document.querySelector('.left').innerHTML = '';
	document.querySelector('.right').innerHTML = '';
}
