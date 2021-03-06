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
		teasampleA.Client.printf(s);
	}

	public void assert(boolean cond, String s) const {
		this.log(s);
	}

	public void doCommand(String cmd) const {
		StringArray cmds;
		int  length;
		cmds=split(cmd,',');
		length=cmds.length;
		for(int i=0;i<length;i++){
			teasampleA.Command.execute(cmds.getAt(i));
		}
	}

	public int getScreenType(const Context& context) const {
		Size sz;
		teasampleA.Screen.getScreenSize(sz);
		if(sz.width>context.params.longWidth){
			return Util.BIG_SIZE;
		}else if(sz.width<context.params.shortWidth){
			return Util.SMALL_SIZE;
		}else {
			return Util.NORMAL_SIZE;
		}
	}

}


