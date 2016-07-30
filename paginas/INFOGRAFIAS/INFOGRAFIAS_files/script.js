
var stage, slider;
var countries = new Array();

var countries_index = {
	year_voting: {},
	year_elected: {},
	year_standing: {}
};

var country_ids = {};
var country_order = {};
var country_strings = {};
var active_country;
var stage_width = 940;
var additional_view = false;
var mode = 'year_voting';
var hide_t;
var initial_time = true;


$(document).ready(function(){
	retrieveData();
    calculateInfoPos();
	stage = Raphael("target", stage_width, 605);
	slider_stage = Raphael("slider", stage_width, 50);
	stage.rect(0, 0, stage.width, stage.height).attr({
		stroke: 0,
		fill: '#e6e6e6'
	}).click(	
		hideTool
	).hover(function(){
			hide_t = setTimeout(function(){
				hideTool();
			}, 400);
		}
	);
	makeSlider(slider_stage, stage_width, 25, 18, highlights[mode][0]);
	$('#menu .mode-holder').click(switchMode);
	
	var hover_config = {    
    	over: expandShare,    
    	timeout: 400,    
    	out: contractShare   
    };	
	$('#share, #master-info-box').click(toggleAboutSection);
	$('.mode-holder').hover(hoveredMenuItem, unhoveredMenuItem).click(activateMode);
	$('.arrow').click(function(){	
		if ($(this).hasClass('left')){
			traverseCountries(-1);
		} else {
			traverseCountries(1);
		}
	}).hover(arrowIn, arrowOut);
	setInterval(flashLink, 1000);
	$('#close').click(deactivateAdditional);
});


function traverseCountries(direction){
	var current_alpha_position = country_order[active_country.data('id')];
	var next_country_position = parseInt(current_alpha_position) + direction;
	if(typeof(country_ids[next_country_position]) == 'object'){
		initiateMeta(false, country_ids[next_country_position]);
	}
}

function retrieveData(){
	$.ajax({
		url: 'db_out.php',
		dataType: 'json',
		type: 'GET',
		scriptCharset: "utf-8",
		success: function(data){
			country_order = data.alph_index;
			for(var i in data.countries){
				drawCountry(data.countries[i]);
			}
			$('#loader').remove();	

			stage.path("M460.828,280.403 443.248,304.027 443.052,309.731 457.642,309.731 462.013,302.903 462.013,288.908 473.833,288.908 473.833,280.403Z").attr({
				stroke: '#fff',
				fill: '#fff'
			}).transform('s0.8,0.8,30,-250');	
			stage.path("M959.547,300.979 964.693,305.952 967.835,296.798 964.693,293.42Z").attr({
				stroke: '#fff',
				fill: '#fff'
			}).transform('s0.8,0.8,30,-250');	
			stage.path("M635.055,362.833 618.797,363.289 598.322,362.407 598.432,362.833 613.524,380.769 625.327,385.222 646.3,382.188 633.009,367.818Z").attr({
				stroke: '#fff',
				fill: '#fff'
			}).transform('s0.8,0.8,30,-250');	
			
		},
		error: function(a,b,c){
		}
	});
}

function toggleAboutSection(evt){
	if ($(evt.target).prop('tagName') != 'A'){		
		var $info = $('#master-info-box');
		if($info.is(':visible')){
			$info.fadeOut(300);
		} else {
			$info.fadeIn(300);
		}
	}
	hideTool();
}

function switchMode(e){
	returnActiveCountry(active_country);
	for(var i in no_data[mode]){
		no_data[mode][i].data('no_data', false);
	}
	e.preventDefault();
	mode = this.id;
	amendMap(text.attr('x'), text);
	button.attr({
		fill: highlights[mode][0]
	});	
	for(var i in no_data[mode]){
		no_data[mode][i].attr({
			fill: '#fff',
			stroke: '#fff'
		}).data('no_data', true);
	}		
}

