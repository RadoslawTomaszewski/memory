//funkcja generujaca ruch ai
const aiTurn = () =>{
	let firstNr;
	let secondNr;
	let matchingPair = findMatchingPair(revealedCards, cardsImages);
	
	do{
		firstNr = Math.floor(Math.random() * 16);
	}while(hiddenNumbers.includes(firstNr));
	do {
		secondNr = Math.floor(Math.random() * 16);
	} while (hiddenNumbers.includes(secondNr) || secondNr === firstNr);
	if(AIMode === "off"){
		revealCard(firstNr);
		revealCard(secondNr);
		return;
	}
	if (matchingPair !== null){
		do{
			firstNr = matchingPair[0];
		}while(hiddenNumbers.includes(firstNr));
		do {
			secondNr = matchingPair[1];
		} while (hiddenNumbers.includes(secondNr) || secondNr === firstNr);
	}

	revealCard(firstNr);
	revealCard(secondNr);
}

//funkcja znajdujaca pare wsrod odkrytych kart
function findMatchingPair(indexList, imagesList) {
	let matchingPair = null;
  
	indexList.forEach((index, i) => {
	  const image = imagesList[index];
	  const otherIndex = indexList.slice(i + 1).find((otherIndex) => {
		return imagesList[otherIndex] === image;
	  });
  
	  if (otherIndex !== undefined) {
		matchingPair = [index, otherIndex];
		return;
	  }
	});
	return matchingPair;
  }

