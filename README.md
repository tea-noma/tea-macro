TeaMacro (0.1.1)
======================
 Using TeaMacro in your Javascript (and CoffeeScript, PHP, Java, C/C++) project, you could optimize code, support cross browser and support cross platform very easily.
 TeaMacro is macro language. This language works on ECMAScript(Javascript), CoffeeScript, PHP, Java and C/C++.

Usage
------

### Document sample ###

(code.js)

```javascript
    function log(s){
    // #teaos:if == DEPLOYMENT CLIENTSIDE
    	var logTag=$('log');
    	logTag.innerHTML+=satanise(s);
    /* #teaos:else
    	console.log(s);
       #teaos:endif */
    }
    
    function assert(cond,s){
    //#teaos:if (== MODE DEBUG)
    	if(!cond){
            log(s);
    	}
    //#teaos:endif
    }
    
    function doCommand(cmd){
    // #teaos:if ! (defined DISABLE_MULTIPLE_COMMAND)
    	var cmds;
    	var length;
    	cmds=cmd.split(',');
    	length=cmds.length;
    	for(var i=0;i<length;i++){
    		execute(cmds[i]);
    	}
    /* #teaos:else
    	execute(cmd);
       #teaos:endif */
    }
    
    function getScreenType(context){
    /*#teaos:if (== SCREEN_SIZE SMALL_SIZE)
    	return 'small';
      #teaos:elseif (== SCREEN_SIZE NORMAL_SIZE)
    	return 'normal';
      #teaos:elseif (== SCREEN_SIZE BIG_SIZE)
    	return 'big';
      #teaos:else */
    	var sz=getScreenSize();
    	if(sz.width>context.params.longWidth){
    		return 'big';
    	}else if(sz.width<context.params.shortWidth){
    		return 'small';
    	}else {
    		return 'normal';
    	}
    //#teaos:endif
    }
```

See also,

