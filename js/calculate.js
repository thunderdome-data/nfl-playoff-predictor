/* 
author: Peggy Bustamante
project: Super Bowl predictor
date:	Jan. 09, 2013

*/

var calcData = [];
var addedNum = 0;

function calculateWin(statIDs) {
	if (statIDs.length < 1 ) {
		var matchupsLen = allData.length / 2;
		for (var i=0; i<matchupsLen; i++) {
			$("#mod" + i + " .team1 .numBox").text("00%");
			$("#mod" + i + " .team2 .numBox").text("00%");
		}
	
	} else {
		var matchCalcLen = calcData.length / 2;
		var statIDsLen = statIDs.length;

		// do calculations for each matchup
		for (var i=0; i<matchCalcLen; i++) { 
			
			var statsWeightedTeam1 = 0;
			var statsWeightedTeam2 = 0;
			var statsDivisor = 0;
			var weight = statIDsLen;
			var k = i * 2;
			
			for (var j=0; j<statIDsLen; j++) {
				statsWeightedTeam1 += parseInt(eval("calcData[k][0]." + statIDs[j])) * weight;			
				statsWeightedTeam2 += parseInt(eval("calcData[k+1][0]." + statIDs[j])) * weight;
				statsDivisor += weight;
				weight--;
			}
	
			// calculate team1 and team2 percentages
			temp1perc = statsWeightedTeam1 / statsDivisor;
			temp2perc = statsWeightedTeam2 / statsDivisor;
			
			team1winperc = Math.round((100 * temp1perc) / (temp1perc + temp2perc));
			team2winperc = Math.round((100 * temp2perc) / (temp1perc + temp2perc));
			
			// drop final percent into html
			$("#mod" + i + " .team1 .numBox").text(team1winperc + "%");
			$("#mod" + i + " .team2 .numBox").text(team2winperc + "%");
	
		}
	}
}

function loadCalcData(gsData) {
	var dataLen = gsData.feed.entry.length;

	for (var i=0; i<dataLen; i++) {
		var counter = gsData.feed.entry[i].gsx$id.$t;
		calcData[counter] = [ {
								myid: gsData.feed.entry[i].gsx$id.$t,
								matchup: gsData.feed.entry[i].gsx$matchup.$t,
								team: gsData.feed.entry[i].gsx$team.$t,
								a0: gsData.feed.entry[i].gsx$passo.$t,
								a1: gsData.feed.entry[i].gsx$passd.$t,
								a2: gsData.feed.entry[i].gsx$rusho.$t,
								a3: gsData.feed.entry[i].gsx$rushd.$t,
								a4: gsData.feed.entry[i].gsx$tomargin.$t,
								a5: gsData.feed.entry[i].gsx$ptsfor.$t,
								a6: gsData.feed.entry[i].gsx$ptsagainst.$t,
								a7: gsData.feed.entry[i].gsx$seed.$t,
								a8: gsData.feed.entry[i].gsx$wins.$t,
								a9: gsData.feed.entry[i].gsx$homeaway.$t						    }];
	}
}

