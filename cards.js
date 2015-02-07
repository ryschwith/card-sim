;

var mcs = mcs || {};
mcs.config = mcs.config || {};
mcs.Games = mcs.Games || {};
mcs.Games.Card = mcs.Games.Card || {};

mcs.Games.Card.Card = function(suit, value) {
    var _suit = suit;
    var _value = value;

    return {
        Suit: _suit,
        Value: _value
    }
};

mcs.Games.Card.Suit = function(name, symbol) {
    var _name = name;
    var _symbol = symbol;

    return {
        Name: _name,
        Symbol: _symbol
    }
};

mcs.Games.Card.Deck = function(suits, cardsPerSuit) {
    var _suits = suits;
    var _cards = new Array();

    // INIT
    for( var suit = 0; suit < suits.length; suit++ ) {
        for( var i = 1; i <= cardsPerSuit; i++) {
            _cards.push(new mcs.Games.Card.Card(_suits[suit], i));
        }
    }

    var add = function(val) {
        _cards.push(val);
    }

    var draw = function() {
        return _cards.shift();
    }

    var remaining = function() {
        return _cards.length;
    }

    var shuffle = function() {
        var temp = new Array();

        while( _cards.length > 0 ) {
            var selectedCardIndex = Math.floor(Math.random() * _cards.length);
            temp.push(_cards.splice(selectedCardIndex, 1)[ 0 ]);
        }

        while( temp.length > 0 ) {
            _cards.push(temp.shift());
        }
    };

    return {
        add: add,
        Cards: _cards,
        draw: draw,
        remaining: remaining,
        shuffle: shuffle
    };
};

// MAIN

var NUM_PLAYERS = 4,
    NUM_ITERATIONS = 1000,
    totalLost = 0,
    totalLonely = 0;

for( var x = 0; x < NUM_ITERATIONS; x++ ) {
    playIteration();
}
document.getElementById("results").innerHTML += "Avg. Lost: " + ( totalLost / NUM_ITERATIONS ) + "<br />";
document.getElementById("results").innerHTML += "Avg. Lonely: " + ( totalLonely / NUM_ITERATIONS ) + "<br />";

function getDeck() {
    var deck = new mcs.Games.Card.Deck( [
        new mcs.Games.Card.Suit("Hearts", "h"),
        new mcs.Games.Card.Suit("Clubs", "c"),
        new mcs.Games.Card.Suit("Diamonds", "d"),
        new mcs.Games.Card.Suit("Spades", "s")
    ], 13);
    var jokerSuit = new mcs.Games.Card.Suit("Joker", "j");
    deck.add(new mcs.Games.Card.Card(jokerSuit, 14));
    deck.add(new mcs.Games.Card.Card(jokerSuit, 15));
    deck.shuffle();

    return deck;
}

function playIteration() {
    var d = getDeck(),
        lostTokens = 0,
        lonelinessTokens = 0;

    while( d.remaining() > NUM_PLAYERS ) {
        var round = playGameRound(d);
        lostTokens += round.lost;
        lonelinessTokens += round.lonely;
        totalLost += round.lost;
        totalLonely += round.lonely;
    }

    //document.getElementById("results").innerHTML += "Lost: " + lostTokens + ", Loneliness: " + lonelinessTokens + "<br />";
}

function playGameRound(deck) {
    var cards = new Array(),
        lost = 0,
        lonely = 0,
        suitMatched = false,
        valueMatched = false;

    // draw cards
    for( var i = 0; i < NUM_PLAYERS; i++ ) {
        cards.push(deck.draw());
    }

    for( var j = 1; j < NUM_PLAYERS; j++ ) {
        if( cards[ j ].Suit === cards[ 0 ].Suit && cards[ j ].Suit.Name !== "Joker" ) {
            suitMatched = true;
        }
        if( cards[ j ].Value === cards[ 0 ].Value ) {
            valueMatched = true;
        }
    }
    if(valueMatched) {
        lost++;
    }
    if(!suitMatched) {
        lonely++;
    }

    return {
        lost: lost,
        lonely: lonely
    };
}