function initiateMeta(evt, internal, external){
	if (initial_time){
		initial_time = !initial_time;
	}
	var country, id;	
	if (evt != false){
		active_country = this;
	} else if (internal != false) {
		returnActiveCountry(active_country);
		active_country = internal;
		activateMapCountry(active_country);
	} else {
		active_country = external;
	}
	country = active_country.data('country');
	id = active_country.data('id');	
		
	if (!additional_view){
		$('#tool, #menu').fadeOut(200);
		$('#additional-content-holder').animate({
			height: 400
		}, 1000, function(){
			appendAdditionalContent(country, id, true);
		});
		additional_view = !additional_view;
	} else {
		appendAdditionalContent(country, id);
	}
}

function makeSlider(target, w, h, button_radius, high_color) {
		var s = target.set();
		var indicators = target.set();
		var slider_intent = false;
		button_group = target.set();				
		button = target.ellipse(30, h, button_radius, button_radius).attr({
			stroke: 0,
			fill: high_color
		});
		button_group.push(button);
		text = target.text(30, 25,"1892").attr({
			'font-size': 12,
			'fill': '#fff'
		});		
		button_group.push(text);
		s.push(button_group);
		
		if (!$("html").hasClass("lt-ie9")) {		
		
			for(var i = 30; i < (w - 30); i += 10){
				target.rect(i, 22.5, 1, 5).attr({
					fill: '#000',
					stroke: 0
				}).toBack();
				indicators.push(
					target.rect(i, 5, 10, 40).attr({
						fill: 'rgba(255,0,0,0)',
						stroke: 0
					}).click(function(){
						move(this.attr('x'), true);
					}).toFront()
				);
			}
		} else {
			for(var i = 30; i < (w - 30); i += 10){
				target.rect(i, 22.5, 1, 5).attr({
					fill: '#000',
					stroke: 0
				}).toBack();
			}
		}
		var ox = 30;
		var start = function (){
        	ox = button.attr('cx');
			if (!$("html").hasClass("lt-ie9")) {	
				button.attr({
            		stroke: 'rgba(0,0,0,.1)',
            		'stroke-width': 8
            	});
			} else {
				button.attr({
            		stroke: 'rgb(0,0,0)',
            		'stroke-width': 3
            	});
			}
        	if(additional_view){
        		slider_intent = true;
        	} 
       		returnActiveCountry(active_country);
        	$('#year-indicator').show();
        	if ($('#slider').hasClass('deactivated')){
	        	sliderActivate();
        	}
        },
        
        move = function (dx, click_interaction){
        	var new_pos;
        	if (click_interaction == true){
         		returnActiveCountry(active_country);
        		new_pos = dx;
    		} else {
	    		new_pos = ox + dx;
    		}
        	if((new_pos >= 30) && (new_pos <= stage_width - 30)){
            	button.attr({
        			cx: new_pos
        		});
        		text.attr({
	        		x: new_pos
        		});
        		amendMap(new_pos, text);
    		}
    	},
    	up = function (){
        	button.attr({
            	stroke: 0
        	});
        	if (slider_intent){
        		deactivateAdditional();
        		slider_intent = !slider_intent;
        	}
        	$('#year-indicator').fadeOut(300);
        	
    	}
   
   	button_group.drag(move, start, up).toFront();	        
   	indicators.click(move);
}

var alphabetical_position = 0;

