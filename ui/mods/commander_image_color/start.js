(function() {
  var cic = commander_image_color

  var baseBlue = [58, 119, 174]
  var baseYellow = [255, 200, 2]

  var colorize = function() {
    var main = cic.colors[cic.colorNames[Math.floor(Math.random() * 11)]]
    //var main = cic.colors['BLACK']
    var primary = cic.parseRgb(main.colour)
    var choices = main.secondary_colour
    var secondary = cic.parseRgb(cic.colors[choices[Math.floor(Math.random() * choices.length)]].colour)

    $commander.off('load', colorize)
    cic.replaceTeamColors(
      $commander[0],
      $clone[0],
      primary
      ,
      secondary
    );
    $clone.fadeIn(2000)
    //setTimeout(colorize, 1000)
  }

  var $commander = $('#background_commander')
  var offset = $commander.offset()
  var $clone = $commander.clone()
    .attr('id', 'background_commander_clone')
    .attr('data-bind', '')
    .css({
      width: '50%',
      //position: 'absolute', 
      'margin-left': '-50%',
    })
  $commander.after($clone)
  $clone.fadeOut()

  $commander.on('load', colorize)
})()
