<?php

class Util {
	private static $singleton = null;
	
	public static int $SMALL_SIZE=1;
	public static int $NORMAL_SIZE=2;
	public static int $BIG_SIZE=3;

	private function __construct(){
	}

	public static function getInstance(){
		if(is_null(self::$singleton)){
			self::$singleton = new self;
		}
		return self::$singleton;
	}

	public function log($s){
		Client::printf(s);
	}

	public function assert($cond, $s){
	}

	public function doCommand($cmd){
		$cmds=split($cmd,',');
		$length=$cmds->length;
		for($i=0;$i<$length;$i++){
			Command::execute($cmds[i]);
		}
	}

	public function getScreenType($context){
		return Util::$BIG_SIZE;
	}
}


