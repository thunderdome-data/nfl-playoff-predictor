var activeCalSq = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
var activeDates = ["DEC 15", 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, "JAN 1", 2, 3, 4, 5, 6, 7];

var allData = [];
var dailygames = [2, 0, 0, 0, 0, 1, 1, 2, 0, 1, 0, 1, 3, 3, 5, 0, 4, 6, 1, 1, 1, 1, 1, 1];
var idcount = 0;
var idstring = "";
var idarray = [];

var currentHighlighted;
var clickedOn;

function bowlgamesInit() {
	$('#theDetails').hide();
	$('#theListings').hide();


	//POPULATE ID ARRAY WITH INDEX NUMBERS THAT CORRESPOND TO ALLDATA ARRAY
	for (var n=0; n<dailygames.length; n++) {
		for (var o=0; o<dailygames[n]; o++) {
			idstring += idcount;
			if (o < dailygames[n]-1) {
				idstring += "/";
			}
			idcount ++;
		}
		idarray.push(idstring);
		idstring = "";
	}
	
	//CREATE CAL GRID
	for (var i=0; i<35; i++) {
		var node = document.createElement("div");
		node.setAttribute('id', 'gen'+i);
		node.setAttribute('class', 'calsq');
		
		//HIGHLIGHT ACTIVE SQUARES
		for (var j=0; j<activeCalSq.length; j++) {
			
			if (i == activeCalSq[j]) {
				
				node.setAttribute('class', 'sqactive');
				node.setAttribute('id', j);
				node.setAttribute('data-theids', idarray[j]);
				
				//SET CAL NUMS
				var numDisp = document.createElement("div");
				numDisp.setAttribute('id', 'date_' + j);
				numDisp.setAttribute('class', 'dateNumber');
				$(numDisp).text(activeDates[j]);
				node.appendChild(numDisp);
				
				if (idarray[j].length > 0) {
					node.onclick = function() { onSqClick(this.id); };
				
				} else {
					node.setAttribute('class', 'calsq');
				}
				
				//DOTS
				for (var k=0; k<dailygames[j]; k++) {
					var caldot = document.createElement('img');
					caldot.setAttribute('class', 'calDot');
					caldot.setAttribute('src', 'images/dot.png');
					node.appendChild(caldot);
				}
			}	
		
		}
		
		$('#bowlCalCon').append(node);
	}
	
	//DATE STUFF
	var d = new Date();
	var theDate = d.getDate();
	var theMonth = d.getMonth();
	//var theDate = 17;
	//var theMonth = 11;
	//console.log("month: " + theMonth + " day: " + theDate);
	
	var tmpDay;
	if (theMonth == 11 && theDate < 16) {
		tmpDay = 0;
	} else if (theMonth == 11) {
		tmpDay = theDate - 15;
	} else if (theMonth == 0 && theDate < 8) {
		tmpDay = theDate + 16;
	} else {
		tmpDay = 23;
	}
	
	currentHightlighed = tmpDay;
	$('#' + tmpDay).addClass('sqcurrent');
	onSqClick(tmpDay);
}

function populateDetails(id,multi) {
	$("#theDetails").show();
	$("#theListings").hide();
	
	if (allData[id][0].gameover == "no") {
		$("#dateLine").text(allData[id][0].date + " - " + allData[id][0].time);
		$("#bowlInfo").text(allData[id][0].stadium + ", " + allData[id][0].location + "; Broadcast: " + allData[id][0].broadcast);
		$("#bowlText").html(allData[id][0].thetext);
	} else  {
		$("#dateLine").text(allData[id][0].date);
		$("#bowlInfo").html(allData[id][0].team1 + " <strong>" + allData[id][0].team1score + "</strong>, " + allData[id][0].team2 + " <strong>" + allData[id][0].team2score + "</strong>  FINAL");
		$("#bowlText").html(allData[id][0].recap);
	}
	
	if (multi != undefined) {
		$("#dateLine").append("&nbsp;&nbsp;&nbsp;&nbsp;" + "<div class='backtoall'><a href='#' onclick='onSqClick(" + currentHighlighted + ")' >&#171; all games today</a></div>");
	} 
	
	$("#bowlName").text(allData[id][0].bowlname);
	$("#schoolName1").text(allData[id][0].team1);
	$("#schoolName2").text(allData[id][0].team2);
	$("#schoolInfo1").text(allData[id][0].team1rec);
	$("#schoolInfo2").text(allData[id][0].team2rec);
	
	$('#bowlDetailsCon #schoolLogo1').empty();
	$('#bowlDetailsCon #schoolLogo1').append(loadLogo(allData[id][0].team1logo));
	$('#bowlDetailsCon #schoolLogo2').empty();
	$('#bowlDetailsCon #schoolLogo2').append(loadLogo(allData[id][0].team2logo));
	
}

function loadLogo(logoURL) {
	var logo = new Image();
	logo.src = logoURL;
	logo.onload = function() {
		if (this.width > this.height)  {
			this.width = 50;
		} else {
			this.height = 50;
		}
	}
	return(logo);
}

