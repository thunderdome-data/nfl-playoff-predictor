
var matchupHTML = ""; // matchup HTML

var allData = [];

var resetText;

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function predictorInit() {

	resetText = $("#sortableStats").html();
	
	var matchupsLen = allData.length / 2;
	
	// place expert and module side text
	for (var i=0; i<matchupsLen; i++) {
		$("#mod" + i + " .datetime").html(allData[i * 2][0].date + " <br />" + allData[i * 2][0].time);
		$("#mod" + i + " .line").html("<span class='sideHeader'>Line</span><br />" + allData[i * 2][0].line);
		//$("#form .poll1").text(allData[i * 2][0].cityabbr);
	}
	
	// expert picks text coded for Super Bowl (one matchup)
	$("#exp0 p.expertText").html(allData[0][0].expert);
	$("#exp1 p.expertText").html(allData[1][0].expert);

	
	// fill in data for team1 and team2 in the matchups
	for (var i=0; i<matchupsLen; i++) {
		var j = i * 2;
		$("#mod" + i + " .team1 img.teamLogo").attr({src: allData[j][0].logo, width:46, height:46});
		$("#mod" + i + " .team1 .cityName").text(allData[j][0].teamcity);
		$("#mod" + i + " .team1 .teamName").text(allData[j][0].teamname);
		$("#mod" + i + " .team1 .teamData").html("Record: " + allData[j][0].record + " <br />Seed: " + allData[j][0].seed + " <br />" + allData[j][0].homeaway);
		$("#mod" + i + " .team1 .passo").text(addCommas(allData[j][0].passo));
		$("#mod" + i + " .team1 .passd").text(addCommas(allData[j][0].passd));
		$("#mod" + i + " .team1 .rusho").text(addCommas(allData[j][0].rusho));
		$("#mod" + i + " .team1 .rushd").text(addCommas(allData[j][0].rushd));
		$("#mod" + i + " .team1 .tomargin").text(allData[j][0].tomargin);
		$("#mod" + i + " .team1 .ptsfor").text(allData[j][0].ptsfor);
		$("#mod" + i + " .team1 .ptsagainst").text(allData[j][0].ptsagainst);
		//$("#form" + i + " input.poll1").text(allData[j][0].cityabbr);
		
		$("#mod" + i + " .team2 img.teamLogo").attr({src: allData[j+1][0].logo, width:46, height:46});
		$("#mod" + i + " .team2 .cityName").text(allData[j+1][0].teamcity);
		$("#mod" + i + " .team2 .teamName").text(allData[j+1][0].teamname);
		$("#mod" + i + " .team2 .teamData").html("Record: " + allData[j+1][0].record + " <br />Seed: " + allData[j+1][0].seed + " <br />" + allData[j+1][0].homeaway);
		$("#mod" + i + " .team2 .passo").text(addCommas(allData[j+1][0].passo));
		$("#mod" + i + " .team2 .passd").text(addCommas(allData[j+1][0].passd));
		$("#mod" + i + " .team2 .rusho").text(addCommas(allData[j+1][0].rusho));
		$("#mod" + i + " .team2 .rushd").text(addCommas(allData[j+1][0].rushd));
		$("#mod" + i + " .team2 .tomargin").text(allData[j+1][0].tomargin);
		$("#mod" + i + " .team2 .ptsfor").text(allData[j+1][0].ptsfor);
		$("#mod" + i + " .team2 .ptsagainst").text(allData[j+1][0].ptsagainst);
		//$("#mod" + i + " .poll2").text(allData[j+1][0].cityabbr);
	}
	//Do default win calculation
	doneSort();
}


function loadGSContent(gsData) {
	var dataLen = gsData.feed.entry.length;
	
	for (var i=0; i<dataLen; i++) {
		var counter = gsData.feed.entry[i].gsx$id.$t;
		allData[counter] = [ {
								myid: gsData.feed.entry[i].gsx$id.$t,
								matchup: gsData.feed.entry[i].gsx$matchup.$t,
								teamcity: gsData.feed.entry[i].gsx$teamcity.$t,
								teamname: gsData.feed.entry[i].gsx$teamname.$t,
								logo: gsData.feed.entry[i].gsx$logo.$t,
								record: gsData.feed.entry[i].gsx$record.$t,
								seed: gsData.feed.entry[i].gsx$seed.$t,
								homeaway: gsData.feed.entry[i].gsx$homeaway.$t,
								passo: gsData.feed.entry[i].gsx$passo.$t,
								passd: gsData.feed.entry[i].gsx$passd.$t,
								rusho: gsData.feed.entry[i].gsx$rusho.$t,
								rushd: gsData.feed.entry[i].gsx$rushd.$t,
								tomargin: gsData.feed.entry[i].gsx$tomargin.$t,
								ptsfor: gsData.feed.entry[i].gsx$ptsfor.$t,
								ptsagainst: gsData.feed.entry[i].gsx$ptsagainst.$t,
								date: gsData.feed.entry[i].gsx$date.$t,
								time: gsData.feed.entry[i].gsx$time.$t,
								line: gsData.feed.entry[i].gsx$line.$t,
								expert: gsData.feed.entry[i].gsx$expert.$t,
								cityabbr: gsData.feed.entry[i].gsx$cityabbr.$t
						    }];
	}
}

//SORTING AND CHECKBOX STUFF
$(function() {
    $( "#sortableStats" ).sortable({
        placeholder: "statsPlaceHolder",
        stop: doneSort
    });
    $( "#sortableStats" ).disableSelection();

});

function doneSort() {
    var sortedIDs = [];
    $("#sortableStats input:checked").each(function(i) {
    	sortedIDs[i] = $(this).attr('id');
    });
    calculateWin(sortedIDs);
}

function cbChanged(cb, which) {
	doneSort();
}
//END SORTING AND CHECKBOX STUFF

$(document).ready(function() {
	predictorInit();

	$('#selectAll').click(function () {
    	$("#sortableStats .statsCheck").prop('checked', true);
    		doneSort();
	});

	$('#clearAll').click(function () {
    	$("#sortableStats .statsCheck").prop('checked', false);
    		doneSort();
	});

	$('#reset').click(function () {
    	$("#sortableStats").html(resetText);
    		doneSort();
	});

});