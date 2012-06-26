function log(s){
	var logTag=$('log');
	logTag.innerHTML+=satanise(s);
}

function assert(s){
}

function doCommand(cmd){
	var cmds;
	var length;
	cmds=cmd.split(',');
	length=cmds.length;
	for(var i=0;i<length;i++){
		execute(cmds[i]);
	}
}

function getScreenType(context){
	return 'long';
}

