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
// #teaos:if == DEPLOYMENT CLIENTSIDE
		Client::printf(s);
/* #teaos:else
		Server::printf(s);
   #teaos:endif */
	}

	public function assert($cond, $s){
//#teaos:if (== MODE DEBUG)
		if($cond){
			$this->log($s);
		}
//#teaos:endif
	}

	public function doCommand($cmd){
// #teaos:if ! (defined DISABLE_MULTIPLE_COMMAND)
		$cmds=split($cmd,',');
		$length=$cmds->length;
		for($i=0;$i<$length;$i++){
			Command::execute($cmds[i]);
		}
/* #teaos:else
		Command::execute($cmd);
   #teaos:endif */
	}

	public function getScreenType($context){
/*#teaos:if (== SCREEN_SIZE SMALL_SIZE)
		return Util::$SMALL_SIZE;
  #teaos:elseif (== SCREEN_SIZE NORMAL_SIZE)
		return Util::$NORMAL_SIZE;
  #teaos:elseif (== SCREEN_SIZE BIG_SIZE)
		return Util::$BIG_SIZE;
  #teaos:else */
		Screen::getScreenSize($sz);
		if($sz->width>$context->params['longWidth']){
			return Util::$BIG_SIZE;
		}else if($sz->width<$context->params['shortWidth']){
			return Util::$SMALL_SIZE;
		}else {
			return Util::$NORMAL_SIZE;
		}
//#teaos:endif
	}
}

