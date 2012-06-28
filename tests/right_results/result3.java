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
		teasampleA.Server.printf(s);
	}

	public void assert(boolean cond, String s) const {
		this.log(s);
	}

	public void doCommand(String cmd) const {
		teasampleA.Command.execute(cmd);
	}

	public int getScreenType(const Context& context) const {
		return Util.SMALL_SIZE;
	}

}


