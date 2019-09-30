/* TODO:
    - Figure out how to remember users and create a user's gif page.
        - Will need a save button next to each gif

    - Figure out how to select multiple buttons to combine search terms

    - Add drop down for number of results and rating, use it like a navbar with button groups

    - Make your list of buttons actually a drop down menu

    - Add a jumbotron with info about the page.

    - Add a theme of colors and text to the page.

    - Add progress or spinners using anime.js for when gifs are loading.*/


$(document).ready(() => {

    var animal = ['dog', 'cat', 'rabbit', 'hamster', 'badger', 'dolphin', 'whale', 'platypus', 'kangaroo', 'wolverine', 'pig', 'horse', 'cow', 'snake'],
        emotion = ['happy', 'funny', 'sad', 'angry', 'offended', 'bored', 'awkward', 'confused', 'excited', 'frustrated', 'hungry', 'tired', 'disappointed', 'embarrassed', 'scared', 'shocked', 'surprised', 'nervous'],
        sport = ['baseball', 'football', 'basketball', 'hockey', 'soccer', 'cricket', 'rugby', 'rock climbing', 'snowboarding', 'skiing', 'skateboarding', 'wakeboarding', 'e-sports'],
        apiKey = 'ARmBnNtTextf5564MTzhpY9zyTYN6Pde',
        numOfResults = 10,
        rating = 'g',
        queryTerm = 'dog',
        queryUrl = `http://api.giphy.com/v1/gifs/search?q=${queryTerm}&rating=${rating}&limit=${numOfResults}&api_key=${apiKey}`,
        personalButtons;


    if (localStorage.getItem(personalButtons) === null) {
        personalButtons = [];
    } else {
        personalButtons = localStorage.getItem(personalButtons).split(';');
    }

    function playAndPause() {
        var currentState = $(this).attr('data-state');
        if (currentState === 'still') {
            $(this).attr('src', $(this).attr('data-animated'));
            $(this).attr('data-state', 'animated');
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

    if (personalButtons.length > 0) {
        personalButtons.forEach((item) => {
            newButton('personal', item);
        })
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

    $(document.body).on('click', '.query-button', function () {
        queryTerm = $(this).text();
        queryUrl = `http://api.giphy.com/v1/gifs/search?q=${queryTerm}&rating=${rating}&limit=${numOfResults}&api_key=${apiKey}`;
        $('#gifs').empty();
        $.ajax({
            url: queryUrl,
            method: 'GET'
        }).then((response) => {
            response.data.forEach((item) => {

                var newGif = $('<img>'),
                    newDiv = $('<div>');
                newGif.attr({
                    'src': item.images.fixed_height_still.url,
                    'alt': item.title,
                    'data-state': 'still',
                    'data-still': item.images.fixed_height_still.url,
                    'data-animated': item.images.fixed_height.url
                }).addClass('m-2 new-gif');
                newDiv.addClass('float-left mt-2');
                newDiv.append('<h6>Rating: ' + item.rating.toUpperCase() + '</h6>').append(newGif);


                $('#gifs').append(newDiv);
            })
        })
    })

    $('.container').on('click', '.new-gif', playAndPause);

    $('#submit').on('click', function () {
        alert($('#new-button').val());
        var newTerm = $('#new-button').val();
        console.log('New term is: ' + newTerm);
        personalButtons.push(newTerm);
        console.log(personalButtons);
        localStorage.setItem(personalButtons, personalButtons);
        newButton('personal', newTerm);
    })

    $('#login').on('click', function () {
        if ($('#login-collapse').attr('data-toggle') === 'hidden') {
            $('#sign-up-collapse').hide();
            $('#sign-up-collapse').attr('data-toggle', 'hidden');
            $('#login-collapse').show();
            loginDisplayAnime.play();
            $('#login-collapse').attr('data-toggle', 'displayed');
        } else {
            $('#login-collapse').hide();
            $('#login-collapse').attr('data-toggle', 'hidden');
        }
    })
    $('#sign-up').on('click', function () {
        if ($('#sign-up-collapse').attr('data-toggle') === 'hidden') {
            $('#login-collapse').hide();
            $('#login-collapse').attr('data-toggle', 'hidden');
            $('#sign-up-collapse').show();
            signUpDisplayAnime.play();
            $('#sign-up-collapse').attr('data-toggle', 'displayed');
        } else {
            $('#sign-up-collapse').hide();
            $('#sign-up-collapse').attr('data-toggle', 'hidden');
        }
    })
})

let loginDisplayAnime = anime({
    targets: '#login-collapse',
    height: {
        value: '+=100',
        duration: 1000
    },
    autoplay: false
})
let signUpDisplayAnime = anime({
    targets: '#sign-up-collapse',
    height: {
        value: '+=100',
        duration: 1000
    },
    autoplay: false
})