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
	backgroundMusic.play();
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
	document.querySelector('.scoreCounter').innerHTML = 'Turn counter: ' + turnCounter;
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
	document.querySelector('#c' + firstCard).style.opacity = '0';
	document.querySelector('#c' + secondCard).style.opacity = '0';
	pairsLeft--;
	document.querySelector('.scoreCounter').innerHTML = 'Turn counter: ' + turnCounter;
	if(pairsLeft === 0){
		if(turnCounter<20) {
			if (gameMode === "eevee") document.querySelector('.board').innerHTML = '<img src="img/win.gif"/><h1>You win!<br/>Done in ' + turnCounter + ' turns!';
			else document.querySelector('.board').innerHTML = '<img src="img/winb.gif"/><h1>You win!<br/>Done in ' + turnCounter + ' turns!';
			return;
		}
		if (gameMode === "eevee") document.querySelector('.board').innerHTML = '<img src="img/lose.gif"/><h1>Boomer!<br/>Done in ' + turnCounter+ ' turns!';
		else document.querySelector('.board').innerHTML = '<img src="img/loseb.gif"/><h1>Boomer!<br/>Done in ' + turnCounter+ ' turns!';
	}
	lock = false;
}
//ustawienie widoku w zaleznosci od trybu gry
const useModeProperities = () =>{
	if (gameMode === "eevee"){
		document.body.style.backgroundColor = '#fdc100';
		document.body.style.color = '#040c22';
		cardsImages = ["1.png", "1.png", "2.png", "2.png", "3.png", "3.png", "4.png", "4.png", "5.png", "5.png", "6.png", "6.png", "7.png", "7.png", "8.png", "8.png"];
		document.getElementById('nameGame').innerHTML = 'EEVOLUTIONS MEMORY GAME';
		cardNr = document.querySelectorAll('.card');
		cardNr.forEach((card, index) => {card.addEventListener("click", () => {revealCard(index);});});
	}
	if (gameMode=== "battle"){
		document.body.style.backgroundColor = '#040c22';
		document.body.style.color = '#fdc100';
		cardsImages = ["1b.png", "1b.png", "2b.png", "2b.png", "3b.png", "3b.png", "4b.png", "4b.png", "5b.png", "5b.png", "6b.png", "6b.png", "7b.png", "7b.png", "8b.png", "8b.png"];
		document.getElementById('nameGame').innerHTML = 'BATTLE MEMORY GAME';
		cardNr = document.querySelectorAll('.card');
		cardNr.forEach((card, index) => {
			if (gameMode === 'battle') card.style.backgroundImage = 'url(img/backgroundb.png)';
			card.addEventListener("click", () => {revealCard(index);});
		});
	}
}
//mp3
const backgroundMusic = new Audio('audio/background.mp3');

let cardsImages;			//zmienna: tablica	tablica przechowujaca nazwy obrazow kart
let cardNr;					//zmienna: tablica	tablica przechowujaca elementy kart (getElementById)
let oneVisible = false;		//zmienna: bool		pozwala ustalic, czy jedna karta juz zostala odslonieta
let turnCounter = 0;		//zmienna: liczba	zlicza liczbe wykonanych tur
let visibleNr;				//zmienna: liczba	przechowuje numer odslonietej na poczatku tury karty 
let lock = false;			//zmienna: bool		zabezpieczenie zapobiegajace odslonieciu wiecej niz dwoch kart
let pairsLeft = 8;			//zmienna: liczba	przechowje liczbe pozostalych na planszy par
let card;					//zmienna: obiekt	przechowuje element karty (getElementById)
let opacityValue;			//zmienna: obiekt	przechowuje wartosc css opacity dla danego elementu karty (jesli wartosc wynosi 0, to karta zniknela z planszy)
let gameMode;				//zmienna: string	przechowuje informacje o trybie gry z session storage


//main
gameMode = sessionStorage.getItem('gameMode');
useModeProperities();
shuffle(cardsImages);



