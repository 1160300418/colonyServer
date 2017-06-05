var StarNum,CampNum;
var starx = [],stary = [],shape = [],camp = [],type = [],visx = [],visy = [];
var aveStars = Math.floor(StarNum/CampNum);
var avedis = 1400/CampNum;
for(var i=0;i<aveStars;i++){
    var flag=0;
    starx[i] = Math.random()*(1400/CampNum)+1;//*200
    starx[i] = Math.round(starx[i]);
    if(visx[starx[i]]==1){
        flag++;
    }
    else visx[starx[i]]=1;
    stary[i] = Math.random()*6+2;//*100
    stary[i] = Math.round(stary[i]);
    if(visy[stary[i]]==1) flag++;
    else visy[stary[i]]=1;
    while(flag==2){
        flag --;
        stary[i] = Math.random()*6+2;
        stary[i] = Math.round(stary[i]);
        if(visy[stary[i]]==1) flag++;
    }
    shape[i] = Math.random()*2+1;
    shape[i] = Math.round(shape[i]);
    camp[i] = Math.round(Math.random());
    type[i] = Math.random()*2+1;
    type[i] = Math.round(type[i]);
    if(type[i]==2)
        type[i]=1;
}

var map = [];
for(i=0;i<StarNum;i++){
    map[i] = [];
    for(var j=0;j<5;j++){
        if(j==0){
            if(i<aveStars)
                map[i][j]=starx[i]*200;
            else{
                var tmp = Math.floor(i/aveStars);
                map[i][j]=starx[i-aveStars]*200+tmp*avedis;
            }
        }
        if(j==1){
            if(i<aveStars)
                map[i][j]=stary[i]*100;
            else{
                map[i][j]=stary[i-aveStars]*100;
            }
        }
        if(j==2){
            if(i<aveStars)
                map[i][j]=shape[i];
            else
                map[i][j]=shape[i-aveStars];
        }
        if(j==3){
            if(i<aveStars)
                map[i][j]=camp[i];
            else{
                var tmp = Math.floor(i/aveStars);
                if(camp[i-aveStars]==1)
                    map[i][j]=camp[i-aveStars]+tmp;
                else
                    map[i][j]=0;
            }
        }
        if(j==4){
            if(i<aveStars)
                map[i][j]=type[i];
            else
                map[i][j]=type[i-aveStars];
        }
    }
}