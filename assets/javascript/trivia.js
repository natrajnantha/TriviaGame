var time = 0;
var waitTime = 0;
var lap = 1;
var answerClicked = false;
var currentQuestion = 0;
var correctResponse = 0;
var incorrectResponse = 0;
var unansweredResponse = 0;


window.onload = function () {
    $("#stop").on("click", stop);
    $("#reset").on("click", reset);
    $("#start").on("click", start);
};

function reset() {

    time = 0;
    lap = 1;
    answerClicked = false;
    console.log("Resetting the next question");

    $("#display").text("00:00");
    $("#laps").text("");
    $("#resultTxt").empty();
    $("input[type=radio]").attr('disabled', false);
    $("#gipgif").attr("src","");
    currentQuestion++;
    if (currentQuestion > quizDBobj.length - 1) {
        console.log("Game over");
        stop();
        // dispImage();
        $("#gipgif").empty();
        $("#resultTxt").empty();
        $("#start").show();
        $("#optionsWrapper").empty();
        $("#question").empty();
        console.log("Correct Answers : " + correctResponse);
        console.log("Incorrect Answers : " + incorrectResponse);
        console.log("Unanswered : " + unansweredResponse);
    } else {
        console.log("Current question : " + currentQuestion);
        displayQuestion();
        intervalId = setInterval(count, 1000);
    }
}

function start() {
    console.log("Total questions : " + quizDBobj.length);
    currentQuestion = 0;
    correctResponse = 0;
    incorrectResponse = 0;
    unansweredResponse = 0;    
    $("#start").hide();
    for (let i = 0; i < 4; i++) {
        var radioBtn = $('<input id="option'+ i + '" type="radio" name="choices" /><br>');
        radioBtn.addClass("opt")
        radioBtn.appendTo('#optionsWrapper');        
        $("#option" + i).on("click", function processOption() {
            clickedOption = $(this).attr("id");
            answerClicked = true;
            processAnswer(clickedOption);
        });
    }
    displayQuestion();
    intervalId = setInterval(count, 1000);
}

function stop() {

    console.log("stopping");
    clearInterval(intervalId);

}

function count() {

    time++;
    var converted = timeConverter(time);
    $("#display").text(converted);
    console.log("Time : " + time);
    if (time === 10) {
        processAnswer();
    }

}

function timeConverter(t) {

    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    if (minutes === 0) {
        minutes = "00";
    }
    else if (minutes < 10) {
        minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
}

function displayQuestion() {
    $("#question").html(quizDBobj[currentQuestion].question);
    for (let i = 0; i < 4; i++) {
        $("label[for='option" + i + "']").remove();
        $("#option" + i).after("<label for='option" + i + "'></label>");
        $("#option" + i).prop("checked", false);
        $("label[for='option" + i + "']").html(quizDBobj[currentQuestion].choices[i]);
        console.log("Options " + quizDBobj[currentQuestion].choices[i]);
    }
}

function processAnswer(t) {
    stop();
    if (answerClicked) {
        switch (t) {
            case 'option0':
                quizDBobj[currentQuestion].userAnswer = 0;
                break;
            case 'option1':
                quizDBobj[currentQuestion].userAnswer = 1;
                break;
            case 'option2':
                quizDBobj[currentQuestion].userAnswer = 2;
                break;
            case 'option3':
                quizDBobj[currentQuestion].userAnswer = 3;
                break;
            default:
                break;
        }

        console.log("User Answer : " + quizDBobj[currentQuestion].userAnswer);
        console.log("Correct Answer : " + quizDBobj[currentQuestion].correctAnswer);
        if (quizDBobj[currentQuestion].userAnswer === quizDBobj[currentQuestion].correctAnswer) {
            $("#resultTxt").html("Excellent !!!");
            correctResponse++;
        } else {
            $("#resultTxt").html("Correct answer is : " + quizDBobj[currentQuestion].choices[quizDBobj[currentQuestion].correctAnswer]);
            incorrectResponse++;
        }
        dispStats();
        wait(5000);
        // reset();
    } else {
        console.log("Correct answer is : " + quizDBobj[currentQuestion].choices[quizDBobj[currentQuestion].correctAnswer]);
        $("#resultTxt").html("Correct answer is : " + quizDBobj[currentQuestion].choices[quizDBobj[currentQuestion].correctAnswer]);
        unansweredResponse++;
        dispStats();
        wait(5000);
        // reset();
    }
}

function wait(timeParm) {
    $("input[type=radio]").attr('disabled', true);

    dispImage();

    setTimeout(function(){reset();},timeParm);
}

function dispImage() {
    var queryURL = "https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC";
    var gifImg;
    var randomindex;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      randomindex = Math.floor(Math.random()*(response.data.length-1+1)+1);

      console.log("Length : " + response.data.length + " Random : " + randomindex);

      gifImg = response.data[randomindex].images.downsized.url;
      console.log("ImgURL1 : " + gifImg);
      $("#gipgif").attr("src",gifImg);
    });
}

function dispStats() {
    var currentQuestionDisp = currentQuestion + 1;
    $('#progress').text("Question " + currentQuestionDisp + " of " + quizDBobj.length);
    $('#correct').text("Correct  : " + correctResponse);
    $('#incorrect').text("Incorrect : " + incorrectResponse);
    $('#unanswered').text("Unanswered : " + unansweredResponse);
}