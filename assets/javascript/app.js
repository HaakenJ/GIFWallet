/* TODO:
    - Figure out how to select multiple buttons to combine search terms

    - Make your list of buttons actually a drop down menu

    - Add a jumbotron with info about the page.

    - Add a theme of colors and text to the page.

    - Add progress or spinners using anime.js for when gifs are loading.*/


$(document).ready(() => {



    // VARIABLES

    var animal = ['dog', 'cat', 'rabbit', 'hamster', 'badger', 'dolphin', 'whale', 'platypus', 'kangaroo', 'wolverine', 'pig', 'horse', 'cow', 'snake'],
        emotion = ['happy', 'funny', 'sad', 'angry', 'offended', 'bored', 'awkward', 'confused', 'excited', 'frustrated', 'hungry', 'tired', 'disappointed', 'embarrassed', 'scared', 'shocked', 'surprised', 'nervous'],
        sport = ['baseball', 'football', 'basketball', 'hockey', 'soccer', 'cricket', 'rugby', 'rock climbing', 'snowboarding', 'skiing', 'skateboarding', 'wakeboarding', 'e-sports'],
        apiKey = 'ARmBnNtTextf5564MTzhpY9zyTYN6Pde',
        numOfResults = 10,
        rating = 'g',
        queryTerm = 'dog',
        queryUrl = `http://api.giphy.com/v1/gifs/search?q=${queryTerm}&rating=${rating}&limit=${numOfResults}&api_key=${apiKey}`,
        personalButtons,
        savedGifs;


    if (localStorage.getItem('personalButtons') === null) {
        personalButtons = [];
    } else {
        personalButtons = localStorage.getItem('personalButtons').split(',');
        console.log(personalButtons);
    }

    if (localStorage.getItem('savedGifs') === null) {
        savedGifs = [];
    } else {
        savedGifs = JSON.parse(localStorage.getItem('savedGifs'));
        console.log(savedGifs);
    }



    // FUNCTIONS

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

    function showSignUp() {
        $('#login-collapse').hide();
        $('#login-collapse').attr('data-toggle', 'hidden');
        $('#sign-up-collapse').show();
        signUpDisplayAnime.play();
        $('#sign-up-collapse').attr('data-toggle', 'displayed');
    }

    function showLogin() {
        $('#sign-up-collapse').hide();
        $('#sign-up-collapse').attr('data-toggle', 'hidden');
        $('#login-collapse').show();
        loginDisplayAnime.play();
        $('#login-collapse').attr('data-toggle', 'displayed');
    }

    function setNumOfResults() {
        numOfResults = $(this).attr('value');
        console.log(numOfResults);
    }

    function setRating() {
        rating = $(this).attr('value');
        console.log(rating);
    }



    // DISPLAY BUTTONS

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



    // CLICK FUNCTIONS

    // Add gifs to the page when a query button is clicked.
    $(document.body).on('click', '.query-button', function () {
        queryTerm = $(this).text();
        queryUrl = `http://api.giphy.com/v1/gifs/search?q=${queryTerm}&
            rating=${rating}&limit=${numOfResults}&api_key=${apiKey}`;
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
                newDiv.append('<h6>Rating: ' + item.rating.toUpperCase() +
                    '    <button id="save-button" type="button" class="btn btn-secondary btn-sm">Save</button></h6>');
                newDiv.append(newGif);

                $('#gifs').append(newDiv);
            })
        })
    })

    // Show trending GIFs.
    $('#trending').on('click', function () {
        queryUrl = `http://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&rating=${rating}&limit=${numOfResults}`;
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
                newDiv.append('<h6>Rating: ' + item.rating.toUpperCase() +
                    '    <button id="save-button" type="button" class="btn btn-secondary btn-sm">Save</button></h6>');
                newDiv.append(newGif);

                $('#gifs').append(newDiv);
            })
        })
    })

    //Show random GIF.
    $('#random').on('click', function () {
        queryUrl = `http://api.giphy.com/v1/gifs/random?api_key=${apiKey}&rating=${rating}`;
        $('#gifs').empty();
        $.ajax({
            url: queryUrl,
            method: 'GET'
        }).then((response) => {
            var newGif = $('<img>'),
                newDiv = $('<div>');
            newGif.attr({
                'src': response.data.images.fixed_height_still.url,
                'alt': response.data.title,
                'data-state': 'still',
                'data-still': response.data.images.fixed_height_still.url,
                'data-animated': response.data.images.fixed_height.url
            }).addClass('m-2 new-gif');
            newDiv.addClass('float-left mt-2');
            newDiv.append('<h6><button id="save-button" type="button" class="btn btn-secondary btn-sm">Save</button></h6>');
            newDiv.append(newGif);
            newDiv.append(newGif);

            $('#gifs').append(newDiv);
        })
    })

    // Play or pause the GIF.
    $('.container').on('click', '.new-gif', playAndPause);

    // Adds a new button to the Personal Buttons group and adds it to local storage.
    $('#submit').on('click', function () {
        var newTerm = $('#new-button').val();
        personalButtons.push(newTerm);
        localStorage.setItem('personalButtons', personalButtons);
        newButton('personal', newTerm);
        $('#new-button').val('');
    })

    // Displays or hides the login form.
    $('#login').on('click', function () {
        if ($('#login-collapse').attr('data-toggle') === 'hidden') {
            console.log('clicked');
            showLogin();
        } else {
            $('#login-collapse').hide();
            $('#login-collapse').attr('data-toggle', 'hidden');
        }
    })

    // Displays or hides the sign-up form.
    $('#sign-up').on('click', function () {
        if ($('#sign-up-collapse').attr('data-toggle') === 'hidden') {
            console.log('clicked');
            showSignUp();
        } else {
            $('#sign-up-collapse').hide();
            $('#sign-up-collapse').attr('data-toggle', 'hidden');
        }
    })

    // Clear personal info; i.e. buttons and saved GIFs.
    $('#clear-local').on('click', function () {
        localStorage.clear();
        $('#personal-buttons').empty();
        savedGifs = [];
        personalButtons = [];
    });

    // Set the number of return results based on the clicked dropdown item.
    $('.limit-dropdown').on('click', setNumOfResults);

    // Set the rating of results based on the clicked dropdown item.
    $('.rating-dropdown').on('click', setRating);

    // Save a gif to the user's local storage.
    $(document.body).on('click', '#save-button', function () {
        var savedImage = $(this).parent().siblings(),
            dataObj = {};
        dataObj['src'] = savedImage.attr('src');
        dataObj['alt'] = savedImage.attr('alt');
        dataObj['data-still'] = savedImage.attr('data-still');
        dataObj['data-animated'] = savedImage.attr('data-animated');

        savedGifs.push(dataObj);
        console.log(savedGifs);
        localStorage.setItem('savedGifs', JSON.stringify(savedGifs));

    })

    // Show saved GIFs.
    $('#saved-gifs').on('click', function () {
        $('#gifs').empty();
        if (savedGifs.length > 0) {
            savedGifs.forEach((item) => {
                var newGif = $('<img>'),
                    newDiv = $('<div>');
                newGif.attr({
                    'src': item.src,
                    'alt': item.alt,
                    'data-state': item['data-state'],
                    'data-still': item['data-still'],
                    'data-animated': item['data-animated']
                }).addClass('m-2 new-gif');
                newDiv.addClass('float-left mt-2');
                newDiv.append(newGif);
                $('#gifs').append(newDiv);
            })
        }
    })
})



// ANIMATIONS

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