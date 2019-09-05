/*滚动条监听*/
(function(){
    window.onscroll = function () {
        var T=document.body.scrollTop,
            aT=document.querySelector("#top ul.rt a.hover"),
            asT=document.querySelectorAll("#top ul.rt a"),
            aF=document.querySelector(".Fixed>li a.hover"),
            asF=document.querySelectorAll(".Fixed>li a");
        /*aT=document.getElement*/
        if(T<770){
            aT.className="";
            aF.className="";
            asT[0].className="hover";
            asF[0].className="hover";
        }
        if(T>=770&&T<1590){
            aT.className="";
            aF.className="";
            asT[1].className="hover";
            asF[1].className="hover";
        }
        if(T>=1590&&T<1824){
            aT.className="";
            aF.className="";
            asT[2].className="hover";
            asF[2].className="hover";
        }
        if(T>=1824&&T<2324){
            aT.className="";
            aF.className="";
            asT[3].className="hover";
            asF[3].className="hover";
        }
        if(T>=2324){
            aT.className="";
            aF.className="";
            asT[4].className="hover";
            asF[4].className="hover";
        }
    };
})();
    /*顶部导航条点击效果*/
(function() {
    var asT=document.querySelectorAll("ul.rt>li a");
    /*点击头部导航条*/
    for(var i=0;i<asT.length;i++){
        (function(n) {
            asT[n].onclick = e=> {
                var Target = e.target,
                    aT = document.querySelector("ul.rt>li a.hover"),
                    aF = document.querySelector(".Fixed>li a.hover"),
                    asF = document.querySelectorAll(".Fixed>li a");
                Match(aT, asT, aF, asF, Target);
            }
        })(i);
    }
    /*点击右侧导航条*/
   var asF=document.querySelectorAll(".Fixed>li a");
   for(var i=0;i<asF.length;i++){
        (function(n){
            asF[n].onclick=e=>{
                var Target=e.target,
                    aF=document.querySelector(".Fixed>li a.hover"),
                    aT=document.querySelector("ul.rt>li a.hover"),
                    asT=document.querySelectorAll("ul.rt>li a");
             Match(aF,asF,aT,asT,Target);
            }
        })(i);
    }
    function Match(a,as,b,bs,Target){
        if(a){
            a.className="";
        }
        Target.className="hover";
        switch(Target){
            case as[0]:
                b.className="";
                bs[0].className="hover";
                break;
            case as[1]:
                b.className="";
                bs[1].className="hover";
                break;
            case as[2]:
                b.className="";
                bs[2].className="hover";
                break;
            case as[3]:
                b.className="";
                bs[3].className="hover";
                break;
            case as[4]:
                b.className="";
                bs[4].className="hover";
        }
    }
})();






















