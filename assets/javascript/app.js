$(document).ready(() => {



    // VARIABLES

    var animal = ['dog', 'cat', 'rabbit', 'hamster', 'badger', 'dolphin',
            'whale', 'platypus', 'kangaroo', 'wolverine', 'pig', 'horse',
            'cow', 'snake'
        ],
        emotion = ['happy', 'funny', 'sad', 'angry', 'offended', 'bored',
            'awkward', 'confused', 'excited', 'frustrated', 'hungry', 'tired',
            'disappointed', 'embarrassed', 'scared', 'shocked', 'surprised',
            'nervous'
        ],
        sport = ['baseball', 'football', 'basketball', 'hockey', 'soccer',
            'cricket', 'rugby', 'rock climbing', 'snowboarding', 'skiing',
            'skateboarding', 'wakeboarding', 'e-sports'
        ],
        limit = 10,
        rating = 'g',
        queryTerm = '',
        personalButtons,
        savedGifs;

    // Retrive variables from localStorage if they exist.
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

    // Creates a url to pass into an ajax call.  Has optional parameters with defaults.
    function createUrl(type, rating = 'g', limit = '10', term = '', key = 'ARmBnNtTextf5564MTzhpY9zyTYN6Pde') {
        if (type === 'query') {
            return `https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${term}&
            rating=${rating}&limit=${limit}`
        } else if (type === 'trending') {
            return `https://api.giphy.com/v1/gifs/trending?api_key=${key}&
            rating=${rating}&limit=${limit}`
        } else if (type === 'random') {
            return `https://api.giphy.com/v1/gifs/random?api_key=${key}&
            rating=${rating}`
        } else {
            throw "not a valid endpoint type";
        }
    }
    // Plays or pauses a clicked gif.
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
    // Creates a new button element and adds it to the passed category.
    function newButton(category, term) {
        var newBtn = $('<button>'),
            newCat = ('#' + category + '-buttons');
        newBtn.attr('class', 'btn btn-info m-1 query-button');
        newBtn.text(term);
        $(newCat).append(newBtn);
    }
    /* Creates a new gif element with all the necessary attributes by passing
        a JSON formatted image object. */
    function createNewGif(imgObj) {
        var newGif = $('<img>'),
            newDiv = $('<div>');
        newGif.attr({
            'src': imgObj.images.fixed_height_still.url,
            'alt': imgObj.title,
            'data-state': 'still',
            'data-still': imgObj.images.fixed_height_still.url,
            'data-animated': imgObj.images.fixed_height.url
        }).addClass('m-2 new-gif');
        newDiv.addClass('float-left mt-2');
        if (imgObj.rating) {
            newDiv.append('<h6>Rating: ' + imgObj.rating.toUpperCase() +
                ` <button id="save-button" type="button" 
                class="btn btn-secondary btn-sm">Save</button></h6>`);
        } else {
            newDiv.append(`<h6><button id="save-button" type="button" 
            class="btn btn-secondary btn-sm">Save</button></h6>`);
        }
        newDiv.append(newGif);
        return newDiv;
    }
    /* Creates a gif element using the format that the gifs are saved to
        local storage in. */
    function createGifFromSaved(imgObj) {
        var newGif = $('<img>'),
            newDiv = $('<div>');
        newGif.attr({
            'src': imgObj.src,
            'alt': imgObj.alt,
            'data-state': imgObj['data-state'],
            'data-still': imgObj['data-still'],
            'data-animated': imgObj['data-animated']
        }).addClass('m-2 new-gif');
        newDiv.addClass('float-left mt-2');
        newDiv.append(newGif);
        return newDiv;
    }
    // Shows the sign up form using anime.js.
    function showSignUp() {
        $('#login-collapse').hide();
        $('#login-collapse').attr('data-toggle', 'hidden');
        $('#sign-up-collapse').show();
        signUpDisplayAnime.play();
        $('#sign-up-collapse').attr('data-toggle', 'displayed');
    }
    // Shows the login form using anime.js.
    function showLogin() {
        $('#sign-up-collapse').hide();
        $('#sign-up-collapse').attr('data-toggle', 'hidden');
        $('#login-collapse').show();
        loginDisplayAnime.play();
        $('#login-collapse').attr('data-toggle', 'displayed');
    }
    // Sets the variable limit based on a dropdown selection.
    function setlimit() {
        limit = $(this).attr('value');
    }
    // Sets the variable rating based on a dropdown selection.
    function setRating() {
        rating = $(this).attr('value');
    }
    /* Creates a new button from a passed in selector and adds it to the
        personal buttons on the page and in local storage. */
    function addToPersonalBtn(selector) {
        var newTerm = $(selector).val();
        personalButtons.push(newTerm);
        localStorage.setItem('personalButtons', personalButtons);
        newButton('personal', newTerm);
        $(selector).val('');
    }
    /* Takes in one of the gif elements on the page and converts its
        attributes into a JSON format to be stored in local storage. */
    function returnGifJson(gif) {
        var dataObj = {};
        dataObj['src'] = gif.attr('src');
        dataObj['alt'] = gif.attr('alt');
        dataObj['data-still'] = gif.attr('data-still');
        dataObj['data-animated'] = gif.attr('data-animated');
        return dataObj;
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
        $('#gifs').empty();
        $.ajax({
            url: createUrl('query', rating, limit, queryTerm),
            method: 'GET'
        }).then((response) => {
            response.data.forEach((item) => {
                $('#gifs').append(createNewGif(item));
            })
        })
    })

    // Show trending GIFs.
    $('#trending').on('click', function () {
        $('#gifs').empty();
        $.ajax({
            url: createUrl('trending', rating, limit),
            method: 'GET'
        }).then((response) => {
            response.data.forEach((item) => {
                $('#gifs').append(createNewGif(item));
            })
        })
    })



    //Show random GIF.
    $('#random').on('click', function () {
        $('#gifs').empty();
        $.ajax({
            url: createUrl('random'),
            method: 'GET'
        }).then((response) => {
            $('#gifs').append(createNewGif(response.data));
        })
    })

    // Play or pause the GIF.
    $('.container').on('click', '.new-gif', playAndPause);

    // Adds a new button to the Personal Buttons group.
    $('#submit').on('click', () => {
        addToPersonalBtn('#new-button')
    });

    // Same function as above but for the mobile nav.
    $('#submit-mobile').on('click', () => {
        addToPersonalBtn('#new-button-mobile')
    });

    // Displays or hides the login form.
    $('#login').on('click', function () {
        if ($('#login-collapse').attr('data-toggle') === 'hidden') {
            showLogin();
        } else {
            $('#login-collapse').hide();
            $('#login-collapse').attr('data-toggle', 'hidden');
        }
    })

    // Displays or hides the sign-up form.
    $('#sign-up').on('click', function () {
        if ($('#sign-up-collapse').attr('data-toggle') === 'hidden') {
            showSignUp();
        } else {
            $('#sign-up-collapse').hide();
            $('#sign-up-collapse').attr('data-toggle', 'hidden');
        }
    })

    // Clear personal info; i.e. buttons and saved GIFs.
    $(document.body).on('click', '#clear-local', function () {
        localStorage.clear();
        $('#personal-buttons').empty();
        savedGifs = [];
        personalButtons = [];
    });

    // Set the number of return results based on the clicked dropdown item.
    $('.limit-dropdown').on('click', setlimit);

    // Set the rating of results based on the clicked dropdown item.
    $('.rating-dropdown').on('click', setRating);

    // Save a gif to the user's local storage.
    $(document.body).on('click', '#save-button', function () {
        var savedImage = $(this).parent().siblings();
        savedGifs.push(returnGifJson(savedImage));
        localStorage.setItem('savedGifs', JSON.stringify(savedGifs));
    })

    // Show saved GIFs.
    $('#saved-gifs').on('click', function () {
        $('#gifs').empty();
        if (savedGifs.length > 0) {
            savedGifs.forEach((item) => {
                $('#gifs').append(createGifFromSaved(item));
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