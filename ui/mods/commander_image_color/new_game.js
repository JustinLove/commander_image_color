;(function() {
  model.secondaryColors = function() {
    var players = _.flatten(_.invoke(model.armies(), 'slots'))
    return _.invoke(players, 'secondaryColor')
  }
})()
