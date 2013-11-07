<?php 
	// Move the log file back from temp dir
	copy(sys_get_temp_dir() . '/log.txt', 'log.txt');
?>
<html>
	
	<head>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
		
		<script type="text/javascript">
			$(function() {
				var $active,
					month,
					commits,
					parentHierarchy = {};

				var colors = [
					   '#2f7ed8', 
					   '#0d233a', 
					   '#8bbc21', 
					   '#910000', 
					   '#1aadce', 
					   '#492970',
					   '#f28f43', 
					   '#77a1e5', 
					   '#c42525', 
					   '#a6c96a'
					],
					branchCounter = 0;

				if (window.parent.commitsKey) {


					commits = window.parent.commitsKey.split(',');
					$('#loaded').html("Loaded branch <b>" + commits[0] + "</b> from " + commits[1] + " to " + commits[2]);

				}
			
				$.get('log.txt?d' + (new Date()).getTime(), function(log) {
					log = log.split('\n');
					$.each(log, function(i, line) {
						
						if (line.length) {
							line = line.split('|');

							var $li = $('<li>').appendTo('#ul'),
								commit = line[0],
								date = line[1],
								dateObj = new Date(date.substr(0, 4), date.substr(5, 2) - 1, +date.substr(8, 2), +date.substr(11, 2), date.substr(14, 2)),
								parents = line[3].split(' '),
								branchI;
							
							if (dateObj.getMonth() !== month) {
								$('<h3>' + ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][dateObj.getMonth()] +
									 ' ' + dateObj.getFullYear() + '</h3>')
									.appendTo($li);
								month = dateObj.getMonth();
							}

							// Parents
							if (parentHierarchy[commit] !== undefined) {
								branchI = parentHierarchy[commit];
							} else {
								branchI = branchCounter++;
							}
							parentHierarchy[parents[0]] = branchI;
							if (parents[1]) {
								parentHierarchy[parents[1]] = branchCounter++;
							}

							var par = $('<div>')
								.attr({
									'class': 'parents'
								})
								.html('<div class="disc" style="background-color: '+ colors[branchI] + '"></div>')
								.appendTo($li);


								
							$('<a>')
								.attr({
									href: 'main.php?commit='+ commit,
									target: 'main',
									'class': 'message'
								})
								.click(function() {
									$active && $active.removeClass('active').addClass('visited');
									$(this).addClass('active');
									$active = $(this);
								})
								.html(line[2])
								.appendTo($li);



							$('<div class="status status-none">Not inspected</div>')
								.click(function () {
									var $this = $(this);
									if ($this.hasClass('status-none')) {
										$this.removeClass('status-none')
											.addClass('status-works')
											.html('Works');
									} else if ($this.hasClass('status-works')) {
										$this.removeClass('status-works')
											.addClass('status-fails')
											.html('Fails');
									} else if ($this.hasClass('status-fails')) {
										$this.removeClass('status-fails')
											.addClass('status-none')
											.html('Not inspected');
									}
								})
								.appendTo($li);

							$('<span class="date">' + date + '</span>')
								.appendTo($li);
						}
							
					});
				});
			});
		</script>
		
		<style type="text/css">
			* {
				font-size: 0.95em;
				font-family: Arial, sans-serif;
			}
			h3 {
				font-size: 16pt;
			}
			ul {
				margin: 50px 1em 1em 1em;
				padding-left: 10px;
				
			}
			
			a {
				text-decoration: none;
			}


			a.visited {
				color: silver;
			}
			a.active {
				color: black;
				font-weight: bold;
			}
			
			body {
				margin: 0;
			}

			ul {
				list-style-type: none;
			}

			ul li {
				padding: 0.5em 0;
				border-bottom: 1px solid silver;
				margin: 0;
			}
			.date {
				color: gray;
				display: block;
				margin-left: 20px;
			}
			.parents {
				width: 20px;
				position: absolute;
			}
			.parents .disc {
				width: 14px;
				height: 14px;
				border-radius: 7px;
			}
			.message {
				margin-left: 20px;
				display: block;
			}
			.status {
				float: right;
				cursor: pointer;
				color: silver;
				width: 100px;
				padding: 3px;
				border-radius: 3px;
				text-align: center;
			}
			.status.status-works {
				background: green;
				color: white;
			}
			.status.status-fails {
				background: red;
				color: white;
			}

			#topnav {
				position: fixed;
				top: 0;
				box-shadow: 5px 5px 5px #888;
				background: white;
				width: 100%; 
				height: 30px;
				padding-top: 1em;
			}
			#topnav a {
				border: 1px solid silver;
				border-radius: 5px;
				margin: 0.5em;
				padding: 0.5em;
			}
			#topnav span {
				padding-left: 5px;
			}
			
		</style>
	</head>
	
	<body>
		<div id="topnav">
			<span id="loaded"></span>
			<a href="main.php" target="main">Set new test data</a>
		</div>
		<ul id="ul"></ul>
		
	</body>
</html>