1. [CoffeeScript sample](https://github.com/tea-noma/tea-macro/blob/master/tests/code2.coffee "CoffeeScript code sample")
2. [Java sample](https://github.com/tea-noma/tea-macro/blob/master/tests/code.java "Java code sample")
3. [PHP sample](https://github.com/tea-noma/tea-macro/blob/master/tests/code.php "PHP code sample")
4. [C++ sample](https://github.com/tea-noma/tea-macro/blob/master/tests/code.hpp "C++ code sample")

### Command Line ###

 You can test your code without TeaMacro pre-processsor, because TeaMacro is described as the comment of ECMAScript.
 Having node.js environment, you can compile TeaMacro by using console command. The console command is described by the following form.

    > node app.js -p <file path>

 After installing TeaMacro in npm global scope, you can use teamacro command.

    > npm install tea-macro -g
    > teamacro -p <file path>

 Using pipeline, you can compile multiple file as a composited file, and store output data in file.

    > npm install tea-macro
    > cat tests/before.js tests/setting1.js tests/after.js tests/code.js | teamacro > tests/results/result1.js


Propose
------

### Switch debug/release mode ###
(before.js)

    // #teaos:define DEBUG 1
    // #teaos:define RELEASE 2

(setting.js)

    // #teaos:define MODE RELEASE

(after.js)

    // #teaos:if (!defined MODE)
    // #teaos:define MODE DEBUG
    // #teaos:endif

(code.js)

```javascript
    function assert(s){
    //#teaos:if (== MODE DEBUG)
    	var log=$('log');
    	log.innerHTML+=satanise(s);
    //#teaos:endif
    }
```

### Switch Serverside/Clientside javascript ###

(before.js)

    // #teaos:define SERVERSIDE 1
    // #teaos:define CLIENTSIDE 2

(setting.js) user setting file

    // #teaos:define DEPLOYMENT CLIENTSIDE

(after.js)

    // #teaos:if (!defined DEPLOYMENT)
    // #teaos:define DEPLOYMENT CLIENTSIDE
    // #teaos:endif

(code.js)

```javascript
    function log(s){
    //#teaos:if (== DEPLOYMENT CLIENTSIDE)
    	var log=$('log');
    	log.innerHTML+=satanise(s);
    /*#teaos:else
    	console.log(s);
      #teaos:endif */
    }
```

### Switch Optimized code/General code ###

(setting.js) user setting file

    // #teaos:define DISABLE_MULTIPLE_COMMAND

(code.js)

```javascript
    function doCommand(cmd){
    // #teaos:if defined DISABLE_MULTIPLE_COMMAND
    	var cmds;
    	var length;
    	cmds=cmd.split(',');
    	length=cmds.length;
    	for(var i=0;i<length;i++){
    		execute(cmds[i]);
    	}
    // #teaos:else
    	execute(cmd);
    // #teaos:endif
    }
```

### Support cross platform ###

(before.js)

    // #teaos:define ANY_DEVICE 0
    // #teaos:define IPHONE    1
    // #teaos:define ANDROID   2
    // #teaos:define CHROME    3
    // #teaos:define IPAD      4
    // #teaos:define WINDOWSPC 5
    // #teaos:define LINUXPC   6
    // #teaos:define MACPC     7
    // #teaos:define DEVICE    ANY_DEVICE
    //
    // #teaos:define ANY_SIZE    0
    // #teaos:define SMALL_SIZE  1
    // #teaos:define NORMAL_SIZE 2
    // #teaos:define BIG_SIZE    3
    // #teaos:define SCREEN_SIZE ANY_SIZE

(setting.js)

    // #teaos:define DEVICE    IPAD

(after.js)

    // #teaos:if (|| (== DEVICE IPHONE) (== DEVICE ANDROID))
    //   #teaos:define SCREEN_SIZE  SMALL_SIZE
    // #teaos:elseif (== DEVICE IPAD)
    //   #teaos:define SCREEN_SIZE  NORMAL_SIZE
    // #teaos:elseif (|| (== DEVICE WINDOWSPC) (== DEVICE LINUXPC) (== DEVICE MACPC))
    //   #teaos:define SCREEN_SIZE  BIG_SIZE
    // #teaos:else
    //   #teaos:define SCREEN_SIZE  ANY_SIZE
    // #teaos:endif

(code.js)

```javascript
    function getScreenType(context){
    /*#teaos:if (== SCREEN_SIZE SMALL_SIZE)
    	return 'short';
      #teaos:elseif (== SCREEN_SIZE NORMAL_SIZE)
    	return 'normal';
      #teaos:elseif (== SCREEN_SIZE BIG_SIZE)
    	return 'long';
      #teaos:else */
    	var sz=getScreenSize();
    	if(sz.width>context.params.longWidth){
    		return 'long';
    	}else if(sz.width<context.params.longWidth){
    		return 'small';
    	}else {
    		return 'short';
    	}
    //#endif
    }
```

TeaMacro Syntax
----------

### Statement ###

#### "define" statement ####

 "define" statement defines the parameter which is refered in another statement.

    // #teaos:define DEBUG 1
    // #teaos:define RELEASE 2
    // #teaos:define MODE DEBUG

#### include/include_once statement [TBD] ####

 "include" statement imports the specified file in the current document.

    // #teaos:include <filepath>

 "include_once" statement imports the specified file in the current document at once.

    // #teaos:include_once <filepath>

#### if/elseif(or elif)/endif statement ####

pattern:1

    // #teaos:if <expression>
    <active code>
    /* #teaos:elseif <expression>
    <inactive code>
    #teaos:else
    <inactive code>
    #teaos:endif */

pattern:2

    /* #teaos:if <expression>
    <inactive code>
       #teaos:else */
    <active code>
    // #teaos:endif

pattern:3

    /* #teaos:if <expression>
    <inactive code>
       #teaos:else */
    <active code>
    // #teaos:endif

### Expression ###

 TeaMacro expression is like LISP.

#### 'defined' expression ####

'defined' expression checks if the specified parameter is defined.

     (defined <parameter name> <parameter name> ...)

#### expression for composition (logical and / logical or / logical not) ####

 '&&' expression caluculates logical and.
 '||' expression caluculates logical or.

    (&& <expression> <expression> ...)
    (|| <expression> <expression> ...)
    (! <expression>)

#### expression for comparison ####

 '==' expression check if left expression equals right expression.
 '!=' expression check if left expression doesn't equal right expression.

    (== <expression> <expression>)
    (!= <expression> <expression>)


License
----------
Copyright &copy; 2012-2012 Toru Nomakuchi
Distributed under the [MIT License][mit].
 
[MIT]: http://www.opensource.org/licenses/mit-license.php
