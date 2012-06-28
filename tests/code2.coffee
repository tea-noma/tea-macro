log = (s) ->
  #teaos:if == DEPLOYMENT CLIENTSIDE
  logTag=$('log')
  logTag.innerHTML+=satanise(s)
  ###teaos:else
  console.log(s)
  #teaos:endif ###

assert = (s) ->
  #teaos:if (== MODE DEBUG)
  log(s)
  #teaos:endif


doCommand = (cmd) ->
  #teaos:if ! (defined DISABLE_MULTIPLE_COMMAND)
  cmds=cmd.split(',')
  for cmd in cmds
    execute(cmd)
  ###teaos:else
  execute(cmd)
  #teaos:endif ###

getScreenType = (context) ->
  ###teaos:if (== SCREEN_SIZE SMALL_SIZE)
  'small'
  #teaos:elseif (== SCREEN_SIZE NORMAL_SIZE)
  'normal'
  #teaos:elseif (== SCREEN_SIZE BIG_SIZE)
  'big'
  #teaos:else ###
  sz=getScreenSize()
  if (sz.width>context.params.longWidth)
    'big'
  else if (sz.width<context.params.shortWidth)
    'small'
  else
    'normal'
  #teaos:endif