function drawCountry(data){
	var world = stage.set();
	
	if ((data.path != undefined) && (data.content == 1)){	
		var random_color_weight = Math.floor(Math.random() * 7);
		var random_highlight = Math.floor(Math.random() * 4);
		var country_string = data.country;
		
		var years_standing = [];
		var years_voting = [];
		
		data.baseColor = grey_colors[random_color_weight];
		data.highlightColor = {
			year_standing: highlights['year_standing'][random_highlight], 
			year_voting: highlights['year_voting'][random_highlight], 
			year_elected: highlights['year_elected'][random_highlight]
		};
		data.alph_id = alphabetical_position;
		data.population = data.population;
		var country_path = data.path;
		var style_attributes = {
			stroke: grey_colors[random_color_weight],
			fill: grey_colors[random_color_weight],
			cursor: 'pointer'
		}	
		var country_ = stage.path(country_path).attr(style_attributes).data(data).hover(showTooltip);
		
		if ($("html").hasClass("lt-ie9") || $("html").hasClass("lt-ie10")) {	
			country_[0].onmousedown = function () {
               initiateMeta(false, country_);
            };
		} else {
			country_.click(initiateMeta);
		}
		
		var year_voting = data.year_voting.year_1;
		var year_standing = data.year_standing.year_1;
		var year_elected = data.year_elected.year_1;	
		
		if (year_voting == 0){
			no_data['year_voting'].push(country_);
		}	
		if (year_standing == 0){
			no_data['year_standing'].push(country_);
		}
		if (year_elected == 0){
			no_data['year_elected'].push(country_);
		}
		
		if(countries_index['year_voting'][year_voting] == undefined){
			countries_index['year_voting'][year_voting] = new Array();
		} 
		if(countries_index['year_standing'][year_standing] == undefined){
			countries_index['year_standing'][year_standing] = new Array();
		} 
		if(countries_index['year_elected'][year_elected] == undefined){
			countries_index['year_elected'][year_elected] = new Array();
		} 
		countries_index['year_voting'][year_voting].push(country_);
		if(year_standing != 0){
			countries_index['year_standing'][year_standing].push(country_);
		}
		if(year_elected != 0){
			countries_index['year_elected'][year_elected].push(country_);
		}	
		country_ids[alphabetical_position] = country_;
		country_strings[data.country] = country_;
		alphabetical_position++;
		
		world.push(country_);
		world.transform('s0.8,0.8,30,-250');
		
	}
	
}

var no_data = {
	year_elected: [],
	year_standing: [],
	year_voting: []
}

function activateMapCountry(country){
	var fill;
		if (!$("html").hasClass("lt-ie9")) {
		fill = 'url(resources/img/background_9.png)';
	} else {
		fill = '#d1d1d1';
	}
	country.attr({
		fill: fill,
		stroke: 0
	}).toFront();
}

var last_country;

function showTooltip(evt){
	returnActiveCountry(last_country);
	activateMapCountry(this);
	last_country = this;
	if (!additional_view){
		clearTimeout(hide_t);	
		active_country = this;
		var country_str = active_country.data('country');		
		var year = active_country.data(mode).year_1;	
		var display_years = [];
		var display;
		
		if (mode != 'year_elected'){
			mode_data = active_country.data(mode);
			for(var i in mode_data){
				if(mode_data[i] != null){
					display_years.push(mode_data[i]);
				}
			}
			display = constructString(display_years);
		} else {
			display = '<strong>'+active_country.data(mode).year_1+'</strong>';
		}
		var country_data = 
			'<div class="header">'+
				'<h2>'+country_str+'</h2>'+
			'</div>';
		if (year == 0){
			country_data += '<p>'+empty_data+'</p>';
		} else if ((year > 2012) || (year == null)) {
			country_data += '<p>'+tool_content[mode][1]+'</p>';
		} else {
			country_data += '<p>'+tool_content[mode][0]+' '+display+'</p>';
		}
		var bounding_box = active_country.getBBox();	
		var tool_x = bounding_box.x + (bounding_box.width * .5);
		var tool_y = bounding_box.y + (bounding_box.height * .5);

		if (initial_time){
			country_data += 
				'<div class="extra '+mode+'">'+
					'<h3>Click on a country to see more data!</h3>'+
				'</div>';
		}		
		if (tool_x > 660){
			tool_x -= 240;
			tool_y -= 40;
			$('#tool').addClass('right').removeClass('left');
		} else {
			tool_x -= 15;
			tool_y -= 40;
			$('#tool').removeClass('right').addClass('left');	
		}
		
		
		$('#tool').css({
			top: Math.round(tool_y),
			left: Math.round(tool_x)
		}).html(country_data).show();		
	}
}

function returnActiveCountry(country){
	if (country != undefined){
		var c;
		if (country.data('no_data') == true){
			c = '#fff';
		} else {
			if(country.data('active') == true){
				c = country.data('highlightColor')[mode];
			} else {
				c = country.data('baseColor');
			}
		}
		country.attr({
			fill: c,
			stroke: c
		});
	}
}

