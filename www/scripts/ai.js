function ai(){
    /*window.setInterval(function () {
        try {
            if (!pause) {
                for (var aiCamp = 1; aiCamp < colony.config.maxCamp; aiCamp++) {
                    if (aiCamp == colony.camp) continue;
                    var A = aiCamp;
                    var fromm = [],
                        to = undefined,
                        cent = undefined;
                    var len = colony.map.length,
                        dis = 10000000000;
                    var population = 0,
                        enemy_pop = [0, 0, 0, 0, 0, 0, 0],
                        enemy_star = [];
                    var no_people_star = [],
                        cnt = 0,
                        tmp = 0,
                        cnn = 0;
                    for (var i = 0; i < len; i++) {
                        var star = colony.map[i];
                        if (star[3] == 0) {
                            no_people_star[cnt] = i;
                            cnt++;
                        }
                        if (star[3] == aiCamp && !star[7]) {
                            fromm[tmp] = i;
                            tmp++;
                        }
                        if (star[3] > 0 && star[3] != aiCamp) {
                            enemy_pop[star[3]] += star[5][star[3]];
                            enemy_star[cnn] = i;
                            cnn++;
                        }
                    }
                    fromm.sort(function (a, b) {
                        return colony.map[b][5][aiCamp] - colony.map[a][5][aiCamp];
                    });
                    if (colony.ship.length > 0) {
                        for (i in colony.ship) {
                            if (colony.map[colony.ship[i][5]][3] == aiCamp && colony.ship[i][3] != aiCamp && colony.ship[i][2] > colony.map[colony.ship[i][5]][5][aiCamp]) {
                                if (colony.map[colony.ship[i][5]][5][aiCamp] > colony.map[colony.ship[4]][5][colony.ship[i][3]]) {
                                    to = colony.ship[i][4];
                                    colony.shipMove(colony.ship[i][5], to, aiCamp, 1);
                                }
                            } else {
                                to = fromm[0];
                                colony.shipMove(colony.ship[i][5], to, aiCamp, 1);
                            }
                        }
                    }
                    if (typeof (no_people_star[0]) != "undefined") {
                        for (i = 0; i < fromm.length; i++) {
                            if (colony.map[fromm[i]][5][aiCamp] >= 30) {
                                for (var j = 0; no_people_star[j] < 1000 && j < no_people_star.length; j++) {
                                    var B = colonyUI.distance(colony.map[fromm[i]][0], colony.map[fromm[i]][1], colony.map[no_people_star[j]][0], colony.map[no_people_star[j]][1]);
                                    if (colonyUI.distance(colony.map[fromm[i]][0], colony.map[fromm[i]][1], colony.map[no_people_star[j]][0], colony.map[no_people_star[j]][1]) < dis) {
                                        dis = colonyUI.distance(colony.map[fromm[i]][0], colony.map[fromm[i]][1], colony.map[no_people_star[j]][0], colony.map[no_people_star[j]][1]);
                                        to = no_people_star[j];
                                        no_people_star[j] = 1000;
                                    }
                                }
                                cent = 1;
                                colony.shipMove(fromm[i], to, aiCamp, cent);
                            }
                        }
                    } else {
                        for (i = 0; i < fromm.length; i++) {
                            from = fromm[i];
                            for (j = 0; j < enemy_star.length; j++) {
                                star = colony.map[enemy_star[j]];
                                if (star[5][star[3]] < colony.map[fromm[i]][5][aiCamp]) {
                                    to = enemy_star[j];
                                }
                                cent = 1;
                                colony.shipMove(from, to, aiCamp, cent);
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }, colony.config.aiThinkSpeed);*/
}