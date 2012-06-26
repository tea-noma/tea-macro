(function() {

var executeExpr;

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

	vs=doc.split("\r\n");
	if(vs.length==1){
		vs=doc.split("\n");
	}
	if(vs[vs.length-1]==''){
		vs.pop();
	}

	for(var i=0;i<vs.length;i++){
		if(pats=vs[i].match(/^[*\/ ]*#teaos:([@]?[a-z]+)(.*)$/)){
			if(mode=='tcmd'){
				console.log(pats[1]+','+pats[2]);
			}
			exprs=null;
			switch(pats[1]){
			case 'define':
				if(subpats=pats[2].match(/^[ ]*([a-zA-Z_]+)[ ]*(.*)[ ]*$/)){
					exprs=[subpats[1],subpats[2]];
				}else{
					console.log("error: invalid format in define statement "+pats[1]+" in line "+(i+1));
				}
				break;
			case 'include':
			case 'include_once':
				exprs=toExpr(pats[2],i+1);
				break;
			case 'if':
			case 'elseif':
				exprs=toExpr(pats[2],i+1);
				break;
			case 'else':
			case 'endif':
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
				if(stmt.value!='//'){
					context.buf+=stmt.value;
					context.buf+="\n";
				}
			}
			break;
		case 'define':
			if(isActive){
				context.params[exprs[0]]=executeExpr(exprs[1],context);
			}
			break;
		case 'include':
		case 'include_once':
			break;
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
					if((mode=='cond')&&(stmt.type=='elseif')){
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

exports.compile=compile;
exports.parse=parse;
exports.execute=execute;


}).call(this);