function flashLink(){
	if ($('#tool').is(":visible")){
		$('#tool').find('.read-more').animate({
			opacity: .4
		}, 500, function(){
			$(this).animate({
				opacity: 1
			}, 500)
		});
	}
}

function appendAdditionalContent(country, id, initiating){
	$('.pie-holder, .type-holder, #laws').empty();
		$('#country').fadeOut(150, function(){
			$(this).html('in '+country).fadeIn(150, function(){
				if (initiating){
					$('#main-title h1').stop().animate({
						marginLeft: 60
					}, 300, function(){
					});
				}	
				$('#close').show();
			});
		});
	$('#additional_content').append(getAdditionalChartData(id, country));
}

function deactivateAdditional(){
	$('#additional-content-holder').animate({
		height: 0
	}, 500, function(){
		$('.pie-holder, .type-holder, #laws').empty();
		$('#close').hide();
		
		$('#main-title h1').fadeOut('fast', function(){
			$('#country').text('around the World');
			$(this).fadeIn();
			$(this).animate({
				marginLeft: 10
			}, 300, function(){
				$('#menu').fadeIn(300);
				if($('#slider').hasClass('deactivated')){
					sliderActivate();
				}
			});
			
		});
		additional_view = !additional_view;
	});
/*
	if (!$('html').hasClass('no-history')){
		History.pushState(null, '♀ Women\'s Rights ♀', ' ');
	}
*/
}

function getAdditionalChartData(country_id, countr){

	$.ajax({
		url: 'db_out.php',
		data: {
			charts: 1,
			country_id: country_id	
		},
		dataType: 'json',
		type: 'GET',
		scriptCharset: "utf-8",
		success: function(data){
			var c_id = data.id;

			appendTypographicVis(data.mortality);
			appendStats(data);	
			for (var i in data.laws){
				appendNumericalData(i, data.laws[i]);
			}		
			for(var i in data.pie_charts){
				if (data.pie_charts[i] != null){
					makePiChart(i, data.pie_charts[i], c_id);
				} else {
					makePlaceholderChart(i);
				}
			}
								
			
		},
		error: function(a,b,c){
		}
	});
}

function appendTypographicVis(data){
	var header = {}
	var description = {};
	if (data.y_1990 != null){
		header['1990'] = '<h1>'+data.y_1990+'</h1>';
		header['2008'] = '<h1>'+data.y_2008+'</h1>';
		description['2008'] = '<h3>women died in childbirth per 500,000 in 2008</h3>';
		description['1990'] = '<h3>women died in childbirth per 500,000 in 1990</h3>';		
	} else {
		if ($('html').hasClass('lt-ie9')){
			header['1990'] = '<h1 class="not-available" style="font-weight:800; font-size: 52px">X<h1>';
			header['2008'] = '<h1 class="not-available">X</h1>';
		} else {
			header['1990'] = '<h1 class="not-available">X<h1>';
			header['2008'] = '<h1 class="not-available">X</h1>';
		}
		description['2008'] = '<h3 class="not-available">women died in childbirth per 500,000 in 2008</h3>';
		description['1990'] = '<h3 class="not-available">women died in childbirth per 500,000 in 1990</h3>';
	}
	$('#pie-charts #mortality_1990').append(
		header['1990']+
		description['1990']
	);
	
	$('#pie-charts #mortality_2008').append(
		header['2008']+
		description['2008']
	);
}