function onSqClick(id) {

	var tmpId = $('#' + id).attr('data-theids');
	
	if (dailygames[id] == 1) {
		//FOR SINGLE GAMES
		$("#theDetails").show();
		$("#theListings").hide();
		
		populateDetails(tmpId);
		
	} else if (dailygames[id] > 1) {
		//FOR MULTIPLE GAMES
		$("#theDetails").hide();
		$("#theListings").html("");
		$("#theListings").show();
		
		var tmpIDArray = [];
		tmpIDArray = tmpId.split("/");
		//console.log(tmpIDArray);
		
		for (var i=0; i<tmpIDArray.length; i++) {
			var passID = tmpIDArray[i];
			var over = "";
			if (allData[tmpIDArray[i]][0].gameover == "no" ) { 
				over = "Preview"; 
			} else { 
				over = "Recap" 
			}
			
			$("#theListings").append("<div><div id='dateLine" + tmpIDArray[i] + "' class='dateLine'>" + allData[tmpIDArray[i]][0].date + " - " + allData[tmpIDArray[i]][0].time  + "</div><div id='bowlName" + tmpIDArray[i] + "' class='bowlName'>" + allData[tmpIDArray[i]][0].bowlname + "</div><div id='bowlTeams" + tmpIDArray[i] + "' class='bowlTeams listing'><div class='bowlTeam'><div id='s1logo" + tmpIDArray[i] + "' class='schoolLogo'><img src='" + allData[tmpIDArray[i]][0].team1logo + "' width='50' /></div><div class='schoolName'>" + allData[tmpIDArray[i]][0].team1 + "</div><div class='schoolInfo'>" + allData[tmpIDArray[i]][0].team1rec + "</div></div><div class='bowlTeam'><div id='s2logo" + tmpIDArray[i] + "'class='schoolLogo'><img src='" + allData[tmpIDArray[i]][0].team2logo + "' width='50' /></div><div class='schoolName'>" + allData[tmpIDArray[i]][0].team2 + "</div><div class='schoolInfo'>" + allData[tmpIDArray[i]][0].team2rec + "</div></div><div id='btn" + tmpIDArray[i] + "' class='bowlBtn' data-id='" + tmpIDArray[i] + "'>" + over + "</div></div></div>");
			
			$("#btn" + passID).click(function () { populateDetails($(this).attr("data-id"),"yes"); });
			
		}
		
	} else {
		//console.log("no games");
		$("#theDetails").hide();
		$("#theListings").html("There are no games today. Select a date from the calendar.");
		$("#theListings").show();;
	}
	
	$('#' + currentHighlighted).removeClass('sqcurrent');
	currentHighlighted = id;
	$('#' + id).addClass('sqcurrent');
}

function loadGSContent(gsData) {
	var tmpCount = 1;
	var tmpIndex = 0;
	var $len = gsData.feed.entry.length;
	totalEntries = $len;
	
	for (var i=0; i<totalEntries; i++) {
		var counter = gsData.feed.entry[i].gsx$id.$t;
		allData[counter] = [ {
								myid: gsData.feed.entry[i].gsx$id.$t,
								date: gsData.feed.entry[i].gsx$dateformatted.$t,
								time: gsData.feed.entry[i].gsx$time.$t,
								bowlname: gsData.feed.entry[i].gsx$bowlname.$t,
								location: gsData.feed.entry[i].gsx$location.$t,
								stadium: gsData.feed.entry[i].gsx$stadium.$t,
								broadcast: gsData.feed.entry[i].gsx$broadcast.$t,
								team1: gsData.feed.entry[i].gsx$team1.$t,
								team2: gsData.feed.entry[i].gsx$team2.$t,
								team1rec: gsData.feed.entry[i].gsx$team1record.$t,
								team2rec: gsData.feed.entry[i].gsx$team2record.$t,
								thetext: gsData.feed.entry[i].gsx$preview.$t,
								recap: gsData.feed.entry[i].gsx$recap.$t,
								gameover: gsData.feed.entry[i].gsx$gameover.$t,
								team1score: gsData.feed.entry[i].gsx$team1score.$t,
								team2score: gsData.feed.entry[i].gsx$team2score.$t,
								team1logo: gsData.feed.entry[i].gsx$team1logo.$t,
								team2logo: gsData.feed.entry[i].gsx$team2logo.$t
						    }];
		
		//COUNT GAMES PER DAY
		/*
		if (i > 0) {
			if (gsData.feed.entry[i].gsx$dateformatted.$t == gsData.feed.entry[i-1].gsx$dateformatted.$t) {
				tmpCount ++;
				dailygames[tmpIndex] = tmpCount;
			} else {
				tmpIndex ++;
				tmpCount = 1;
				dailygames[tmpIndex] = 1;
			}
		}
		*/
		
	}
	//bowlgamesInit();
}

$(document).ready(function() {
	bowlgamesInit();

});