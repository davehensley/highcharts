/**
 * @license Data plugin for Highcharts
 *
 * (c) 2012 Torstein Hønsi
 * Last revision 2012-11-27
 *
 * License: www.highcharts.com/license
 */

/*
 * The Highcharts Data plugin is a utility to ease parsing of input sources like
 * CSV, HTML tables or grid views into basic configuration options for use 
 * directly in the Highcharts constructor.
 *
 * Demo: http://jsfiddle.net/highcharts/SnLFj/
 *
 * --- OPTIONS ---
 *
 * - columns : Array<Array<Mixed>>
 * A two-dimensional array representing the input data on tabular form. This input can
 * be used when the data is already parsed, for example from a grid view component.
 * Each cell can be a string or number. If not switchRowsAndColumns is set, the columns
 * are interpreted as series. See also the rows option.
 *
 * - complete : Function(chartOptions)
 * The callback that is evaluated when the data is finished loading, optionally from an 
 * external source, and parsed. The first argument passed is a finished chart options
 * object, containing series and an xAxis with categories if applicable. Thise options
 * can be extended with additional options and passed directly to the chart constructor.
 *
 * - csv : String
 * A comma delimited string to be parsed. Related options are startRow, endRow, startColumn
 * and endColumn to delimit what part of the table is used. The lineDelimiter and 
 * itemDelimiter options define the CSV delimiter formats.
 * 
 * - endColumn : Integer
 * In tabular input data, the first row (indexed by 0) to use. Defaults to the last 
 * column containing data.
 *
 * - endRow : Integer
 * In tabular input data, the last row (indexed by 0) to use. Defaults to the last row
 * containing data.
 *
 * - googleSpreadsheetKey : String 
 * A Google Spreadsheet key. See https://developers.google.com/gdata/samples/spreadsheet_sample
 * for general information on GS.
 *
 * - googleSpreadsheetKey : String 
 * The Google Spreadsheet worksheet. The available id's can be read from 
 * https://spreadsheets.google.com/feeds/worksheets/{key}/public/basic
 *
 * - itemDilimiter : String
 * Item or cell delimiter for parsing CSV. Defaults to ",".
 *
 * - lineDilimiter : String
 * Line delimiter for parsing CSV. Defaults to "\n".
 *
 * - parsed : Function
 * A callback function to access the parsed columns, the two-dimentional input data
 * array directly, before they are interpreted into series data and categories.
 *
 * - parseDate : Function
 * A callback function to parse string representations of dates into JavaScript timestamps.
 * Return an integer on success.
 *
 * - rows : Array<Array<Mixed>>
 * The same as the columns input option, but defining rows intead of columns.
 *
 * - startColumn : Integer
 * In tabular input data, the first column (indexed by 0) to use. 
 *
 * - startRow : Integer
 * In tabular input data, the first row (indexed by 0) to use.
 *
 * - table : String|HTMLElement
 * A HTML table or the id of such to be parsed as input data. Related options ara startRow,
 * endRow, startColumn and endColumn to delimit what part of the table is used.
 */

// JSLint options:
/*global jQuery */