function appendStats(data){
	var v_, s_, e_;
	if (data.year_voting == 0){
		v_ = '';
	} else {
		if (data.year_voting.length == 0){
			v_ = 'Women still do not have the right to vote';
		} else {
			v_ = 'Received the vote in '+constructString(data.year_voting);
		}
	}
	if (data.year_standing == 0){
		s_ = '';
	} else {
		if (data.year_standing.length == 0){
			s_ = 'Women cannot stand for election';
		} else {
			s_ = 'Could stand for election in '+constructString(data.year_standing);
		}
	}
	if (data.year_elected == 0){
		e_ = '';
	} else {
		if (data.year_elected.year == null){
			e_ = 'No woman has been elected to government';
		} else {
			e_ = 'First woman '+data.year_elected.type+' in <strong>'+data.year_elected.year+'</strong>';
		}
	}

	var capitals = '';
	for (var capital in data.capitals){
		if (data.capitals[capital] != null){
			capitals += data.capitals[capital]+', ';
		}
	}
	
	var content = 
		'<div class="flag-holder">'+
			'<img class="flag" src="resources/img/flags/'+data.flag+'"/>'+
		'</div>'+
		'<div class="stats">'+
			'<div class="country-facts">'+
				'<p><span class="stat-description">population</span> &ndash; '+populationCommas(data.population)+'</p>'+
				'<p><span class="stat-description">capital city</span> &ndash; '+capitals.slice(0, -2)+'</p>'+
				'<p><span class="stat-description">government</span> &ndash; '+data.government+'</p>'+
			'</div>'+
			'<div class="voting-facts">'+
				'<p>'+v_+'</p>'+
				'<p>'+s_+'</p>'+
				'<p>'+e_+'</p>'+
			'</div>'+
		'</div>';
		
	$('#laws').append(content);
	
	
	$('#laws .flag').imagesLoaded(function(){
		$(this).fadeIn(200);
	});
}

function appendNumericalData(law, value, population, flag){
	if (value != null){			
		$('#laws').append(
			'<div class="law-holder">'+
				'<img class="law-value" src="resources/img/'+value+'_small.png">'+
				'<p>'+law_strings[law]+'</p>'+
			'</div>'
		);
	}
}

function makePlaceholderChart(type){
	$('#pie-charts #'+type).append(
		//'<div class="pie-holder">'+
			//'<div id="'+type+'" class="pie-chart"></div>'+
			'<h3 class="not-available">'+pie_strings[type].string+'</h3>'
		//'</div>'
	);
	var type = Raphael(type, 140, 140);
	type.miniPieChart(type.width * .5, 60, null);
}

function makePiChart(type, value, c_id){
	var median = pie_strings[type].median;
	if ((type == 'ministerial_positions') && (c_id == 79)){
		var date = 2012;
	} else {
		var date = pie_strings[type].year;
	}
	$('#pie-charts #'+type).append(
		//'<div class="pie-holder">'+
			//'<div id="'+type+'" class="pie-chart"></div>'+
			'<h3>'+pie_strings[type].string+'</h3>'
		//'</div>'
	);
	var type = Raphael(type, 140, 140);
	type.miniPieChart(type.width * .5, 60, value, date, median);
}


function amendMap(value, text){
	if ($('#tool').css('display')){
		$('#tool').fadeOut(200);			
	}	
	var year = mapYearRange(value, 30, stage_width - 30, 1892, 2013);
	$('#year-indicator').find('p').text(year);
	text.attr({text: year});
	for(var i in countries_index[mode]){
		if (i <= year) {
			for(var idx in countries_index[mode][i]){
				countries_index[mode][i][idx].attr({
					fill: countries_index[mode][i][idx].data('highlightColor')[mode],
					stroke: countries_index[mode][i][idx].data('highlightColor')[mode]
				}).data({
					active: true
				});
			}
		} else {
			for (var idx in countries_index[mode][i]){
				countries_index[mode][i][idx].attr({
					fill: countries_index[mode][i][idx].data('baseColor'),
					stroke: countries_index[mode][i][idx].data('baseColor'),
					opacity: 1,
					'stroke-opcaity': 1
				}).data({
					active: false
				});
			}
		}
	}		
}


//--------------------------------
//	UTILITY FUNCTIONS
//--------------------------------

