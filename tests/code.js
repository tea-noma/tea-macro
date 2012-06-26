function log(s){
// #teaos:if == DEPLOYMENT CLIENTSIDE
	var logTag=$('log');
	logTag.innerHTML+=satanise(s);
/* #teaos:else
	console.log(s);
   #teaos:endif */
}

function assert(s){
//#teaos:if (== MODE DEBUG)
	log(s);
//#teaos:endif
}

function doCommand(cmd){
// #teaos:if defined DISABLE_MULTIPLE_COMMAND
	var cmds;
	var length;
	cmds=cmd.split(',');
	length=cmds.length;
	for(var i=0;i<length;i++){
		execute(cmds[i]);
	}
// #teaos:else
	execute(cmd);
// #teaos:endif
}

function getScreenType(context){
/*#teaos:if (== SCREEN_SIZE SMALL_SIZE)
	return 'short';
  #teaos:elseif (== SCREEN_SIZE NORMAL_SIZE)
	return 'normal';
  #teaos:elseif (== SCREEN_SIZE BIG_SIZE)
	return 'long';
  #teaos:else */
	var sz=getScreenSize();
	if(sz.width>context.params.longWidth){
		return 'long';
	}else if(sz.width<context.params.longWidth){
		return 'small';
	}else {
		return 'short';
	}
//#teaos:endif
}
