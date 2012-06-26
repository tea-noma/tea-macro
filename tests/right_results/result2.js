function log(s){
	var logTag=$('log');
	logTag.innerHTML+=satanise(s);
}

function assert(s){
	log(s);
}

function doCommand(cmd){
	execute(cmd);
}

function getScreenType(context){
	return 'short';
}

