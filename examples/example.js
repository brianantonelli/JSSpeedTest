$(document).ready(function(){
    speedtest.run(
        5, 
        function(percentageComplete){
            $("#speed-test").html("Measuring bandwidth ("+percentageComplete+"%)");
        },
        function(results){
            $("#speed-test").html("Bandwidth: " + results.kbps + " (kbps), " + results.KBps + " (KBps)");
        });
});