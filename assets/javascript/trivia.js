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

// This function resets the screen contents and variables for the next question 
function reset() {

    time = 0;
    lap = 1;
    answerClicked = false;

    $("#display").text("00:00");
    $("#laps").text("");
    $("#resultTxt").empty();
    $("input[type=radio]").attr('disabled', false);
    $("#gipgif").attr("src","");
    currentQuestion++;
    if (currentQuestion > quizDBobj.length - 1) {
        console.log("Game over");
        stop();
        $("#gipgif").empty();
        $("#resultTxt").empty();
        $("#start").show();
        $("#optionsWrapper").empty();
        $("#question").empty();
        console.log("Correct Answers : " + correctResponse);
        console.log("Incorrect Answers : " + incorrectResponse);
        console.log("Unanswered : " + unansweredResponse);
    } else {
        displayQuestion();
        intervalId = setInterval(count, 1000);
    }
}

// This function is executed when the start button is clicked. All the global variables will be initialized for the next game start
function start() {
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

// This clears the main interval. Called when the user has choosen an answer or when the question times out
function stop() {
    clearInterval(intervalId);
}


// On Every interval this function is called to keep the clock ticking. Each question has 10 seconds. If the 10 seconds elapse, then the processAnswer routine is called to 
// evaluate result
function count() {
    time++;
    var converted = timeConverter(time);
    $("#display").text(converted);
    console.log("Time : " + time);
    if (time === 10) {
        processAnswer();
    }

}

// Converts the time to display format
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

// This routine displays the current question and options based on the quizDBob array object. The maximum options is limited to 4 in this game
function displayQuestion() {
    $("#question").html(quizDBobj[currentQuestion].question);
    for (let i = 0; i < 4; i++) {
        $("label[for='option" + i + "']").remove();
        $("#option" + i).after("<label for='option" + i + "'></label>");
        $("#option" + i).prop("checked", false);
        $("label[for='option" + i + "']").html(quizDBobj[currentQuestion].choices[i]);
    }
}

// This routine is called to process the result. This is called if the user has clicked on a response or when the question times out with no user response, The result is evaluated accordingly.
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

        if (quizDBobj[currentQuestion].userAnswer === quizDBobj[currentQuestion].correctAnswer) {
            $("#resultTxt").html("Excellent !!!");
            correctResponse++;
        } else {
            $("#resultTxt").html("Nope, answer is : " + quizDBobj[currentQuestion].choices[quizDBobj[currentQuestion].correctAnswer]);
            incorrectResponse++;
        }
        dispStats();
        wait(5000);
    } else {
        $("#resultTxt").html("Answer is : " + quizDBobj[currentQuestion].choices[quizDBobj[currentQuestion].correctAnswer]);
        unansweredResponse++;
        dispStats();
        wait(5000);
    }
}

// This routine is called to animate the user result and to pause for 5 seconds before moving on to the next question
function wait(timeParm) {
    $("input[type=radio]").attr('disabled', true);
    dispImage();
    setTimeout(function(){reset();},timeParm);
}

// The below routine is called to animate the question result. Ajax call is made to giphy API to get list of images and a random image is choosen from the list to display
function dispImage() {
    var queryURL = "https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC";
    var gifImg;
    var randomindex;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      randomindex = Math.floor(Math.random()*(response.data.length-1+1)+1);


      gifImg = response.data[randomindex].images.downsized.url;
      $("#gipgif").attr("src",gifImg);
    });
}

// This routine displays the ongoing game statistics and final
function dispStats() {
    var currentQuestionDisp = currentQuestion + 1;
    $('#progress').text("Question " + currentQuestionDisp + " of " + quizDBobj.length);
    $('#correct').text("Correct  : " + correctResponse);
    $('#incorrect').text("Incorrect : " + incorrectResponse);
    $('#unanswered').text("Unanswered : " + unansweredResponse);
}