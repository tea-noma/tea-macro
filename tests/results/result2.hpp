#ifndef __UTIL_HPP__
#define __UTIL_HPP__

#define SMALL_SIZE  1
#define NORMAL_SIZE 2
#define BIG_SIZE    3

#include "StringArray.hpp";
#include "Context.hpp";

// MODE 1

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
		execute(cmd);
	}
	int getScreenType(const Context& context) const {
		return SMALL_SIZE;
	}
};

#endif

