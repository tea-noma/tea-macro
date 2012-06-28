log = (s) ->
  logTag=$('log')
  logTag.innerHTML+=satanise(s)

assert = (s) ->
  log(s)


doCommand = (cmd) ->
  cmds=cmd.split(',')
  for cmd in cmds
    execute(cmd)

getScreenType = (context) ->
  sz=getScreenSize()
  if (sz.width>context.params.longWidth)
    'big'
  else if (sz.width<context.params.shortWidth)
    'small'
  else
    'normal'


