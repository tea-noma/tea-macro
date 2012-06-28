log = (s) ->
  logTag=$('log')
  logTag.innerHTML+=satanise(s)

assert = (s) ->
  log(s)


doCommand = (cmd) ->
  execute(cmd)

getScreenType = (context) ->
  'small'


