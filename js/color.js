// The color-picker was inspired by piklor.js which license is included below:

// The MIT License (MIT)

// Copyright (c) 2015-16 jillix <contact@jillix.com>

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

$(function(){

    // VARIABLE DECLARATIONS
    var WIDTH = 328;
    var HEIGHT = 328;

    var FG_WIDTH = 40;
    var FG_HEIGHT = 40;    

    var missCounter = 0;
    var hitCounter = 0;
    var opacity = 1.0;
    var threshold = 1.0; // crude value of lowest opacity with successful hit

    var COLORS = [
        "rgb(0,0,0)"
      , "rgb(64,64,64)"
      , "rgb(0,48,191)"
      , "rgb(0,0,255)"
      , "rgb(0,64,255)"
      , "rgb(0,128,255)"
      , "rgb(0,191,255)"
      , "rgb(0,255,255)"
      , "rgb(0,255,191)"
      , "rgb(0,255,128)"
      , "rgb(0,255,64)"
      , "rgb(0,255,0)" 
      , "rgb(0,191,0)"
      , "rgb(255,255,255)"
      , "rgb(140,140,140)"
      , "rgb(255,255,0)"
      , "rgb(255,128,0)"
      , "rgb(255,0,64)"
      , "rgb(255,0,0)" 
      , "rgb(255,0,64)"
      , "rgb(255,0,128)"
      , "rgb(255,0,191)"     
      , "rgb(255,0,255)"
      , "rgb(191,0,255)"
      , "rgb(128,0,255)"
      , "rgb(96,0,191)"
    ];

    var targets = {"fg-button":["fg-color"],
                   "bg-button":["bg-color"]
                };


    // INITIALIZE ELEMENT STATES
    $("#bg").css("width",`${WIDTH}px`)
            .css("height",`${HEIGHT}px`); 

    var top = (HEIGHT-FG_HEIGHT)*0.5;
    var left = (WIDTH-FG_WIDTH)*0.5;
    var center = [top,left];

    $("#fg").css("width",`${FG_WIDTH}px`)
            .css("height",`${FG_HEIGHT}px`)
            .css("top",`${top}px`)   
            .css("left",`${left}px`);  

    // $("#picker-container").css("opacity","10%");
    $(".color-picker#fg-button").addClass("active");

    // create color palette
    $("#palette").html(makePalette(COLORS));   

    // EVENTS
    $("#bg").on("click", function(e){

        if ( e.target.id == "fg" ){
            
            threshold = (opacity < threshold) ? opacity : threshold;
            
            opacity *= 0.90;

            $("#fg").fadeTo(50,1).fadeTo(100,0,function(){

                // change the position of fg randomly within the bg box
                var [top,left] = getNewRandomPosition(FG_WIDTH,FG_HEIGHT,WIDTH,HEIGHT);

                $("#fg").css("top",`${top}px`)
                        .css("left",`${left}px`)
                        .fadeTo(150,opacity); 
            }); 

            // give feedback
            hitCounter++;
            $("output#hits").text(hitCounter);

        } else {

            opacity *= 1.10;
            opacity = opacity < 1 ? opacity : 1;

            $("#fg").fadeTo("fast",opacity);  

            missCounter++; 
            $("output#misses").text(missCounter);          
        } // end if-else 

        $("output#current-opacity").text(opacity.toFixed(3));
        $("output#opacity").text(threshold.toFixed(3));
    });

    $("#picker-container").on("mouseout",function(){
        $(this).css("opacity","10%");
    });

    $("#picker-container").on("mouseover",function(){
        $(this).css("opacity","100%");
    });

    $(".color-picker").on("click",function(e){  
        $(".color-picker").removeClass("active");
        $(this).addClass("active");
    });

    $("#palette").on("click",function(e){
        var col = e.target.dataset.col;

        if (col){
            targetId = $(".color-picker.active")[0].id;
            targetClass = targets[targetId];
            $(`.${targetClass}`).css("background-color",col);
        };
    });

    $("#reset-button").on("click",function(e){
        $(".color").css("opacity",1.0);
        opacity = 1.0;
        threshold = 1.0;
        hitCounter = 0;
        missCounter = 0;
        $("output").text(0);
        $("output#opacity").text(1.0);
        $("output#current-opacity").text(1.0);

        [top, left] = center;
        $("#fg").css("top",`${top}px`)
                .css("left",`${left}px`);

    });

});

function getNewRandomPosition(elWidth, elHeight, boxWidth, boxHeight){
    var newLeft = Math.floor(Math.random()*(boxWidth-elWidth));
    var newTop = Math.floor(Math.random()*(boxHeight-elHeight));

    return [newTop, newLeft];
}

function makePalette(colorArray){
    var html = "";

    colorArray.forEach(function(color){
        html += `<div data-col="${color}" style="background-color: ${color}"></div>`;
    });

    return html;
}
