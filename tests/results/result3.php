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
		Server::printf(s);
	}

	public function assert($cond, $s){
		if($cond){
			$this->log($s);
		}
	}

	public function doCommand($cmd){
		Command::execute($cmd);
	}

	public function getScreenType($context){
		return Util::$SMALL_SIZE;
	}
}


