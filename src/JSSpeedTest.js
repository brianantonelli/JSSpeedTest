/**  
  * JSSpeedTest
  *
  * Copyright (c) 2011 Brian Antonelli (http://brianantonelli.com)
  * Freely distributable under the terms of an MIT-style license.
  * http://www.opensource.org/licenses/mit-license.php
*/

var speedtest = {
    size:"145121",
    image:"speed_test.jpg",
    runCount:4,
    totalRuns:0,
    results:[],
    poller:null,
    progressCallback:null, 
    completeCallback:null,
    
    run:function(runCount, progressCallback, completeCallback){
        this.progressCallback = progressCallback;
        this.completeCallback = completeCallback;
        this.results = [];
        this.totalRuns = 0;
        this.runCount = runCount;
        
        var that = this,
            regexp = /JSSpeedTest\.js(\?.*)?$/;
            
        $("script").each(function(i,s){
            if($(s).attr("src").match(regexp)){
                that.image = $(s).attr("src").replace(regexp, "") + that.image;
                return;
            }
        });

        this.poller = window.setInterval(function(){ that.poll(); }, 100);
        this.performTest();
    },
    
    poll:function(){
        if(this.results.length === this.runCount){
            window.clearInterval(this.poller);
            this.poller = null;
            
            var totalDuration = 0;
            for(var i=0; i<this.runCount; i++){
                totalDuration += this.results[i];
            }
            
            var averageRun = totalDuration / this.runCount;

            this.completeCallback.call(this, {
                kbps: (this.size * 8 / 1024 / (averageRun / 1000)).toFixed(0),
                KBps: (this.size / 1024 / (averageRun / 1000)).toFixed(0)
            });
        }
    },
    
    performTest:function(){
        var that      = this,
            startedAt = new Date().getTime();
        this.totalRuns++;

        $("<img/>")
            .load(function(){
                that.results.push(new Date().getTime() - startedAt);
                if(that.totalRuns < that.runCount){
                    that.performTest();
                    if(that.progressCallback != null && typeof that.progressCallback === "function"){
                        that.progressCallback.call(this, that.totalRuns / that.runCount*100);
                    }
                }
            })
            .attr("src", this.image + "?" + new Date().getTime());
    }
};
