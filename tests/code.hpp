#ifndef __UTIL_HPP__
#define __UTIL_HPP__

#define SMALL_SIZE  1
#define NORMAL_SIZE 2
#define BIG_SIZE    3

#include "StringArray.hpp";
#include "Context.hpp";

// MODE #teaos:{MODE}

class Util {
private:
	static Util* singleton;
	Util(void){
		// nothing to do
	}
public:
	static Util* getInstance(void){
		return singleton;
	}
	void log(const char* s) const {
// #teaos:if == DEPLOYMENT CLIENTSIDE
		client_printf(s);
/* #teaos:else
		server_printf(s);
   #teaos:endif */
	}
	void assert(bool cond, const char* s) const {
//#teaos:if (== MODE DEBUG)
		this->log(s);
//#teaos:endif
	}
	void doCommand(const char* cmd) const {
// #teaos:if ! (defined DISABLE_MULTIPLE_COMMAND)
		StringArray* cmds;
		int  length;
		cmds=split(cmd,',');
		length=cmds->length;
		for(int i=0;i<length;i++){
			execute((*cmds)[i]);
		}
		delete cmds;
/* #teaos:else
		execute(cmd);
   #teaos:endif */
	}
	int getScreenType(const Context& context) const {
/*#teaos:if (== SCREEN_SIZE SMALL_SIZE)
		return SMALL_SIZE;
  #teaos:elseif (== SCREEN_SIZE NORMAL_SIZE)
		return NORMAL_SIZE;
  #teaos:elseif (== SCREEN_SIZE BIG_SIZE)
		return BIG_SIZE;
  #teaos:else */
		Size sz;
		getScreenSize(sz);
		if(sz.width>context.params.longWidth){
			return BIG_SIZE;
		}else if(sz.width<context.params.shortWidth){
			return SMALL_SIZE;
		}else {
			return NORMAL_SIZE;
		}
//#teaos:endif
	}
};

#endif
