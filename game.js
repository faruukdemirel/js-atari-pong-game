
(function () { 
    //*chrome eklentisi kodları
    // chrome.runtime.onMessage.addListener(
    //     function(request, sender, sendResponse) {
    //       if( request.message === "clicked_browser_action" ) {
    //         var firstHref = $("a[href^='http']").eq(0).attr("href");
      
    //         console.log(firstHref); 
         
    //         chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
    //       }
    //     }
    //   );
      //*chrome extensions code end
    var CSS = {
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)'
        },
        ball: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: 0,
            left: 350,
            borderRadius: 0,
            background: '#C6A62F'
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F'
        },
        stick1: {
            left: 0,
            top: 150
        },
        stick2: {
            right: 0,
            top: 150
        }, 
        boardText:{
            position: 'absolute',
            color: '#C6A62F',
            fontSize:'200%',
            borderRadius: 0,
            border: '1px dashed #C6A62F', 
            padding:5                     
        },
        boardText_Player1:{
            left:200,
            top:5
        },
        boardText_Player2:{
            right:200,
            top:5
        },
        board:{
            position: 'absolute',
            color: '#C6A62F',
            fontSize:'300%',
            
        }   , 
        scoreBoard1:{
            left:250,
            top:45,           
        },
        scoreBoard2:{
            right:250,
            top:50,
        }, 
              
    };

    var CONSTS = {
        gameSpeed: 20,
        score1: 0,
        score2: 0,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 0,
        ballLeftSpeed: 0,
        player1:"PLAYER-1",
        player2:"PLAYER-2",  

    };

    function start() {
        var is_finish=localStorage.getItem("is_finish");
        if(is_finish==false){
            CONSTS.score1=localStorage.getItem("palyer1_score");
            CONSTS.score2=localStorage.getItem("palyer2_score");
        }else{
            CONSTS.score1=0;
            CONSTS.score2=0;
        }
            draw();
            setEvents();
            roll();
            loop();    
    }
  
    function draw() {
        $('<div/>', { id: 'pong-game' }).css(CSS.arena).appendTo('body');
        $('<div/>', { id: 'pong-line' }).css(CSS.line).appendTo('#pong-game');
        $('<div/>', { id: 'pong-ball' }).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', { id: 'stick-1' }).css($.extend(CSS.stick1, CSS.stick))
            .appendTo('#pong-game');
        $('<div/>', { id: 'stick-2' }).css($.extend(CSS.stick2, CSS.stick))
            .appendTo('#pong-game');
        $('<div/>', { id: 'score-text2' }).css(($.extend(CSS.boardText_Player2, CSS.boardText))).appendTo('#pong-game');
        $('<div/>', { id: 'score-text1' }).css(($.extend(CSS.boardText_Player1, CSS.boardText))).appendTo('#pong-game');       
        $('<div/>', { id: 'board-1' }).css($.extend(CSS.scoreBoard1, CSS.board)).appendTo('#pong-game');
        $('<div/>', { id: 'board-2' }).css($.extend(CSS.scoreBoard2, CSS.board)).appendTo('#pong-game');
        $('#board-1').html(CONSTS.score1);
        $('#board-2').html(CONSTS.score2);
        $('#score-text1').html(CONSTS.player1);
        $('#score-text2').html(CONSTS.player2);  
        var btnPause = document.createElement("BUTTON"); 
        btnPause.id ='pause-btn'; 
        btnPause.innerHTML="PAUSE"; 
        var btnPlay=document.createElement("BUTTON");
        btnPlay.id="play-btn";
        btnPlay.innerHTML="PLAY";  
        // var btnSpeed=document.createElement("BUTTON");  
        // btnSpeed.id="speed-btn";
        // btnSpeed.innerHTML="2x Speed" 
        $('#pong-game').append(btnPause);
        $('#pong-game').append(btnPlay);
        // $('#pong-game').append(btnSpeed);
        $('#pause-btn').css({ "margin-left" : "390px" ,"margin-top":"10px"});
    }

    function setEvents() {
        $(document).on('keydown', function (e) {
            switch (e.keyCode) {               
                case 87:
                    CONSTS.stick1Speed = -30;                    
                    break;
                case 83:
                    CONSTS.stick1Speed = +30;                   
                    break;               
                case 38:
                    CONSTS.stick2Speed = -30;                   
                    break;
                case 40:
                    CONSTS.stick2Speed = +30;                  
                    break;
            }
        });

        $(document).on('keyup', function (e) {
            if (e.keyCode == 87) {
                CONSTS.stick1Speed = 0;
            }
            if (e.keyCode == 83) {
                CONSTS.stick1Speed = 0;
            }
            if (e.keyCode == 38) {
                CONSTS.stick2Speed = 0;
            }
            if (e.keyCode == 40) {
                CONSTS.stick2Speed = 0;
            }
        });
    }

    function loop() {
        localStorage.setItem("is_finish",false);
        var isPaused = false;
        $('#pause-btn').on('click', function(e) {
            e.preventDefault();
            isPaused = true;
          });
          
          $('#play-btn').on('click', function(e) {
            e.preventDefault();
            isPaused = false;
          });
        //   $('#speed-btn').on('click', function(e) {
        //     e.preventDefault();
        //    CONSTS.gameSpeed=10;
        //   });
        window.pongLoop = setInterval(function () {
           if(!isPaused){
               //left stick kontrol
               if (CSS.stick1.top <= 0 && CONSTS.stick1Speed < 0) {
                CSS.stick1.top = CSS.stick1.top;
                $('#stick-1').css('top', CSS.stick1.top);
            } else if (parseInt(CSS.stick1.top) + CSS.stick.height  >= (CSS.arena.height-CSS.ball.height) && CONSTS.stick1Speed > 0) {
                CSS.stick1.top = CSS.stick1.top;
            }
            else {
                CSS.stick1.top += CONSTS.stick1Speed;
                $('#stick-1').css('top', CSS.stick1.top);
            }
            //right stick kontrol
            if (CSS.stick2.top <= 0 && CONSTS.stick2Speed < 0) {
                CSS.stick2.top = CSS.stick2.top;
                $('#stick-2').css('top', CSS.stick2.top);
            } else if (parseInt(CSS.stick2.top) + CSS.stick.height >= (CSS.arena.height-CSS.ball.height) && CONSTS.stick2Speed > 0) {
                CSS.stick2.top = CSS.stick2.top;
            }
            else {
                CSS.stick2.top += CONSTS.stick2Speed;
                $('#stick-2').css('top', CSS.stick2.top);
            }
          

            CSS.ball.top +=  CONSTS.ballTopSpeed;
            CSS.ball.left += CONSTS.ballLeftSpeed;

            if (CSS.ball.top <= 0 ||CSS.ball.top >= CSS.arena.height - CSS.ball.height) {                
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
            }
           

            $('#pong-ball').css({ top: CSS.ball.top, left: CSS.ball.left });
            //top ve çubuk temas kontrol
            if (CSS.ball.left <= CSS.stick.width) {
                CSS.ball.top > CSS.stick1.top && CSS.ball.top < CSS.stick1.top + CSS.stick.height && ((CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1)) ;
                
            }
            else if((CSS.ball.left + CSS.ball.width) >= (CSS.arena.width -CSS.stick.width)){
                CSS.ball.top > CSS.stick2.top && CSS.ball.top < CSS.stick2.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1);
            }

           
            //kazanan kontrolü ve puan ekleme
            if(CSS.ball.left <=0){                
                CONSTS.score2++;                   
                if(CONSTS.score2 === 5){
                    alert('PLAYER-2 kazandı.. !!');
                    localStorage.setItem("is_finish",true);
                    CONSTS.score1=0;
                    CONSTS.score2=0;
                    $('#board-1').html(CONSTS.score1);
                }
                localStorage.setItem("player2_score",CONSTS.score2);  
                $('#board-2').html(CONSTS.score2);               
                roll();
            }
            if((CSS.ball.left +20) >= (CSS.arena.width)){               
                CONSTS.score1++;              
                if(CONSTS.score1 === 5){
                    alert('PLAYER-1 kazandı.. !!');
                    localStorage.setItem("is_finish",true);
                    CONSTS.score1=0;
                    CONSTS.score2=0;
                    $('#board-2').html(CONSTS.score2);
                }
                localStorage.setItem("player1_score",CONSTS.score1);   
                $('#board-1').html(CONSTS.score1);               
                roll();
            }


           }
         
        }, CONSTS.gameSpeed);
    }


    function roll() {
        CSS.ball.top =CSS.arena.height/2;
        CSS.ball.left =(CSS.arena.width/2)-(CSS.ball.width/2)

        var side = -1;

        if (Math.random() < 0.5) {
            side = 1;
        }

        CONSTS.ballTopSpeed = Math.random() * -2 - 3;       
        CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);
    }

    start();
})();