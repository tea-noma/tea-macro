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
	return 'normal';
	var sz=getScreenSize();
	if(sz.width>context.params.longWidth){
		return 'long';
	}else if(sz.width<context.params.longWidth){
		return 'small';
	}else {
		return 'short';
	}
}

