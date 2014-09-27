(function() {
  var colors = {
    'ORANGE': {
      colour: 'rgb(255,144,47)',
      secondary_colour: ['LIGHT BLUE', 'DARK BLUE'],
      index: 8
    },
    'LIGHT BLUE': {
      colour: 'rgb(51,151,197)',
      secondary_colour: ['YELLOW', 'RED'],
      index: 4
    },
    'DARK BLUE': {
      colour: 'rgb(59,54,182)',
      secondary_colour: ['ORANGE', 'YELLOW'],
      index: 3
    },
    'GREEN': {
      colour: 'rgb(83,119,48)',
      secondary_colour: ['PINK', 'PURPLE'],
      index: 5
    },
    'YELLOW': {
      colour: 'rgb(219,217,37)',
      secondary_colour: ['LIGHT BLUE', 'PURPLE'],
      index: 6
    },
    'BLACK': {
      colour: 'rgb(25,25,25)',
      secondary_colour: ['ORANGE', 'PINK', 'LIGHT BLUE', 'GREEN', 'RED'],
      index: 10
    },
    'PINK': {
      colour: 'rgb(206,51,122)',
      secondary_colour: ['LIGHT BLUE', 'ORANGE'],
      index: 1
    },
    'WHITE': {
      colour: 'rgb(200,200,200)',
      secondary_colour: ['PINK', 'LIGHT BLUE', 'ORANGE', 'RED', 'GREEN'],
      index: 9
    },
    'BROWN': {
      colour: 'rgb(142,107,68)',
      secondary_colour: ['DARK BLUE', 'PINK'],
      index: 7
    },
    'PURPLE': {
      colour: 'rgb(113,52,165)',
      secondary_colour: ['YELLOW', 'GREEN'],
      index: 2
    },
    'RED': {
      colour: 'rgb(210,50,44)',
      secondary_colour: ['GREEN', 'LIGHT BLUE'],
      index: 0
    }
  };
  var colorNames = Object.keys(colors)

  var parseRgb = function(string) {
    return string.replace('rgb(', '').replace(')', '').split(',').map(function(s) {return parseInt(s, 10)})
  }

  var componentFromHue = function(m1, m2, h) {
    h = ((h % 1) + 1) % 1;
    if (h*6 < 1) {
      return m1 + (m2-m1) * h*6;
    }
    if (h*2 < 1) {
      return m2;
    }
    if (h*3 < 2) {
      return m1 + (m2-m1) * (2/3 - h) * 6;
    }
    return m1;
  }

  var rgbFromHsl = function(h, s, l) {
    var m2;
    if (l < 0.5) {
      m2 = l * (s+1);
    } else {
      m2 = l + s - l*s;
    }
    var m1 = l*2 - m2;
    return {
      r: componentFromHue(m1, m2, h + 1/3),
      g: componentFromHue(m1, m2, h),
      b: componentFromHue(m1, m2, h - 1/3)
    };
  }

  var hslFromRgb = function(r, g, b) {
    var m = Math.min(r, g, b)
    var M = Math.max(r, g, b)
    var l = (M+m)/2
    var c = M - m
    var s
    if (l <= 0.0) {
      s = 0
    } else if (l <= 0.5) {
      s = c/(2*l)
    } else {
      s = c/(2 - 2*l)
    }
    var h = 0
    if (c == 0) {
      h = 0
    } else if (M == r) {
      h = ((g - b) / c)
    } else if (M == g) {
      h = ((b - r) / c) + 2
    } else if (M == b) {
      h = ((r - g) / c) + 4
    }
    h = ((h/6) + 1) % 1;

    return {
      h: h,
      s: s, 
      l: l
    }
  }


  function hueReplace(el, primary, secondary) {
    primary = hslFromRgb(primary[0]/255, primary[1]/255, primary[2]/255)
    secondary = hslFromRgb(secondary[0]/255, secondary[1]/255, secondary[2]/255)
    var canvas = document.createElement("canvas");
    //canvas.width = el.naturalWidth
    //canvas.height = el.naturalHeight
    canvas.width = el.offsetWidth
    canvas.height = el.offsetHeight

    var ctx = canvas.getContext("2d");
    ctx.drawImage(el, 0, 0, canvas.width, canvas.height);

    var map = ctx.getImageData(0, 0, canvas.width, canvas.height)
    var data = map.data;

    var r, g, b
    var hsl, rgb
    var hues = {}
    for(var i = 0, len = data.length;i < len;i += 4) {
      r = data[i]/255
      g = data[i+1]/255
      b = data[i+2]/255
      // alpha channel (p+3) is ignored

      hsl = hslFromRgb(r, g, b)
      if (hsl.h > 0.50 && hsl.h < 0.70) {
        hues[hsl.h] = (hues[hsl.h] || 0) + 1
        if (i % 1000 == 0) {
          console.log('primary', r*255, g*255, b*255, hsl)
        }
        hsl.h = primary.h
        if (hsl.s > 0.1) {
          hsl.s = primary.s
        }
      } else if (hsl.h > 0.05 && hsl.h < 0.18) {
        hues[hsl.h] = (hues[hsl.h] || 0) + 1
        if (i % 1000 == 0) {
          console.log('secondary', r*255, g*255, b*255, hsl)
        }
        hsl.h = secondary.h
        if (hsl.s > 0.1) {
          hsl.s = secondary.s
        }
      }
      rgb = rgbFromHsl(hsl.h, hsl.s, hsl.l)
      if (i % 1000 == 0) {
        //console.log(r, g, b, hsl, rgb)
      }

      data[i] = rgb.r*255
      data[i+1] = rgb.g*255
      data[i+2] = rgb.b*255
      //data[i] = hsl.l*255
      //data[i+1] = hsl.l*255
      //data[i+2] = hsl.l*255
    }

    ctx.putImageData(map,0,0);

    el.src = canvas.toDataURL();
    console.log(hues)
  }

  var baseBlue = [58, 119, 174]
  var baseYellow = [255, 200, 2]

  var $commander = $('[data-bind="visible: true, attr: {src: commanderImg}"]')
  var colorize = function() {
    var main = colors[colorNames[Math.floor(Math.random() * 11)]]
    var primary = parseRgb(main.colour)
    var choices = main.secondary_colour
    var secondary = parseRgb(colors[choices[Math.floor(Math.random() * choices.length)]].colour)

    $commander.off('load', colorize)
    hueReplace(
      $commander[0],
      primary
      ,
      secondary
    );
    //setTimeout(colorize, 1000)
  }
  $commander.on('load', colorize)

  window.rgbFromHsl = rgbFromHsl
  window.hslFromRgb = hslFromRgb
})()