(function (Highcharts) {	
	
	// Utilities
	var each = Highcharts.each;
	
	
	// The Data constructor
	var Data = function (options) {
		this.init(options);
	};
	
	// Set the prototype properties
	Highcharts.extend(Data.prototype, {
		
	/**
	 * Initialize the Data object with the given options
	 */
	init: function (options) {
		this.options = options;
		this.columns = options.columns || this.rowsToColumns(options.rows) || [];
		
		
		// Parse a CSV string if options.csv is given
		this.parseCSV();
		
		// Parse a HTML table if options.table is given
		this.parseTable();

		// Parse a Google Spreadsheet 
		this.parseGoogleSpreadsheet();

	},

	/**
	 * Proceed when the data is found and loaded
	 */
	dataFound: function () {
		
		// Interpret the values into right types
		this.parseTypes();
		
		// Use first row for series names?
		this.findHeaderRow();
		
		// Handle columns if a handleColumns callback is given
		this.parsed();
		
		// Complete if a complete callback is given
		this.complete();
		
	},
	
	/**
	 * Parse a CSV input string
	 */
	parseCSV: function () {
		var options = this.options,
			csv = options.csv,
			columns = this.columns,
			startRow = options.startRow || 0,
			endRow = options.endRow || Number.MAX_VALUE,
			startColumn = options.startColumn || 0,
			endColumn = options.endColumn || Number.MAX_VALUE,
			lines;
			
		if (csv) {
			
			lines = csv
				.replace(/\r\n/g, "\n") // Unix
				.replace(/\r/g, "\n") // Mac
				.split(options.lineDelimiter || "\n");
			
			each(lines, function (line, rowNo) {
				if (rowNo >= startRow && rowNo <= endRow) {
					var items = line.split(options.itemDelimiter || ',');
					each(items, function (item, colNo) {
						if (colNo >= startColumn && colNo <= endColumn) {
							if (!columns[colNo - startColumn]) {
								columns[colNo - startColumn] = [];					
							}
							
							columns[colNo - startColumn][rowNo - startRow] = item;
						}
					});
				}
			});

			this.dataFound();
		}
	},
	
	/**
	 * Parse a HTML table
	 */
	parseTable: function () {
		var options = this.options,
			table = options.table,
			columns = this.columns,
			startRow = options.startRow || 0,
			endRow = options.endRow || Number.MAX_VALUE,
			startColumn = options.startColumn || 0,
			endColumn = options.endColumn || Number.MAX_VALUE,
			colNo;
			
		if (table) {
			
			if (typeof table === 'string') {
				table = document.getElementById(table);
			}
			
			each(table.getElementsByTagName('tr'), function (tr, rowNo) {
				colNo = 0; 
				if (rowNo >= startRow && rowNo <= endRow) {
					each(tr.childNodes, function (item) {
						if ((item.tagName === 'TD' || item.tagName === 'TH') && colNo >= startColumn && colNo <= endColumn) {
							if (!columns[colNo]) {
								columns[colNo] = [];					
							}
							columns[colNo][rowNo - startRow] = item.innerHTML;
							
							colNo += 1;
						}
					});
				}
			});

			this.dataFound();
		}
	},
	
	/**
	 * Parse an SVG path into a simplified array that Highcharts can read
	 */
	pathToArray: function (path, translate) {
		
		var i = 0,
			position = 0,
			positions,
			fixedPoint = [0, 0],
			isRelative,
			isString,
			operator;
		path = path
			// Move letters apart
			.replace(/([A-Za-z])/g, ' $1 ')
			// Add space before minus
			.replace(/-/g, ' -')
			// Trim
			.replace(/^\s*/, "").replace(/\s*$/, "")
		
			// Split on spaces, minus and commas
			.split(/[ ,]+/);
		
		// Blank path
		if (path.length === 1) {
			return [];	
		}
		
		// Real path
		for (i = 0; i < path.length; i++) {
			isString = /[a-zA-Z]/.test(path[i]);
			
			// Handle strings
			if (isString) {
				operator = path[i];
				positions = 2;
				
				// Curves have six positions
				if (operator === 'c' || operator === 'C') {
					positions = 6;
				}
				
				// Enter or exit relative mode
				if (operator === 'm' || operator === 'l' || operator === 'c') {
					path[i] = operator.toUpperCase();
					isRelative = true;
				} else if (operator === 'M' || operator === 'L' || operator === 'C') {
					isRelative = false;
				
				
				// Horizontal and vertical line to
				} else if (operator === 'h') {
					isRelative = true;
					path[i] = 'L';
					path.splice(i + 2, 0, 0);
				} else if (operator === 'v') {
					isRelative = true;
					path[i] = 'L';
					path.splice(i + 1, 0, 0);
				} else if (operator === 'H' || operator === 'h') {
					isRelative = false;
					path[i] = 'L';
					path.splice(i + 2, 0, fixedPoint[1]);
				} else if (operator === 'V' || operator === 'v') {
					isRelative = false;
					path[i] = 'L';
					path.splice(i + 1, 0, fixedPoint[0]);
				}
			
			// Handle numbers
			} else {
				
				path[i] = parseFloat(path[i]);
				if (isRelative) {
					path[i] += fixedPoint[position % 2];
				
				} 
				if (translate && (!isRelative || (operator === 'm' && i < 3))) { // only translate absolute points or initial moveTo
					path[i] += translate[position % 2];
				}
				
				path[i] = Math.round(path[i] * 100) / 100;
				
				// Set the fixed point for the next pair
				if (position === positions - 1) {
					fixedPoint = [path[i - 1], path[i]];
				}
				
				// Reset to zero position (x/y switching)
				if (position === positions - 1) {
					position = 0;
				} else {
					position += 1;
				}
			}
		}
		return path;
	},
	
	/**
	 * Load an SVG file and extract the paths
	 * @param {Object} url
	 */
	loadSVG: function () {
		
		var data = this,
			options = this.options;
		
		function getTranslate(elem) {
			var transform = elem.getAttribute('transform'),
				translate = transform && transform.match(/translate\(([0-9\-\. ]+),([0-9\-\. ]+)\)/);
			
			return translate && [parseFloat(translate[1]), parseFloat(translate[2])]; 
		}
		
		function getName(elem) {
			return elem.getAttribute('inkscape:label') || elem.getAttribute('id') || elem.getAttribute('class');
		}
		
		jQuery.ajax({
			url: options.svg,
			dataType: 'xml',
			success: function (xml) {
				var arr = [],
					currentParent,
					allPaths = xml.getElementsByTagName('path'),
					commonLineage,
					lastCommonAncestor,
					handleGroups,
					defs = xml.getElementsByTagName('defs')[0],
					clipPaths;
					
				// Skip clip paths
				clipPaths = defs && defs.getElementsByTagName('path');
				if (clipPaths) {
					each(clipPaths, function (path) {
						path.skip = true;
					});
				}
				
				// If not all paths belong to the same group, handle groups
				each(allPaths, function (path, i) {
					if (!path.skip) {
						var itemLineage = [],
							parentNode,
							j;
						
						if (i > 0 && path.parentNode !== currentParent) {
							handleGroups = true;
						}
						currentParent = path.parentNode;
						
						// Handle common lineage
						parentNode = path;
						while (parentNode) {
							itemLineage.push(parentNode);
							parentNode = parentNode.parentNode;
						}
						itemLineage.reverse();
						
						if (!commonLineage) {
							commonLineage = itemLineage; // first iteration
						} else {
							for (j = 0; j < commonLineage.length; j++) {
								if (commonLineage[j] !== itemLineage[j]) {
									commonLineage.slice(0, j);
								}
							}
						}
					}
				});
				lastCommonAncestor = commonLineage[commonLineage.length - 1];
				
				// Iterate groups to find sub paths
				if (handleGroups) {
					each(lastCommonAncestor.getElementsByTagName('g'), function (g) {
						var groupPath = [],
							translate = getTranslate(g);
						
						each(g.getElementsByTagName('path'), function (path) {
							if (!path.skip) {
								groupPath = groupPath.concat(
									data.pathToArray(path.getAttribute('d'), translate)
								);
								
								path.skip = true;
							}
						});
						arr.push({
							name: getName(g),
							path: groupPath
						});
					});
				}
				
				// Iterate the remaining paths that are not parts of groups
				each(allPaths, function (path) {
					if (!path.skip) {
						arr.push({
							name: getName(path),
							path: data.pathToArray(path.getAttribute('d'), getTranslate(path))
						});
					}			
				});
				
				// Do the callback
				options.complete({
					series: [{
						data: arr
					}]
				});
			}
		});
	},

	/**
	 * TODO: 
	 * - switchRowsAndColumns
	 * - startRow, endRow etc.
	 */
	parseGoogleSpreadsheet: function () {
		var self = this,
			options = this.options,
			googleSpreadsheetKey = options.googleSpreadsheetKey,
			columns = this.columns;

		if (googleSpreadsheetKey) {
			jQuery.getJSON('https://spreadsheets.google.com/feeds/cells/' + 
				  googleSpreadsheetKey + '/' + (options.googleSpreadsheetWorksheet || 'od6') +
					  '/public/values?alt=json-in-script&callback=?',
					  function (json) {
					
				// Prepare the data from the spreadsheat
				var cells = json.feed.entry,
					cell,
					cellCount = cells.length,
					colCount = 0,
					rowCount = 0,
					i;
			
				// First, find the total number of columns and rows that 
				// are actually filled with data
				for (i = 0; i < cellCount; i++) {
					cell = cells[i];
					colCount = Math.max(colCount, cell.gs$cell.col);
					rowCount = Math.max(rowCount, cell.gs$cell.row);			
				}
			
				// Set up arrays containing the column data
				for (i = 0; i < colCount; i++) {
					columns[i] = new Array(rowCount);
				}
				
				// Loop over the cells and assign the value to the right
				// place in the column arrays
				for (i = 0; i < cellCount; i++) {
					cell = cells[i];
					columns[cell.gs$cell.col - 1][cell.gs$cell.row - 1] = 
						cell.content.$t;
				}
				self.dataFound();
			});
		}
	},
	
	/**
	 * Find the header row. For now, we just check whether the first row contains
	 * numbers or strings. Later we could loop down and find the first row with 
	 * numbers.
	 */
	findHeaderRow: function () {
		var headerRow = 0;
		each(this.columns, function (column) {
			if (typeof column[0] !== 'string') {
				headerRow = null;
			}
		});
		this.headerRow = 0;			
	},
	
	/**
	 * Trim a string from whitespace
	 */
	trim: function (str) {
		//return typeof str === 'number' ? str : str.replace(/^\s+|\s+$/g, '');
		return typeof str === 'string' ? str.replace(/^\s+|\s+$/g, '') : str;
	},
	
	/**
	 * Parse numeric cells in to number types and date types in to true dates.
	 * @param {Object} columns
	 */
	parseTypes: function () {
		var columns = this.columns,
			col = columns.length, 
			row,
			val,
			floatVal,
			trimVal,
			dateVal;
			
		while (col--) {
			row = columns[col].length;
			while (row--) {
				val = columns[col][row];
				floatVal = parseFloat(val);
				trimVal = this.trim(val);
				/*jslint eqeq: true*/
				if (trimVal == floatVal) { // is numeric
				/*jslint eqeq: false*/
					columns[col][row] = floatVal;
					
					// If the number is greater than milliseconds in a year, assume datetime
					if (floatVal > 365 * 24 * 3600 * 1000) {
						columns[col].isDatetime = true;
					} else {
						columns[col].isNumeric = true;
					}					
				
				} else { // string, continue to determine if it is a date string or really a string
					dateVal = this.parseDate(val);
					
					if (col === 0 && typeof dateVal === 'number' && !isNaN(dateVal)) { // is date
						columns[col][row] = dateVal;
						columns[col].isDatetime = true;
					
					} else { // string
						columns[col][row] = trimVal;
					}
				}
				
			}
		}		
	},
	
	/**
	 * Parse a date and return it as a number. Overridable through options.parseDate.
	 */
	parseDate: function (val) {
		var parseDate = this.options.parseDate;
		
		return parseDate ? parseDate(val) : Date.parse(val);
	},
	
	/**
	 * Reorganize rows into columns
	 */
	rowsToColumns: function (rows) {
		var row,
			rowsLength,
			col,
			colsLength,
			columns;

		if (rows) {
			columns = [];
			rowsLength = rows.length;
			for (row = 0; row < rowsLength; row++) {
				colsLength = rows[row].length;
				for (col = 0; col < colsLength; col++) {
					if (!columns[col]) {
						columns[col] = [];
					}
					columns[col][row] = rows[row][col];
				}
			}
		}
		return columns;
	},
	
	/**
	 * A hook for working directly on the parsed columns
	 */
	parsed: function () {
		if (this.options.parsed) {
			this.options.parsed.call(this, this.columns);
		}
	},
	
	/**
	 * If a complete callback function is provided in the options, interpret the 
	 * columns into a Highcharts options object.
	 */
	complete: function () {
		
		var columns = this.columns,
			hasXData,
			categories,
			firstCol,
			type,
			options = this.options,
			series,
			data,
			name,
			i,
			j;
			
		
		if (options.complete) {
			
			// Use first column for X data or categories?
			if (columns.length > 1) {
				firstCol = columns.shift();
				if (this.headerRow === 0) {
					firstCol.shift(); // remove the first cell
				}
				
				// Use the first column for categories or X values
				hasXData = firstCol.isNumeric || firstCol.isDatetime;
				if (!hasXData) { // means type is neither datetime nor linear
					categories = firstCol;
				}
				
				if (firstCol.isDatetime) {
					type = 'datetime';
				}
			}
			
			// Use the next columns for series
			series = [];
			for (i = 0; i < columns.length; i++) {
				if (this.headerRow === 0) {
					name = columns[i].shift();
				}
				data = [];
				for (j = 0; j < columns[i].length; j++) {
					data[j] = columns[i][j] !== undefined ?
						(hasXData ?
							[firstCol[j], columns[i][j]] :
							columns[i][j]
						) :
						null;
				}
				series[i] = {
					name: name,
					data: data
				};
			}
			
			// Do the callback
			options.complete({
				xAxis: {
					categories: categories,
					type: type
				},
				series: series
			});
		}
	}
	});
	
	// Register the Data prototype and data function on Highcharts
	Highcharts.Data = Data;
	Highcharts.data = function (options) {
		return new Data(options);
	};

	// Extend Chart.init so that the Chart constructor accepts a new configuration
	// option group, data.
	Highcharts.wrap(Highcharts.Chart.prototype, 'init', function (proceed, userOptions, callback) {
		var chart = this;

		if (userOptions.data) {
			Highcharts.data(Highcharts.extend(userOptions.data, {
				complete: function (options) {
					userOptions = Highcharts.merge(userOptions, options);
					proceed.call(chart, userOptions, callback);
				}
			}));
		} else {
			proceed.call(chart, userOptions, callback);
		}
	});

}(Highcharts));