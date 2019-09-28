/* TODO: Add functionality to the 'add a button' button.
    - Figure out how to remember users and create a user's gif page.
    - Figure out how to select multiple buttons to combine search terms
    - Add drop down for number of results and rating
    - List the gif's rating at the top of each gif */


$(document).ready(() => {

    var animal = ['dog', 'cat', 'rabbit', 'hamster', 'badger', 'dolphin', 'whale', 'platypus', 'kangaroo', 'wolverine', 'pig', 'horse', 'cow', 'snake'],
        emotion = ['happy', 'funny', 'sad', 'angry', 'offended', 'bored', 'awkward', 'confused', 'excited', 'frustrated', 'hungry', 'tired', 'disappointed', 'embarrassed', 'scared', 'shocked', 'surprised', 'nervous'],
        sport = ['baseball', 'football', 'basketball', 'hockey', 'soccer', 'cricket', 'rugby', 'rock climbing', 'snowboarding', 'skiing', 'skateboarding', 'wakeboarding', 'e-sports'],
        apiKey = 'ARmBnNtTextf5564MTzhpY9zyTYN6Pde',
        numOfResults = 10,
        rating = 'g',
        queryTerm = 'dog',
        queryUrl = `http://api.giphy.com/v1/gifs/search?q=${queryTerm}&rating=${rating}&limit=${numOfResults}&api_key=${apiKey}`;


    function playAndPause() {
        var currentState = $(this).attr('data-state');
        if (currentState === 'still') {
            $(this).attr('src', $(this).attr('data-playing'));
            $(this).attr('data-state', 'playing');
        } else {
            $(this).attr('src', $(this).attr('data-still'));
            $(this).attr('data-state', 'still');
        }
    }

    function newButton(category, term) {
        var newBtn = $('<button>'),
            newCat = ('#' + category + '-buttons');
        newBtn.attr('class', 'btn btn-info m-1 query-button');
        newBtn.text(term);
        $(newCat).append(newBtn);
    }

    animal.forEach((item) => {
        newButton('animal', item);
    })
    emotion.forEach((item) => {
        newButton('emotion', item);
    })
    sport.forEach((item) => {
        newButton('sport', item);
    })

    $('.query-button').on('click', function () {
        queryTerm = $(this).text();
        queryUrl = `http://api.giphy.com/v1/gifs/search?q=${queryTerm}&rating=${rating}&limit=${numOfResults}&api_key=${apiKey}`;
        $('.gifs').empty();
        $.ajax({
            url: queryUrl,
            method: 'GET'
        }).then((response) => {
            response.data.forEach((item) => {

                var newGif = $('<img>');
                newGif.attr({
                    'src': item.images.fixed_height_still.url,
                    'alt': item.title,
                    'data-state': 'still',
                    'data-still': item.images.fixed_height_still.url,
                    'data-playing': item.images.fixed_height.url
                }).addClass('m-2 new-gif');
                $('.gifs').append(newGif);
            })
        })
    })

    $('.container').on('click', '.new-gif', playAndPause);

    $('#submit').on('click', function() {
        console.log('clicked');
        var newTerm = $('#new-button').val,
            newCat = $('#new-category').text();
        console.log(newTerm, newCat);
        newButton(newCat, newTerm);
    })
})