function getSlugFromHash(hash) {
	var slug;	
	if (hash.substr(0, 1) == "/") {
		slug = hash.substr(1, hash.length);
	} else if (hash.substr(0, 2) == "./") {
		slug = hash.substr(2, hash.length);
	} else {
		slug = hash;
	}
	return slug;
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function calculateInfoPos(){
	$('#master-info').css({
	   marginTop: ($(document).height() - $('#master-info').width()) / 2.5
    });
}

function constructString(arr, mode){		
	if (arr.length == 1){
		var s = '<strong>'+arr[0]+'</strong>';
	} else if (arr.length == 2) {
		var s = '<strong>'+arr[0]+'</strong> and <strong>'+arr[1]+'</strong>';	
	} else if (arr.length == 3){
		var s = '<strong>'+arr[0]+', '+arr[1]+'</strong> and <strong>'+arr[2]+'</strong>';
	} 
	return s;
}

function populationCommas(population) {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function mapYearRange(value, low1, high1, low2, high2) {
	return Math.floor(low2 + (high2 - low2) * (value - low1) / (high1 - low1));
}

//--------------------------------
//	EVENTS
//--------------------------------

function expandShare(){
	$(this).animate({
		width: 100,
		height: 100
	}, 200, function(){
		$(this).children().show();
	});
}

function contractShare(){
	$(this).children().hide();
	$(this).animate({
		width: 50,
		height: 50
	}, 300);
}

function hoveredMenuItem(){
	$(this).addClass('active-mode');
}

function activateMode(){
	$('.clicked-mode').removeClass('clicked-mode');
	$('.active-mode').removeClass('active-mode');
	$(this).addClass('clicked-mode');
}

function unhoveredMenuItem(){
	$(this).removeClass('active-mode');
}

function arrowIn(){
	$(this).css({
		'background-image': 'url(resources/img/arrow-dark.png)'
	});
}

function arrowOut(){
	$(this).css({
		'background-image': 'url(resources/img/arrow.png)'
	});
}


$(window).resize(function() {
  calculateInfoPos();
});

function hideTool(){
	$('#tool').hide();
	returnActiveCountry(last_country);
}

//--------------------------------
//	HISTORY FUNCTIONS
//--------------------------------



//--------------------------------
//	MISC DATA
//--------------------------------

var grey_colors = [
	"#282828",
	"#303030",
	"#383838",
	"#404040",
	"#484848",
	"#505050",
	"#585858"
];		

var highlights = {
	year_voting: [
		"#f2ae0c",
		"#e1a10b",
		"#f5c33d",
		"#f2b30c"
	], year_elected: [
		"#bc3c28",
		"#d96c57",
		"#d04930",
		"#df3f20"
	], year_standing: [
		"#338ccc",
		"#5ba3d6",
		"#62b4d8",
		"#287cb9"
	]
};

var tool_content = {
	year_elected: ['The first woman was elected in ', 'No woman has been elected to government', 'Sorry, we don\'t have data for this country'],
	year_standing: ['Women could stand for election from ' ,'Women cannot stand for election', 'Sorry, we don\'t have data for this country'],
	year_voting: ['Women received the right to vote in ', 'Women still do not have the right to vote', 'Sorry, we don\'t have data for this country'],	
};
var active_colors = {
	year_elected: '#681100',
	year_standing: '#00364e',
	year_voting: '#7b5a00'	
};

var empty_data = 'Sorry, we don\'t have data for this country,<br/>Please help! <a href="mailto:corrections@777voting.com">corrections@777voting.com</a> ';


var pie_strings = {
	parliament: {string: 'Female members of parliament', year: 2011, median: 20},
	mortality: {string: 'Maternal mortality', year: 2012, median: 3},
	ministerial_positions: {string: 'Women in Ministerial Positions', year: 2010, median: 13},
	contraception_use: {string: 'Use of contraception', year: 2008, median: 33},
	skilled_delivery_assistance: {string: 'Skilled assistance at childbirth', year: 2008, median: 90},
	female_unemployment: {string: 'Female unemployment', year: 2008, median: 5},
	male_unemployment: {string:'Male unemployment', year: 2008, median: 4}
};

var law_strings = {
	law_domestic_violence: 'Law against domestic violence',
	law_sexual_harrassment: 'Law against sexual harassment',
	law_marital_rape: 'Law against marital rape'
};
