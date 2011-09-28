 /**  
  * JSSpeedTest
  *
  * Copyright (c) 2011 Brian Antonelli (http://brianantonelli.com)
  * Freely distributable under the terms of an MIT-style license.
  * http://www.opensource.org/licenses/mit-license.php
*/

(function($){
    var size = "145121",
        image = "speed_test.jpg",
        runCount = 4,
        totalRuns = 0,
        results = [],
        poller = null,
        progressCallback = null, 
        completeCallback = null;
    
    function poll(){
        if(results.length === runCount){
            window.clearInterval(poller);
            poller = null;
            
            var totalDuration = 0;
            for(var i=0; i<runCount; i++){
                totalDuration += results[i];
            }
            
            var averageRun = totalDuration / runCount;

            completeCallback.call(this, {
                kbps: (size * 8 / 1024 / (averageRun / 1000)).toFixed(0),
                KBps: (size / 1024 / (averageRun / 1000)).toFixed(0)
            });
        }
    };
    
    function performTest(){
        var startedAt = new Date().getTime();
        totalRuns++;

        $("<img/>")
            .load(function(){
                results.push(new Date().getTime() - startedAt);
                if(totalRuns < runCount){
                    performTest();
                    if(progressCallback != null && typeof progressCallback === "function"){
                        progressCallback.call(this, totalRuns / runCount*100);
                    }
                }
            })
            .attr("src", image + "?" + new Date().getTime());
    };
    
    $.jsSpeedTest = function(myRunCount, myProgressCallback, myCompleteCallback){
        progressCallback = myProgressCallback;
        completeCallback = myCompleteCallback;
        results = [];
        totalRuns = 0;
        runCount = myRunCount;
        
        var regexp = /jsSpeedTest\.js(\?.*)?$/i;
            
        $("script").each(function(i,s){
            if($(s).attr("src").match(regexp)){
                image = $(s).attr("src").replace(regexp, "") + image;
                return;
            }
        });

        poller = window.setInterval(function(){ poll(); }, 100);
        performTest();
    };
    
    return this;
})(jQuery);