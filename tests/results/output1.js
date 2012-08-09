function log(s){
	var logTag=$('log');
	logTag.innerHTML+=satanise(s);
}

function assert(s){
	log(s);
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
	var sz=getScreenSize();
	if(sz.width>context.params.longWidth){
		return 'big';
	}else if(sz.width<context.params.shortWidth){
		return 'small';
	}else {
		return 'normal';
	}
}

