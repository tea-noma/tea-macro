log = (s) ->
  logTag=$('log')
  logTag.innerHTML+=satanise(s)

assert = (s) ->


doCommand = (cmd) ->
  cmds=cmd.split(',')
  for cmd in cmds
    execute(cmd)

getScreenType = (context) ->
  'big'


