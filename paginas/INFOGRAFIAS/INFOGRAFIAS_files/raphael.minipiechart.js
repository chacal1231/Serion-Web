/*
*
* Mini pie chart plugin
* by MALK
*
*/

Raphael.fn.miniPieChart = function (x, y, value, date, median) {
	if (value == null){
		var blank = this.set();
		
		blank.push(
			this.circle(x, y, 50 * .6).attr({
				stroke: 0,
				fill: '#d6d6d6'
			})
		);
		
		/*
blank.push(
			this.text(x, y, 'not available').attr({
				'font-size': 12,
				'font-weight': '300',
				fill: '#fff' 
			})
		);
*/
		
		return blank;
	}
	var pie_chart = this.set();
	var segments = this.set();
	
	var main = this.circle(x, y, 50).attr({ 
		fill: 'rgb(230,230,230)', 
		stroke: 0
	});		
	
	var label = this.text(x, y, value+'%').attr({
		'font-size': 14,
		'font-weight': 'bold' 
	});
	
	var path = this.path(makePath(value, 40)).attr({ 
				fill: '#333', 
				stroke: 0
			}).hover(function(){
				this.stop().animate({
					transform: 's1.1'
				}, 200, "<>");
				label.attr({
					text: date,
					'font-weight': 'normal'
				});
			
			}, function(){
				this.stop().animate({
					transform: 's1'
				}, 200, "<>");
				label.attr({
					text: value+'%',
					'font-weight': 'bold'
				});
			});	
			
	var average = this.path(makePath(median, 50)).attr({ 
			fill: 'url(resources/img/background.png)', 
			stroke: 0
		}).hover(function(){
			this.stop().animate({
				transform: 's1.1'
			}, 200, "<>");
			
			label.attr({
				text: median+'%\nworld\naverage',
				'font-weight': 'normal',
				'font-size': 11
			});
		
		}, function(){
			this.stop().animate({
				transform: 's1'
			}, 200, "<>");
			label.attr({
				text: value+'%',
				'font-weight': 'bold',
				'font-size': 14
			});
		});
		var path = this.path(makePath(value, 40)).attr({ 
				fill: '#333', 
				stroke: 0
			}).hover(function(){
				this.stop().animate({
					transform: 's1.1'
				}, 200, "<>");
				label.attr({
					text: date,
					'font-weight': 'normal'
				});
			
			}, function(){
				this.stop().animate({
					transform: 's1'
				}, 200, "<>");
				label.attr({
					text: value+'%',
					'font-weight': 'bold'
				});
			});	
	function makePath(value, rr){
		var t = (Math.PI * .5) * 3;
		var radius = (Math.PI * 2 * (value - 0.01)) / 100 + t;
		  
		var path = [
			"M", 
			x, 
			y, 
			"l", 
			rr * Math.cos(t), 
			rr * Math.sin(t), 
			"A", 
			rr, 
			rr, 
			0, 
			+(radius > Math.PI + t), 
			1, 
			x + rr * Math.cos(radius), 
			y + rr * Math.sin(radius), 
			"z"
		];
	
		return path;
	}
	
	segments.push(average,path);
	
	pie_chart.push(main);
	pie_chart.push(segments);
	pie_chart.push(
	  this.circle(x, y, 50 * .6).attr({
	  	fill: '#fff', 
	  	stroke: 0
	  })
	);
	
	pie_chart.push(label.toFront());
	return pie_chart;
};