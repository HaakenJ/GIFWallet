var animals = ['dog','cat','rabbit','hamster','badger','dolphin','whale','platypus','kangaroo','wolverine','pig','horse','cow','snake'],
    emotions = ['happy','funny','sad','angry','offended','bored','awkward','confused','excited','frustrated','hungry','tired','disappointed','embarrassed','scared','shocked','surprised','nervous'],
    sports = ['baseball','football','basketball','hockey','soccer','cricket','rugby','rock climbing','snowboarding','skiing','skateboarding','wakeboarding','e-sports'];


$(document).ready(() => {
    animals.forEach((item) => {
        var newBtn = $('<button>');
        newBtn.attr('class', 'btn btn-info m-1');
        newBtn.text(item);
        $('#animal-buttons').prepend(newBtn);
    })
    emotions.forEach((item) => {
        var newBtn = $('<button>');
        newBtn.attr('class', 'btn btn-info m-1');
        newBtn.text(item);
        $('#emotion-buttons').prepend(newBtn);
    })
    sports.forEach((item) => {
        var newBtn = $('<button>');
        newBtn.attr('class', 'btn btn-info m-1');
        newBtn.text(item);
        $('#sport-buttons').prepend(newBtn);
    })
})