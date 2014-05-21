var play_state = {

    // No more preload, since it is already done in the 'load' state

    ////With alerts
    //     updateScore: function(userName, score) {
    //     alert("updating score");
    //     var GameScore = Parse.Object.extend("GameScore");
    //     var query = new Parse.Query(GameScore);

    //     query.equalTo("userName", userName);

    //     query.first({
    //         success: function(aGameScore) {
    //             alert("success");
    //             if (aGameScore === undefined) {
    //                 alert("Query - Success - GameScore userName: " + userName +" undefined");
    //                 var newGameScore = new GameScore();
    //                 newGameScore.save({"score": score, "userName":userName}, {
    //                     success: function(gameScore) {
    //                         alert('New object created with objectId: ' + gameScore.id);
    //                       },
    //                       error: function(gameScore, error) {
    //                         alert('Failed to create new object, with error code: ' + error.description);
    //                       }
    //                 });
    //             } else {
    //                 alert("Query - Success - Else - GameScore, userName: " + userName + " defined");
    //                 var totalScore = aGameScore.get("score") + score;
    //                 this.totalScore = totalScore;
    //                 aGameScore.save({"score": totalScore}, {
    //                     success: function(gameScore) {
    //                         alert("Query - Success - Else - GameScore, userName: " + userName + " defined - Save success existing obj updated");
    //                       },
    //                       error: function(gameScore, error) {
    //                         alert("Query - Success - Else - GameScore, userName: " + userName + " defined - Existing obj update error: " +  error.description);
    //                       }
    //                 });
    //             }
    //             //alert("ok" + gameScore.id );
    //         },
    //         error: function(object, error) {
    //             alert("Query - Error - GameScore userName: " + userName + " - Error Description: " + error.description);
    //         }
    //     })
    // },

    ////Without alerts
    updateScore: function(userName, score) {
        //alert("updating score");
        var GameScore = Parse.Object.extend("GameScore");
        var query = new Parse.Query(GameScore);

        query.equalTo("userName", userName);

        query.first({
            success: function(aGameScore) {
                //alert("success");
                if (aGameScore === undefined) {
                    //alert("Query - Success - GameScore userName: " + userName +" undefined");
                    var newGameScore = new GameScore();
                    newGameScore.save({"score": score, "userName":userName}, {
                        success: function(gameScore) {
                            //alert('New object created with objectId: ' + gameScore.id);
                          },
                          error: function(gameScore, error) {
                            //alert('Failed to create new object, with error code: ' + error.description);
                          }
                    });
                } else {
                    //alert("Query - Success - Else - GameScore, userName: " + userName + " defined");
                    var totalScore = aGameScore.get("score") + score;
                    this.totalScore = totalScore;
                    aGameScore.save({"score": totalScore}, {
                        success: function(gameScore) {
                            //alert("Query - Success - Else - GameScore, userName: " + userName + " defined - Save success existing obj updated");
                          },
                          error: function(gameScore, error) {
                            //alert("Query - Success - Else - GameScore, userName: " + userName + " defined - Existing obj update error: " +  error.description);
                          }
                    });
                }
                //alert("ok" + gameScore.id );
            },
            error: function(object, error) {
                //alert("Query - Error - GameScore userName: " + userName + " - Error Description: " + error.description);
            }
        })
    },
    create: function() { 
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this); 

        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');  
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);           

        this.bird = this.game.add.sprite(100, 245, 'bird');
        this.bird.body.gravity.y = 1000; 
        this.bird.anchor.setTo(-0.2, 0.5);
        
        // Not 'this.score', but just 'score'
        score = 0; 
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style); 

        this.jump_sound = this.game.add.audio('jump');

        //Initalize Parse
        Parse.initialize("cMPIYFDTszWMRtYin0RJSSaKKkSb1TfQeuyzgHcD", "fXQmdAtY71AmtiF5XXOS8PYcj4HNss2Cg1Hi7B7o");
        //alert("Paser initalized and calling update score");
        this.updateScore("alex2", score);
    },

    update: function() {
        if (this.bird.inWorld == false)
            this.restart_game(); 

        if (this.bird.angle < 20)
            this.bird.angle += 1;

        this.game.physics.overlap(this.bird, this.pipes, this.hit_pipe, null, this);      
    },

    jump: function() {
        if (this.bird.alive == false)
            return; 

        this.bird.body.velocity.y = -350;
        this.game.add.tween(this.bird).to({angle: -20}, 100).start();
        this.jump_sound.play();
    },

    hit_pipe: function() {
        if (this.bird.alive == false)
            return;

        this.bird.alive = false;
        this.game.time.events.remove(this.timer);

        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    restart_game: function() {
        this.game.time.events.remove(this.timer);

        //Pase.com
        this.updateScore("alex2", score);

        // This time we go back to the 'menu' state
        this.game.state.start('menu');
    },

    add_one_pipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();
        pipe.reset(x, y);
        pipe.body.velocity.x = -200; 
        pipe.outOfBoundsKill = true;
    },

    add_row_of_pipes: function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) 
                this.add_one_pipe(400, i*60+10);   
        
        // Not 'this.score', but just 'score'
        score += 1; 
        this.label_score.content = score;  
    },
};