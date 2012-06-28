#ifndef __UTIL_HPP__
#define __UTIL_HPP__

#define SMALL_SIZE  1
#define NORMAL_SIZE 2
#define BIG_SIZE    3

#include "StringArray.hpp";
#include "Context.hpp";

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
		client_printf(s);
	}
	void assert(bool cond, const char* s) const {
		this->log(s);
	}
	void doCommand(const char* cmd) const {
		StringArray* cmds;
		int  length;
		cmds=split(cmd,',');
		length=cmds->length;
		for(int i=0;i<length;i++){
			execute((*cmds)[i]);
		}
		delete cmds;
	}
	int getScreenType(const Context& context) const {
		Size sz;
		getScreenSize(sz);
		if(sz.width>context.params.longWidth){
			return BIG_SIZE;
		}else if(sz.width<context.params.shortWidth){
			return SMALL_SIZE;
		}else {
			return NORMAL_SIZE;
		}
	}
};

#endif