//funkcja generujaca poczatek rozgrywki
const generateBoard = (player) =>{
	backgroundMusic.play();
	whoseTurn = player;
	document.querySelector('.board').innerHTML = '<br/><div class="row"><div class="card" id="c0"></div><div class="card" id="c1"></div><div class="card" id="c2"></div><div class="card" id="c3"></div></div><div class="row"><div class="card" id="c4"></div><div class="card" id="c5"></div><div class="card" id="c6"></div><div class="card" id="c7"></div></div><div class="row"><div class="card" id="c8"></div><div class="card" id="c9"></div><div class="card" id="c10"></div><div class="card" id="c11"></div></div><div class="row"><div class="card" id="c12"></div><div class="card" id="c13"></div><div class="card" id="c14"></div><div class="card" id="c15"></div></div></div><div class="scoreCounter">Turn counter:  '+ turnCounter +'</div>'+ '</div><div class="scoreWhoseTurn">Whose Turn:  '+ whoseTurn +'</div>';
	registerListeners();
	let scoreWhoseTurn = document.querySelector('.scoreWhoseTurn');
	if(AIMode === "on") document.querySelector('.sidePlayerAi').style.backgroundImage = 'url(img/alakazam.png)';

	if(whoseTurn === "ash"){
		document.querySelector('.sidePlayerAsh').style.filter = 'brightness(100%)';
		scoreWhoseTurn.innerHTML = 'Turn: ' + '<img src="img/ash_head.png" height="40"/>';
	}
	if(whoseTurn === "ai"){
		document.querySelector('.sidePlayerAi').style.filter = 'brightness(100%)';
		console.log(AIMode);
		if (AIMode === "on") scoreWhoseTurn.innerHTML = 'Turn: ' + '<img src="img/alakazam_head.png" height="40"/>';
		else scoreWhoseTurn.innerHTML = 'Turn: ' + '<img src="img/ai_head.png" height="40"/>';
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
	if (AIMode === "off") document.querySelector('.right').innerHTML = '<div class="sidePlayerAi"></div><div class="scoreAi">Mewtwo score: 0</div>';
	else document.querySelector('.right').innerHTML = '<div class="sidePlayerAi"></div><div class="scoreAi">Alakazam score: 0</div>';

}
//funkcja losujaca uklad kart na planszy
const shuffle = (array) => {

	let currentIndex = array.length
	let randomIndex;

  	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];

	}
}
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
			if(!revealedCards.includes(nr)) revealedCards.push(nr);
			return;
		}
		//Druga karta w turze
		if(nr != visibleNr){
			//identyczne karty w parze
			if(cardsImages[nr] === cardsImages[visibleNr]) setTimeout(function() { hide2Cards(nr, visibleNr)}, 750); 
			//rozne kary w parze
			else{
				setTimeout(function() { restore2Cards(nr, visibleNr)}, 1000);
			} 
			turnCounter++;
			oneVisible = false;
			if(!revealedCards.includes(nr)) revealedCards.push(nr);
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
	if (whoseTurn === "ai") setTimeout(()=>aiTurn(),250);
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
const hide2Cards = (firstCard, secondCard) =>{
	hiddenNumbers.push(firstCard);
	hiddenNumbers.push(secondCard);
	document.querySelector('#c' + firstCard).style.opacity = '0';
	document.querySelector('#c' + secondCard).style.opacity = '0';
	pairsLeft--;
	addScore();
	updateStats();
	if(pairsLeft === 0){
		if(ashScore > aiScore) {
			if(AIMode === "on") showResult("alakazam_lose");
			else showResult("vsc_ash_win");
			return;
		}
		if(ashScore === aiScore) {
			if(AIMode === "on") showResult("alakazam_win");
			else showResult("vsc_remis");
			return;
		}
		if(ashScore < aiScore) {
			if(AIMode === "on") showResult("alakazam_win");
			else showResult("vsc_mewtwo_win");
			return;
		}
	}
	lock = false;
	indexFirst = revealedCards.indexOf(firstCard);
	revealedCards.splice(indexFirst, 1);

	indexSecond = revealedCards.indexOf(secondCard);
	revealedCards.splice(indexSecond, 1);

	if (whoseTurn === "ai") setTimeout(()=>aiTurn(),250);
}
//funkcja zmieniajaca gracza w turze
const changeWhoseTurn = () =>{
	tmp = whoseTurn;
	let ash = document.querySelector('.sidePlayerAsh');
	let ai = document.querySelector('.sidePlayerAi');
	if (tmp === "ash") {
		whoseTurn = "ai";
		ash.style.filter = 'brightness(20%)';
		ai.style.filter = 'brightness(100%)';
		return;
	}
	whoseTurn = "ash"; 
	ash.style.filter = 'brightness(100%)';
	ai.style.filter = 'brightness(20%)';

}
//funkcja dopisujaca punkty
const addScore = () =>{
	if (whoseTurn === "ash"){
		ashScore++;
		return;
	}
	aiScore++; 
}
//funkcja aktualizujaca statystyki
const updateStats = () =>{
	document.querySelector('.scoreCounter').innerHTML = 'Turn counter: ' + turnCounter;
	document.querySelector('.scoreAsh').innerHTML = 'Ash score: ' + ashScore;
	if (AIMode === "on") document.querySelector('.scoreAi').innerHTML = 'Alakazam score: ' + aiScore;
	else document.querySelector('.scoreAi').innerHTML = 'Mewtwo score: ' + aiScore;
	if(whoseTurn === "ash") document.querySelector('.scoreWhoseTurn').innerHTML = 'Turn: ' + '<img src="img/ash_head.png" height="40"/>';
	if(whoseTurn === "ai"){ 
		if (AIMode === "on") document.querySelector('.scoreWhoseTurn').innerHTML = 'Turn: ' + '<img src="img/alakazam_head.png" height="40"/>';
		else document.querySelector('.scoreWhoseTurn').innerHTML = 'Turn: ' + '<img src="img/ai_head.png" height="40"/>';
	}
}
//wywolanie zakonczenia gry
const showResult = (winner) =>{
	document.querySelector('.left').innerHTML = '';
	document.querySelector('.right').innerHTML = '';
	if (winner === "vsc_remis") { 
		document.querySelector('.board').innerHTML = '<img src="img/' + winner + '.gif"/><h1>Remis!<br/>Done in ' + turnCounter + ' turns!'; 
		return;
	}
	if (winner === "vsc_ash_win"){
		document.querySelector('.board').innerHTML = '<img src="img/' + winner + '.gif"/><h1>Ash win!<br/>Done in ' + turnCounter + ' turns!';
		return;
	} 
	if (winner === "vsc_mewtwo_win"){
		document.querySelector('.board').innerHTML = '<img src="img/' + winner + '.gif"/><h1>Mewtwo win!<br/>Done in ' + turnCounter + ' turns!';
		return;
	} 
	if (winner === "alakazam_win") { 
		document.querySelector('.board').innerHTML = '<img src="img/' + winner + '.gif"/><h1>You are too weak to defeat me!<br/>Done in ' + turnCounter + ' turns!'; 
		return;
	}
	if (winner === "alakazam_lose"){
		document.querySelector('.board').innerHTML = '<img src="img/' + winner + '.gif"/><h1>How is this possible?<br/>Done in ' + turnCounter + ' turns!';
		return;
	} 
}
//ustawienie widoku w zaleznosci od trybu gry
const useModeProperities = () =>{
	if (gameMode === "eevee"){
		document.body.style.backgroundColor = '#fdc100';
		document.body.style.color = '#040c22';
		cardsImages = ["1.png", "1.png", "2.png", "2.png", "3.png", "3.png", "4.png", "4.png", "5.png", "5.png", "6.png", "6.png", "7.png", "7.png", "8.png", "8.png"];
		document.getElementById('nameGame').innerHTML = 'EEVOLUTIONS MEMORY GAME';
	}
	if (gameMode=== "battle"){
		document.body.style.backgroundColor = '#040c22';
		document.body.style.color = '#fdc100';
		cardsImages = ["1b.png", "1b.png", "2b.png", "2b.png", "3b.png", "3b.png", "4b.png", "4b.png", "5b.png", "5b.png", "6b.png", "6b.png", "7b.png", "7b.png", "8b.png", "8b.png"];
		document.getElementById('nameGame').innerHTML = 'BATTLE MEMORY GAME';
	}
	if(AIMode === "on") {
		let playerChoiceRight = document.getElementById("ai");
		playerChoiceRight.style.backgroundImage = 'url(img/alakazam.png)';

		playerChoiceRight.addEventListener("mouseover", function() {
			this.style.backgroundImage = 'url(img/alakazam_b.png)';
		  });
		
		  playerChoiceRight.addEventListener("mouseout", function() {
			this.style.backgroundImage = 'url(img/alakazam.png)';
		  });
	}
}
// mp3
const backgroundMusic = new Audio('audio/background.mp3');

let whoseTurn;				//zmienna: string	zawiera informacje, kto wykonuje wych w danej turze
let ashScore = 0;			//zmienna: liczba	wynik asha
let aiScore = 0;			//zmienna: liczba	wynik garego
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
let AIMode = "on"			//zmienna: string	przechowuje informacje o aktywowaniu opcji inteligentnego przeciwnika z session storage
let hiddenNumbers = [];		//zmienna: tablica	tablica przechowujaca numery kart usunietych z planszy
let revealedCards = [];		//zmienna: tablica 	zawiera informacje, które karty zostały już odkryte

//main
gameMode = sessionStorage.getItem('gameMode');
AIMode = sessionStorage.getItem('AImode');

useModeProperities();

document.getElementById("ash").addEventListener("click", () => generateBoard("ash"));

shuffle(cardsImages);



