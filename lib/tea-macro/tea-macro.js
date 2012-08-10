/**
 * LICENSE: 
 * 
 * (MIT License)
 * 
 * Copyright (c) 2012-2012 Toru Nomakuchi
 * 
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation 
 * files (the "Software"), to deal in the Software without 
 * restriction, including without limitation the rights to use, 
 * copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following 
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be 
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
 * OTHER DEALINGS IN THE SOFTWARE.
 */

(function() {

var fs = require('fs');
var mpath=require('path');

var executeExpr;

// local variable
var namespace_='teaos';
var textRegex=new RegExp("#teaos:{[a-zA-Z_][a-zA-Z0-9_]*}","g");
var macroRegex=new RegExp("^[#*/ ]*#teaos:([@]?[a-z_{}]+)(.*)$");
var defineRegex=new RegExp("^[ ]*([a-zA-Z_]+)[ ]*(.*)[ ]*$");
var nsRegex=new RegExp("^[ ]*([a-zA-Z_]*)[ ]*(.*)[ ]*$");

var file_values_={};
var compilers_={};
var compressors_={};


var registerCompiler=function(lang,compiler){
	compilers_[lang]=compiler;
}

var registerCompressor=function(lang,compressor){
	compressors_[lang]=compressor;
}

/** read file with cache
 * @param path  file path
 * @return      file buffer
 */
function readFileSync_(path){
	if(file_values_[path]){
		return file_values_[path];
	}
	try {
		file_values_[path]=fs.readFileSync(path,'utf-8');
		return file_values_[path];
	}catch(e){
		return null;
	}
}

/** split string by line terminator
 * @param doc   target document
 * @return      splited document
 */
var splitLine_=function(doc){
	var vs=doc.split("\r\n");
	if(vs.length==1){
		vs=doc.split("\n");
	}
	if(vs[vs.length-1]==''){
		vs.pop();
	}
	return vs;
}

function readFileCodeSync_(path){
	var buf=readFileSync_(path);
	var outbuf='';
	var i;
	var lines;
	if(buf==null){
		return null;
	}
	lines=splitLine_(buf);
	if(!lines[0].match(/\/\*\*/)){
		return buf;
	}
	for(i=1;i<lines.length;i++){
		if(lines[i].match(/[ ]*\*\//)){
			i++;
			break;
		}
	}
	for(;i<lines.length;i++){
		outbuf+=lines[i]+"\n";
	}
	return outbuf;
}

function setNamespace_(ns){
	namespace_=ns;
	textRegex=new RegExp("#"+ns+":{[a-zA-Z_][a-zA-Z0-9_]*}","g");
	macroRegex=new RegExp("^[#*/ ]*#"+ns+":([@]?[a-z_{}]+)(.*)$");
}

/** convert  expression string to expression object
 * @param value  (LISP style) expression string
 * @param line   line number
 * @return       expression object
 */
function toExpr(value,line){
	var token=[];
	var ctoken=token;
	var newToken;
	var stacks=[];
	var c;
	var ss='';
	for(var i=0;i<value.length;i++){
		c=value[i];
		switch(c){
		case ' ':
		case "\t":
		case ",":
			if(ss!=""){
				ctoken.push(ss);
				ss="";
			}
			break;
		case '(':
			if(ss!=""){
				console.log("warning: no space before '(' in line "+line+" at "+(i+1));
				ctoken.push(ss);
				ss="";
			}
			stacks.push(ctoken);
			newToken=[];
			ctoken.push(newToken);
			ctoken=newToken;
			break;
		case ')':
			if(ss!=""){
				ctoken.push(ss);
				ss="";
			}
			if(stacks.length>0){
				ctoken=stacks.pop();
			}else{
				console.log("error: unmatched ')' in line "+line+" at "+(i+1));
				return null;
			}
			break;
		default:
			ss+=c;
			break;
		}
	}
	if(ss!=''){
		ctoken.push(ss);
	}

	// remove last '*/', '###'
	var ltoken=null;
	if(token&&(token.length>0)){
		ltoken=token[token.length-1];
		if((typeof ltoken=='string')&&((ltoken=='*/')||(ltoken=='###'))){
			ltoken.pop();
		}
	}

	return token;
}



/** parse document
 * @param doc  document
 * @return     command array
 */
function parse(doc,context){
	var vs;
	var cmds=[];
	var pats;
	var exprs;
	var subpats;
	var mode=context.mode;

	var vs=splitLine_(doc);
	for(var i=0;i<vs.length;i++){
		if(pats=vs[i].match(macroRegex)){
			if(mode=='tcmd'){
				console.log(pats[1]+','+pats[2]);
			}
			exprs=null;
			switch(pats[1]){
			case 'define':
				if(subpats=pats[2].match(defineRegex)){
					exprs=[subpats[1],subpats[2]];
				}else{
					console.log("error: invalid format in define statement "+pats[1]+" in line "+(i+1));
				}
				break;
			case 'include':
			case 'include_once':
			case 'include_code':
			case 'include_code_once':
				exprs=toExpr(pats[2],i+1);
				break;
			case 'if':
			case 'elseif':
			case 'elif':
				exprs=toExpr(pats[2],i+1);
				break;
			case 'else':
			case 'endif':
				break;
			case 'namespace':
				if(subpats=pats[2].match(nsRegex)){
					setNamespace_(subpats[1]);
				}else{
					console.log("error: invalid format in namespace statement "+pats[1]+" in line "+(i+1));
				}
				break;
			default:
				if(pats[1].charAt(0)!='@'){
					console.log("error: unknown statement "+pats[1]+" in line "+(i+1));
				}
				break;
			}
			cmds.push({type:pats[1], exprs:exprs});
		}else{
			cmds.push({type:'text', value:vs[i]});
		}
	}
	if(mode=='cmd'){
		for(var i=0;i<cmds.length;i++){
			console.log(JSON.stringify(cmds[i]));
		}
	}
	return cmds;
}

/** execute expression
 * @param expr    expression object
 * @param context context data
 * @retrun        expression value
 */
function executeExpr_(expr,context){
	var value=null;
	if(typeof expr=='string'){
		if(context.params[expr]){
			value=context.params[expr];
		}else{
			value=expr;
		}
	}else if(typeof expr[0]=='string'){
		switch(expr[0]){
		case 'defined':
			for(var k=1;k<expr.length;k++){
				if(typeof expr[k]!='string'){
					console.log("error: invalid format in defined expression");
					return null;
				}else if(context.params[expr[k]]==null){
					return false;
				}else{
					//nothing to do
				}
			}
			value=true;
			break;
		case 'append':{
			if(expr.length<3){
				console.log("error: append expression needs 2 arguments or more");
				return null;
			}
			value='';
			var v;
			for(var k=1;k<expr.length;k++){
				if(!(v=executeExpr(expr[k],context))){
					return false;
				}
				value+=v;
			}
			break;}
		case '&&':
			if(expr.length<3){
				console.log("error: && expression needs 2 arguments or more");
				return null;
			}
			for(var k=1;k<expr.length;k++){
				if(!executeExpr(expr[k],context)){
					return false;
				}
			}
			value=true;
			break;
		case '||':
			if(expr.length<3){
				console.log("error: && expression needs 2 arguments or more");
				return null;
			}
			for(var k=1;k<expr.length;k++){
				if(executeExpr(expr[k],context)){
					return true;
				}
			}
			value=false;
			break;
		case '==':
			if(expr.length!=3){
				console.log("error: == expression needs 2 arguments");
				return null;
			}
			return (executeExpr(expr[1],context)==executeExpr(expr[2],context));
		case '!=':
			if(expr.length!=3){
				console.log("error: != expression needs 2 arguments");
				return null;
			}
			return (executeExpr(expr[1],context)!=executeExpr(expr[2],context));
		case '!':
			if(expr.length!=2){
				console.log("error: == expression needs only 1 argument");
				return null;
			}
			return !executeExpr(expr[1],context);
			break;
		default:
			break;
		}
	}else if(expr[0] instanceof Array){
		if(expr.length==1){
			value=executeExpr(expr[0], context);
		}else{
			console.log("error: () expression needs only 1 argument");
		}
	}else{
		console.log("error: unknown expression");
	}
	return value;
}

function executeExpr_withLog_(expr,context){
	var value=executeExpr_(expr,context);
	console.log("expr:"+executeExpr_(expr,context)+'<='+JSON.stringify(expr));
	return value;
}

/** execute all statements
 * @param stmts    statements
 * @param context  context data
 */
function execute(stmts,context){
	var stmt;
	var exprs;
	var ignoreNest=0;
	var isActive=true;
	var blkStack=[];
	var blkState=0; // 0:executing, 1:if-executing, 2:, if-finding, 3: if-ending, (4:ignore)
	var mode=context.mode;

	if(mode=='cond'){
		executeExpr=executeExpr_withLog_;
	}else{
		executeExpr=executeExpr_;
	}

	for(var i=0;i<stmts.length;i++){
		stmt=stmts[i];
		if(mode=='stmt'){
			console.log(JSON.stringify(stmt));
		}
		exprs=(stmt.exprs)?stmt.exprs:null;
		switch(stmt.type){
		case 'text':
			if(isActive){
				var key;
				if(stmt.value!='//'){
					context.buf+=stmt.value.replace(textRegex,function(match){
						key=match.substring(8,match.length-1);
						return context.params[key] || key;
					});
					context.buf+="\n";
				}
			}
			break;
		case 'define':
			if(isActive){
				context.params[exprs[0]]=executeExpr(exprs[1],context);
			}
			break;
		case 'include':{
			var oldcurdir=context.curdir;
			var filepath=mpath.join(context.curdir,exprs[0]);
			context.curdir=mpath.dirname(filepath);
			var doc=readFileSync_(filepath);
			if(doc!=null){
				compile(doc, context);
				if(!context.includes){
					context.includes={};
				}
				context.includes[exprs[0]]=true;
			}else{
				console.log("error: invalid include file "+exprs[0]);
			}
			context.curdir=oldcurdir;
			break;}
		case 'include_once':{
			if(context.includes&&(context.includes[exprs[0]])){
				// ignore
			}else{
				var oldcurdir=context.curdir;
				var filepath=mpath.join(context.curdir,exprs[0]);
				context.curdir=mpath.dirname(filepath);

				var doc=readFileSync_(filepath);
				if(doc!=null){
					compile(doc, context);
					if(!context.includes){
						context.includes={};
					}
					context.includes[exprs[0]]=true;
				}else{
					console.log("error: invalid include file "+exprs[0]);
				}

				context.curdir=oldcurdir;
			}
			break;}
		case 'include_code':{
			var oldcurdir=context.curdir;
			var filepath=mpath.join(context.curdir,exprs[0]);
			context.curdir=mpath.dirname(filepath);
			var doc=readFileCodeSync_(filepath);
			if(doc!=null){
				compile(doc, context);
				if(!context.includes){
					context.includes={};
				}
				context.includes[exprs[0]]=true;
			}else{
				console.log("error: invalid include file "+exprs[0]);
			}
			context.curdir=oldcurdir;
			break;}
		case 'include_code_once':{
			if(context.includes&&(context.includes[exprs[0]])){
				// ignore
			}else{
				var oldcurdir=context.curdir;
				var filepath=mpath.join(context.curdir,exprs[0]);
				context.curdir=mpath.dirname(filepath);
				var doc=readFileCodeSync_(filepath);
				if(doc!=null){
					compile(doc, context);
					if(!context.includes){
						context.includes={};
					}
					context.includes[exprs[0]]=true;
				}else{
					console.log("error: invalid include file "+exprs[0]);
				}
				context.curdir=oldcurdir;
			}
			break;}
		case 'if':
			if(isActive){
				//assert(blkState==0)
				if(mode=='cond'){
					console.log("stmt:"+executeExpr(exprs,context)+'<='+JSON.stringify(stmt));
				}
				if(executeExpr(exprs,context)){
					blkState=1; //if-executing
				}else{
					blkState=2; //if-finding
				}
				if(blkState==1){ //if-executing
					blkStack.push(blkState);
					blkState=0;
				}else{
					isActive=false;
					ignoreNest++;
				}
			}else{
				ignoreNest++;
			}
			break;
		case 'elseif':
		case 'elif':
		case 'else':
			if(isActive){
				blkState=blkStack.pop();
			}else{
				ignoreNest--;
				if(ignoreNest==0){
					isActive=true;
				}
			}
			if(isActive){
				switch(blkState){
				case 1: //if-executing
					blkState=3;//if-ending
					break;
				case 2: //if-finding
					if((mode=='cond')&&((stmt.type=='elseif')||(stmt.type=='elif'))){
						console.log('stmt:'+executeExpr(exprs,context)+'<='+JSON.stringify(stmt));
					}
					if((stmt.type=='else')||(executeExpr(exprs,context))){
						blkState=1; //if-executing
					}else{
						//nothing to do
					}
					break;
				case 3://if-ending
					// nothing to do
					break;
				}
				if(blkState==1){ //if-executing
					blkStack.push(blkState);
					blkState=0;
				}else{
					//blkState=4; //ignore
					isActive=false;
					ignoreNest++;
				}
			}else{
				ignoreNest++;
			}
			break;
		case 'endif':
			if(isActive){
				blkState=blkStack.pop();
			}else{
				ignoreNest--;
				if(ignoreNest==0){
					isActive=true;
				}
			}
			if(isActive){
				blkState=0;
			}
			break;
		default:
			break;
		}
	}
}

function compile(doc,context){
	var cmds=parse(doc,context);
	execute(cmds,context);
}

function compileFromFile(filepath,mode){
	var read;
	if(filepath){
		read = fs.createReadStream(filepath, {encoding: 'utf8'});
	}else{
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
		read = process.stdin;
	}
	read.on('data', function (data){
		var context={
			params:{},buf:'',
			mode:mode,
			curdir:mpath.dirname(filepath)
		};
		compile(data,context);
		if(mode=='ctx'){
			console.log(JSON.stringify(context));
		}else if(mode=='code'){
			console.log(context.buf);
		}
	});
}

function make(basedir, makeobj,target){
	var rbasedir;
	if(target==null){
		for(var k in makeobj){
			var m=makeobj[k];
			if(m.outputs){
				rbasedir=(m.basedir!=null)?mpath.join(basedir,m.basedir):basedir;
				makeBlock_(rbasedir, m);
			}
		}
	}else{
		if(makeobj[target]){
			var m=makeobj[target];
			if(m.outputs){
				rbasedir=(m.basedir!=null)?mpath.join(basedir,m.basedir):basedir;
				makeBlock_(rbasedir, m);
			}
			if(m.targets){
				for(var i=0;i<m.targets.length;i++){
					rbasedir=(m.basedir!=null)?mpath.join(basedir,m.basedir):basedir;
					makeBlock_(rbasedir, m.targets[i]);
				}
			}
		}
	}
}

function makeBlock_(basedir, o){
	var tbuf;
	var inputs=o.inputs;
	for(var j=0;j<inputs.length;j++){
	var pats=inputs[j].match(/([a-zA-Z0-9_-]+)\.([a-z]+)$/);
		if(pats){
			var buf='';
			var keys={
				path:pats[0], 
				name:pats[1], 
				extension:pats[2]
			};
			if(o.before){
				if(typeof o.before=='string'){
					tbuf=readFileSync_(mpath.join(basedir, o.before));
					if(tbuf!=null){
						buf+=tbuf;
					}
				}else{
					for(var m=0;m<o.before.length;m++){
						tbuf=readFileSync_(mpath.join(basedir, o.before[m]));
						if(tbuf!=null){
							buf+=tbuf;
						}
					}
				}
			}
			tbuf=readFileSync_(mpath.join(basedir, o.inputs[j]));
			if(tbuf!=null){
				buf+=tbuf;
			}
			if(o.after){
				if(typeof o.after=='string'){
					tbuf=readFileSync_(mpath.join(basedir, o.after));
					if(tbuf!=null){
						buf+=tbuf;
					}
				}else{
					for(var m=0;m<o.after.length;m++){
						tbuf=readFileSync_(mpath.join(basedir, o.after[m]));
						if(tbuf!=null){
							buf+=tbuf;
						}
					}
				}
			}

			var context={
				params:{},buf:'',
				mode:'code',
				curdir:basedir
			};
			compile(buf,context);

			var output=o.outputs.replace(/\${([a-z]+)}/g,function(k,v){
				return (keys[v])?keys[v]:k;
			});
			if(o.compile){
				var pos=o.inputs[j].lastIndexOf('.');
				if(pos!=-1){
					var extension=o.inputs[j].substr(pos+1);
					if(o.compile[extension]){
						var compilerName=o.compile[extension];
						if(compilers_[compilerName]){
							context.buf=compilers_[compilerName](context.buf);
						}
					}
				}
			}
			if(o.compress){
				var pos=o.outputs.lastIndexOf('.');
				if(pos!=-1){
					var extension=o.outputs.substr(pos+1);
					if(o.compress[extension]){
						var compressorName=o.compress[extension];
						if(compressors_[compressorName]){
							context.buf=compressors_[compressorName](context.buf);
						}
					}
				}
			}
			fs.writeFileSync(mpath.join(basedir, output), context.buf+"\n");
		}
	}
}

/** make from file
 * @param makefile  path of make file
 * @param target    make target. if null, all targets are compiled.
 */
function makeFromFile(makefile,target){
	var read;
	var basedir='.';
	if(makefile){
		read = fs.createReadStream(makefile, {encoding: 'utf8'});
		basedir=mpath.dirname(makefile);
	}else{
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
		read = process.stdin;
	}
	read.on('data', function (data){
		try {
			var o=JSON.parse(data);
			make(basedir, o, target);
		}catch(e){
			console.log(e);
		}
	});
}

exports.registerCompiler=registerCompiler;
exports.registerCompressor=registerCompressor;
exports.compile=compile;
exports.compileFromFile=compileFromFile;
exports.make=make;
exports.makeFromFile=makeFromFile;
exports.parse=parse;
exports.execute=execute;


}).call(this);
