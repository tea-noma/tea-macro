package teasampleB;

import teasampleA.*;


public class Util {
	private static Util singleton = new Util();

	public static int SMALL_SIZE=1;
	public static int NORMAL_SIZE=2;
	public static int BIG_SIZE=3;

	private Util(){}

	public static Util getInstance(){
		return singleton;
	}

	public void log(String s) const {
// #teaos:if == DEPLOYMENT CLIENTSIDE
		teasampleA.Client.printf(s);
/* #teaos:else
		teasampleA.Server.printf(s);
   #teaos:endif */
	}

	public void assert(boolean cond, String s) const {
//#teaos:if (== MODE DEBUG)
		this.log(s);
//#teaos:endif
	}

	public void doCommand(String cmd) const {
// #teaos:if ! (defined DISABLE_MULTIPLE_COMMAND)
		StringArray cmds;
		int  length;
		cmds=split(cmd,',');
		length=cmds.length;
		for(int i=0;i<length;i++){
			teasampleA.Command.execute(cmds.getAt(i));
		}
/* #teaos:else
		teasampleA.Command.execute(cmd);
   #teaos:endif */
	}

	public int getScreenType(const Context& context) const {
/*#teaos:if (== SCREEN_SIZE SMALL_SIZE)
		return Util.SMALL_SIZE;
  #teaos:elseif (== SCREEN_SIZE NORMAL_SIZE)
		return Util.NORMAL_SIZE;
  #teaos:elseif (== SCREEN_SIZE BIG_SIZE)
		return Util.BIG_SIZE;
  #teaos:else */
		Size sz;
		teasampleA.Screen.getScreenSize(sz);
		if(sz.width>context.params.longWidth){
			return Util.BIG_SIZE;
		}else if(sz.width<context.params.shortWidth){
			return Util.SMALL_SIZE;
		}else {
			return Util.NORMAL_SIZE;
		}
//#teaos:endif
	}

}

