var exports = module.exports = {}

function visualize(windowWriter) {
  var height = 600;
  var width = 800;
  var padding = 20;
  var left = 2e308;
  var right = -2e308;
  var top = -2e308;
  var bottom = 2e308;
  var scale = 1;
  var svgContent = [];
  var polygons = [];
  var labels = [];


  var addPolygon = function(arraysOfPoints, lineColor, fillColor, lineWidth, lineAlpha, fillAlpha, closed) {
    var j, k, len, len1, nanFound, point, polygon, results;
    if (lineWidth == null) {
      lineWidth = 1;
    }
    if (lineAlpha == null) {
      lineAlpha = 1;
    }
    if (fillAlpha == null) {
      fillAlpha = 1;
    }
    if (closed == null) {
      closed = true;
    }
    results = [];
    for (j = 0, len = arraysOfPoints.length; j < len; j++) {
      polygon = arraysOfPoints[j];
      nanFound = false;
      for (k = 0, len1 = polygon.length; k < len1; k++) {
        point = polygon[k];
        if (!isNaN(point.x)) {
          left = Math.min(left, point.x);
          right = Math.max(right, point.x);
        } else {
          nanFound = true;
        }
        if (!isNaN(point.y)) {
          bottom = Math.min(bottom, point.y);
          top = Math.max(top, point.y);
        } else {
          nanFound = true;
        }
      }
      if (!nanFound) {
        results.push(polygons.push({
          points: polygon,
          lineColor: lineColor,
          fillColor: fillColor,
          lineWidth: lineWidth,
          lineAlpha: lineAlpha,
          fillAlpha: fillAlpha,
          closed: closed
        }));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  var addLabel = function(text, x, y, color, font, size) {
    if (font == null) {
      font = "Verdana";
    }
    if (size == null) {
      size = 10;
    }
    return labels.push('<text x="' + x + '" y="' + y + '" font-family="' + font + '" font-size="' + size + '" fill="' + color + '">' + text + '</text>');
  };

  var generateSVG = function() {
    var i, j, k, l, label, len, len1, len2, point, polygon, ref, ref1, ref2, scale, svg, svgpath;
    svg = '<svg id="vis-canvas" width="' + width + '" height="' + height + '" style="margin-top:10px; margin-right:10px;margin-bottom:10px;background-color:#fff">';
    scale = Math.min((width - 2 * padding) / (right - left), (height - 2 * padding) / (top - bottom));
    ref = polygons;
    for (j = 0, len = ref.length; j < len; j++) {
      polygon = ref[j];
      svgpath = "";
      ref1 = polygon.points;
      for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
        point = ref1[i];
        if (i === 0) {
          svgpath += "M";
        } else {
          svgpath += "L";
        }
        svgpath += ((point.x - left) * scale + padding) + ", " + (height - padding - (point.y - bottom) * scale);
        if (point.radius != null) {
          svg += '<circle cx="' + ((point.x - left) * scale + padding) + '" cy="' + (height - padding - (point.y - bottom) * scale) + '" r="' + point.radius * scale + '" stroke="green" stroke-width="1" fill="none" />';
        }
      }
      if (polygon.points.length > 0 && polygon.closed) {
        svgpath += "L" + ((polygon.points[0].x - left) * scale + padding) + ", " + (height - padding - (polygon.points[0].y - bottom) * scale);
      }
      if (svgpath === "") {
        svgpath = "M0,0";
      }
      svg += '<path stroke="' + polygon.lineColor + '" fill="' + polygon.fillColor + '" stroke-width="' + polygon.lineWidth + '" fill-opacity="' + polygon.fillAlpha + '" stroke-opacity="' + polygon.lineAlpha + '"d="' + svgpath + '"/>';
    }
    ref2 = labels;
    for (l = 0, len2 = ref2.length; l < len2; l++) {
      label = ref2[l];
      svg += label;
    }
    svg += '</svg>';
    windowWriter.write(svg)
  };

  return {
    addPolygon: addPolygon,
    addLabel: addLabel,
    generateSVG: generateSVG
  };
}

exports.visualize = visualize;
