JS.Test=new JS.Module('Test',{extend:{Unit:new JS.Module({extend:{AssertionFailedError:new JS.Class(Error,{initialize:function(a){this.message=a.toString()}})}}),asyncTimeout:10,showStack:true,filter:function(a,b){return this.Unit.AutoRunner.filter(a,b)}}});JS.Test.Unit.extend({Util:new JS.Module({extend:{Observable:new JS.Module({extend:{NOTHING:{}},addListener:function(a,b,c){if(b===undefined)throw new Error('No callback was passed as a listener');this.channels()[a]=this.channels()[a]||[];this.channels()[a].push([b,c]);return b},removeListener:function(a,b,c){var d=this.channels()[a];if(!d)return;var f=d.length;while(f--){if(d[f][0]===b){d.splice(f,1);return b}}return null},notifyListeners:function(a,b){var b=JS.array(arguments),a=b.shift(),c=this.channels()[a];if(!c)return 0;for(var d=0,f=c.length;d<f;d++)c[d][0].apply(c[d][1]||null,b);return c.length},channels:function(){return this.__channels__=this.__channels__||[]}})}})});JS.Test.Unit.extend({Assertions:new JS.Module({assertBlock:function(a,b,c){if(typeof a==='function'){c=b;b=a;a=null}this.__wrapAssertion__(function(){if(!b.call(c||null)){a=this.buildMessage(a||'assertBlock failed');throw new JS.Test.Unit.AssertionFailedError(a);}})},flunk:function(a){this.assertBlock(this.buildMessage(a||'Flunked'),function(){return false})},assert:function(a,b){this.__wrapAssertion__(function(){this.assertBlock(this.buildMessage(b,'<?> is not true',a),function(){return a})})},assertEqual:function(a,b,c){var d=this.buildMessage(c,'<?> expected but was\n<?>',a,b);this.assertBlock(d,function(){return JS.Enumerable.areEqual(a,b)})},assertNotEqual:function(a,b,c){var d=this.buildMessage(c,'<?> expected not to be equal to\n<?>',a,b);this.assertBlock(d,function(){return!JS.Enumerable.areEqual(a,b)})},assertNull:function(a,b){this.assertEqual(null,a,b)},assertNotNull:function(a,b){var c=this.buildMessage(b,'<?> expected not to be null',a);this.assertBlock(c,function(){return a!==null})},assertKindOf:function(c,d,f){this.__wrapAssertion__(function(){var a=(!d||typeof c==='string')?typeof d:(d.klass||d.constructor);var b=this.buildMessage(f,'<?> expected to be an instance of\n<?> but was\n<?>',d,c,a);this.assertBlock(b,function(){return JS.isType(d,c)})})},assertRespondTo:function(c,d,f){this.__wrapAssertion__(function(){var a=this.buildMessage('','<?>\ngiven as the method name argument to #assertRespondTo must be a String',d);this.assertBlock(a,function(){return typeof d==='string'});var b=c?c.constructor:typeof c;a=this.buildMessage(f,'<?>\nof type <?>\nexpected to respond to <?>',c,b,d);this.assertBlock(a,function(){return c&&c[d]!==undefined})})},assertMatch:function(b,c,d){this.__wrapAssertion__(function(){var a=this.buildMessage(d,'<?> expected to match\n<?>',c,b);this.assertBlock(a,function(){return JS.match(b,c)})})},assertNoMatch:function(b,c,d){this.__wrapAssertion__(function(){var a=this.buildMessage(d,'<?> expected not to match\n<?>',c,b);this.assertBlock(a,function(){return(typeof b.test==='function')?!b.test(c):!b.match(c)})})},assertSame:function(a,b,c){var d=this.buildMessage(c,'<?> expected to be the same as\n<?>',a,b);this.assertBlock(d,function(){return b===a})},assertNotSame:function(a,b,c){var d=this.buildMessage(c,'<?> expected not to be the same as\n<?>',a,b);this.assertBlock(d,function(){return b!==a})},assertInDelta:function(b,c,d,f){this.__wrapAssertion__(function(){this.assertKindOf('number',b);this.assertKindOf('number',c);this.assertKindOf('number',d);this.assert(d>=0,'The delta should not be negative');var a=this.buildMessage(f,'<?> and\n<?> expected to be within\n<?> of each other',b,c,d);this.assertBlock(a,function(){return Math.abs(b-c)<=d})})},assertSend:function(b,c){this.__wrapAssertion__(function(){this.assertKindOf(Array,b,'assertSend requires an array of send information');this.assert(b.length>=2,'assertSend requires at least a receiver and a message name');var a=this.buildMessage(c,'<?> expected to respond to\n<?(?)> with a true value',b[0],JS.Test.Unit.AssertionMessage.literal(b[1]),b.slice(2));this.assertBlock(a,function(){return b[0][b[1]].apply(b[0],b.slice(2))})})},__processExceptionArgs__:function(a){var a=JS.array(a),b=(typeof a[a.length-1]==='function')?null:a.pop(),c=a.pop(),d=JS.isType(a[a.length-1],'string')?a.pop():'',f=new JS.Enumerable.Collection(a);return[a,f,d,c,b]},assertThrow:function(){var d=this.__processExceptionArgs__(arguments),f=d[0],g=d[1],h=d[2],i=d[3],j=d[4];this.__wrapAssertion__(function(){var b=this.buildMessage(h,'<?> exception expected but none was thrown',f),c;this.assertBlock(b,function(){try{i.call(j)}catch(e){c=e;return true}return false});b=this.buildMessage(h,'<?> exception expected but was\n?',f,c);this.assertBlock(b,function(){return g.any(function(a){return JS.isType(c,a)||(c.name&&c.name===a.name)})})})},assertThrows:function(){return this.assertThrow.apply(this,arguments)},assertNothingThrown:function(){var a=this.__processExceptionArgs__(arguments),b=a[0],c=a[1],d=a[2],f=a[3],g=a[4];this.__wrapAssertion__(function(){try{f.call(g)}catch(e){if((b.length===0&&!JS.isType(e,JS.Test.Unit.AssertionFailedError))||c.any(function(type){return JS.isType(e,type)}))this.assertBlock(this.buildMessage(d,'Exception thrown:\n?',e),function(){return false});else throw e;}})},buildMessage:function(){var a=JS.array(arguments),b=a.shift(),c=a.shift();return new JS.Test.Unit.AssertionMessage(b,c,a)},__wrapAssertion__:function(a){if(this.__assertionWrapped__===undefined)this.__assertionWrapped__=false;if(!this.__assertionWrapped__){this.__assertionWrapped__=true;try{this.addAssertion();return a.call(this)}finally{this.__assertionWrapped__=false}}else{return a.call(this)}},addAssertion:function(){}})});JS.Test.Unit.extend({AssertionMessage:new JS.Class({extend:{Literal:new JS.Class({initialize:function(a){this._1i=a;this.toString=this.inspect},inspect:function(){return this._1i.toString()}}),literal:function(a){return new this.Literal(a)},Template:new JS.Class({extend:{create:function(a){var b=a?a.match(/\(\?\)|(?=[^\\])\?|(?:(?!\(\?\))(?:\\\?|[^\?]))+/g):[];return new this(b)}},initialize:function(b){this._W=new JS.Enumerable.Collection(b);this.count=this._W.findAll(function(a){return a==='?'||a==='(?)'}).length},result:function(b){if(b.length!==this.count)throw'The number of parameters does not match the number of substitutions';var c=JS.array(b);return this._W.collect(function(a){if(a==='(?)')return c.shift().replace(/^\[/,'(').replace(/\]$/,')');if(a==='?')return c.shift();return a.replace(/\\\?/g,'?')}).join('')}})},initialize:function(a,b,c){this._X=a;this._1j=b;this._1k=new JS.Enumerable.Collection(c)},template:function(){return this._1l=this._1l||this.klass.Template.create(this._1j)},toString:function(){var b=[],c,d;if(this._X)b.push(this._X);d=this.template().result(this._1k.collect(function(a){return JS.Console.convert(a)},this));if(d!=='')b.push(d);return b.join('\n')}})});JS.Test.Unit.extend({Failure:new JS.Class({extend:{SINGLE_CHARACTER:'F'},initialize:function(a,b){this._l=a;this._Y=b},singleCharacterDisplay:function(){return this.klass.SINGLE_CHARACTER},shortDisplay:function(){return this._l+': '+this._Y.split('\n')[0]},longDisplay:function(){return'Failure:\n'+this._l+':\n'+this._Y},toString:function(){return this.longDisplay()}})});JS.Test.Unit.extend({Error:new JS.Class({extend:{SINGLE_CHARACTER:'E'},initialize:function(a,b){this._l=a;this._f=b},singleCharacterDisplay:function(){return this.klass.SINGLE_CHARACTER},message:function(){return this._f.name+': '+this._f.message},shortDisplay:function(){return this._l+': '+this.message().split('\n')[0]},longDisplay:function(){var a='Error:\n'+this._l+':\n',b=JS.Console.filterBacktrace(this._f.stack||'');if(b&&JS.Test.showStack)a+=b;else a+=this.message();return a},toString:function(){return this.longDisplay()}})});JS.Test.Unit.extend({TestResult:new JS.Class({include:JS.Test.Unit.Util.Observable,extend:{CHANGED:'CHANGED',FAULT:'FAULT'},initialize:function(){this._Z=this._10=0;this._a=[];this._m=[]},addRun:function(){this._Z+=1;this.notifyListeners(this.klass.CHANGED,this)},addFailure:function(a){this._a.push(a);this.notifyListeners(this.klass.FAULT,a);this.notifyListeners(this.klass.CHANGED,this)},addError:function(a){this._m.push(a);this.notifyListeners(this.klass.FAULT,a);this.notifyListeners(this.klass.CHANGED,this)},addAssertion:function(){this._10+=1;this.notifyListeners(this.klass.CHANGED,this)},toString:function(){return this.runCount()+' tests, '+this.assertionCount()+' assertions, '+this.failureCount()+' failures, '+this.errorCount()+' errors'},passed:function(){return this._a.length===0&&this._m.length===0},runCount:function(){return this._Z},assertionCount:function(){return this._10},failureCount:function(){return this._a.length},errorCount:function(){return this._m.length}})});JS.Test.Unit.extend({TestSuite:new JS.Class({include:JS.Enumerable,extend:{STARTED:'Test.Unit.TestSuite.STARTED',FINISHED:'Test.Unit.TestSuite.FINISHED',forEach:function(b,c,d,f){var g=false,h=false,i=b.length,j=-1,k=new Date().getTime(),m=this.setTimeout;var l=function(){h=true;var a=new Date().getTime();if(JS.Console.BROWSER&&(a-k)>1000){k=a;g=false;m(n,0)}else if(!g){g=true;while(g)n()}};var n=function(){j+=1;if(j===i){g=false;return d&&d.call(f||null)}h=false;c.call(f||null,b[j],l);if(!h)g=false};l()},setTimeout:(function(){return(typeof setTimeout==='undefined')?undefined:setTimeout})()},initialize:function(a){this._b=a||'Unnamed TestSuite';this._3=[]},forEach:function(a,b,c){this.klass.forEach(this._3,a,b,c)},run:function(c,d,f,g){f.call(g||null,this.klass.STARTED,this._b);this.forEach(function(a,b){a.run(c,b,f,g)},function(){f.call(g||null,this.klass.FINISHED,this._b);d.call(g||null)},this)},push:function(a){this._3.push(a);return this},remove:function(a){var b=this._3.length;while(b--){if(this._3[b]===a)this._3.splice(b,1)}},size:function(){var a=0,b=this._3.length;while(b--){a+=this._3[b].size()}return a},empty:function(){return this._3.length===0},toString:function(){return this._b}})});JS.Test.Unit.extend({TestCase:new JS.Class({include:JS.Test.Unit.Assertions,extend:[JS.Enumerable,{testCases:[],reports:[],handlers:[],clear:function(){this.testCases=[]},inherited:function(a){this.testCases.push(a)},forEach:function(a,b){for(var c=0,d=this.testCases.length;c<d;c++)a.call(b||null,this.testCases[c])},STARTED:'Test.Unit.TestCase.STARTED',FINISHED:'Test.Unit.TestCase.FINISHED',suite:function(b,c,d){var f=new JS.Enumerable.Collection(this.instanceMethods(c)),g=f.select(function(a){return this.filter(a,b)},this).sort(),h=new JS.Test.Unit.TestSuite(this.displayName);for(var i=0,j=g.length;i<j;i++){try{h.push(new this(g[i]))}catch(e){}}if(h.empty()&&d){try{h.push(new this('defaultTest'))}catch(e){}}return h},filter:function(a,b){if(!/^test./.test(a))return false;if(!b||b.length===0)return true;var c=b.length;while(c--){if(a.substr(6,b[c].length)===b[c])return true}return false}}],initialize:function(a){if(typeof this[a]!=='function')throw'invalid_test';this._1=a;this._C=true},run:function(a,b,c,d){c.call(d||null,this.klass.STARTED,this);this._2=a;var f=function(){this.exec('teardown',function(){this.exec(function(){JS.Test.Unit.mocking.verify()},function(){a.addRun();c.call(d||null,this.klass.FINISHED,this);b()})})};this.exec('setup',function(){this.exec(this._1,f)},f)},exec:function(b,c,d){if(!b)return c.call(this);if(!d)d=c;var f=(typeof b==='function')?b.length:this.__eigen__().instanceMethod(b).arity,g=(typeof b==='function')?b:this[b],h=null,i=false,j=false,k=this;if(f===0)return this._11(function(){g.call(this);c.call(this)},this._12(d));var m=function(a){k.exec(function(){i=true;this._p();if(h)JS.ENV.clearTimeout(h);throw a;},c,d)};this._13(m);this._11(function(){g.call(this,function(a){j=true;k._p();if(h)JS.ENV.clearTimeout(h);if(!i)k.exec(a,c,d)})},this._12(d));if(!j&&JS.ENV.setTimeout)h=JS.ENV.setTimeout(function(){k.exec(function(){i=true;this._p();throw new Error('Timed out after waiting '+JS.Test.asyncTimeout+' seconds for test to resume');},c,d)},JS.Test.asyncTimeout*1000)},_13:function(a,b){if(!a)return;this._p(false);if(JS.Console.NODE)process.addListener('uncaughtException',a);else if(JS.Console.BROWSER)window.onerror=a;if(b!==false)this.klass.handlers.push(a);return a},_p:function(a){var b=this.klass.handlers,c=b[b.length-1];if(!c)return;if(JS.Console.NODE)process.removeListener('uncaughtException',c);else if(JS.Console.BROWSER)window.onerror=null;if(a!==false){b.pop();this._13(b[b.length-1],false)}},_12:function(b){return function(a){if(JS.isType(a,JS.Test.Unit.AssertionFailedError))this.addFailure(a.message);else this.addError(a);if(b)b.call(this)}},_11:function(a,b,c){try{a.call(this)}catch(e){if(b)b.call(this,e)}finally{if(c)c.call(this)}},setup:function(a){a()},teardown:function(a){a()},defaultTest:function(){return this.flunk('No tests were specified')},passed:function(){return this._C},size:function(){return 1},addAssertion:function(){this._2.addAssertion()},addFailure:function(a){this._C=false;this._2.addFailure(new JS.Test.Unit.Failure(this.name(),a))},addError:function(a){this._C=false;this._2.addError(new JS.Test.Unit.Error(this.name(),a))},name:function(){var a=this._1.replace(/^test\W*/ig,'');if(a.replace(this.klass.displayName,'')===a)return this._1+'('+this.klass.displayName+')';else return a},toString:function(){return this.name()}})});JS.Test.Unit.extend({UI:new JS.Module({extend:{SILENT:1,PROGRESS_ONLY:2,NORMAL:3,VERBOSE:4,TestRunnerUtilities:new JS.Module({run:function(a,b){return new this(a,b||JS.Test.Unit.UI.NORMAL).start()},getFilter:function(){if(JS.ENV.location&&/\btest=/.test(location.search)){var a=[],b=location.search.match(/\btest=([^&]+)/)[1].split(','),c=b.length;while(c--)a.push(decodeURIComponent(b[c]));return a}else if(typeof process==='object'){return process.argv.slice(2)}else return[]}})}})});JS.Test.Unit.UI.extend({TestRunnerMediator:new JS.Class({extend:{RESET:'Test.Unit.UI.TestRunnerMediator.RESET',STARTED:'Test.Unit.UI.TestRunnerMediator.STARTED',FINISHED:'Test.Unit.UI.TestRunnerMediator.FINISHED'},include:JS.Test.Unit.Util.Observable,initialize:function(a){this._5=a},runSuite:function(){var g=new Date().getTime();this.notifyListeners(this.klass.RESET,this._5.size());var h=this.createResult();this.notifyListeners(this.klass.STARTED,h);var i=JS.bind(function(){h.removeListener(JS.Test.Unit.TestResult.FAULT,k);h.removeListener(JS.Test.Unit.TestResult.CHANGED,j);var a=new Date().getTime(),b=(a-g)/1000,c=true;var d=JS.Test.Unit.TestCase.reports,f=d.length;while(f--){JS.Console.output('');c=c&&d[f].report()}JS.Test.Unit.TestCase.reports=[];this.notifyListeners(this.klass.FINISHED,b,c)},this);var j=h.addListener(JS.Test.Unit.TestResult.CHANGED,function(a){this.notifyListeners(JS.Test.Unit.TestResult.CHANGED,a)},this);var k=h.addListener(JS.Test.Unit.TestResult.FAULT,function(a){this.notifyListeners(JS.Test.Unit.TestResult.FAULT,a)},this);this._5.run(h,i,function(a,b){this.notifyListeners(a,b)},this)},createResult:function(){return new JS.Test.Unit.TestResult()}})});JS.Test.Unit.UI.extend({Console:new JS.Module({extend:{TestRunner:new JS.Class({extend:JS.Test.Unit.UI.TestRunnerUtilities,include:JS.Console,initialize:function(a,b){this._5=(typeof a.suite==='function')?a.suite():a;this._1m=b||JS.Test.Unit.UI.NORMAL;this._D=false;this._n=[]},start:function(){this._E();this._F();return this._G()},_E:function(){this._0=this._H(this._5);var a=this._5.toString();if(JS.isType(this._5,JS.Module))a=this._5.displayName;this.consoleFormat('bold');this._c('Loaded suite '+a)},_H:function(a){return new JS.Test.Unit.UI.TestRunnerMediator(a)},_F:function(){this._0.addListener(JS.Test.Unit.TestResult.FAULT,this.method('_I'));this._0.addListener(JS.Test.Unit.UI.TestRunnerMediator.STARTED,this.method('_J'));this._0.addListener(JS.Test.Unit.UI.TestRunnerMediator.FINISHED,this.method('_K'));this._0.addListener(JS.Test.Unit.TestCase.STARTED,this.method('_L'));this._0.addListener(JS.Test.Unit.TestCase.FINISHED,this.method('_M'))},_G:function(){return this._0.runSuite()},_I:function(a){this._n.push(a);this.consoleFormat('bold','red');this._N(a.singleCharacterDisplay(),JS.Test.Unit.UI.PROGRESS_ONLY);this.reset();this._D=true},_J:function(a){this._2=a;this._q();this.reset();this._c('Started')},_K:function(a,b){for(var c=0,d=this._n.length;c<d;c++){var f=this._n[c].longDisplay(),g=f.split('\n'),h=g.shift(),i=g.shift(),j;this.consoleFormat('bold','red');this._q();this._c('\n'+(c+1)+') '+h);this._c(i);this.reset();while(j=g.shift())this.puts(j)}this.reset();this._q();this._c('Finished in '+a+' seconds');var k=(b&&this._2.passed()),m=k?'green':'red';this.consoleFormat(m);this._c(this._2,JS.Test.Unit.UI.PROGRESS_ONLY);this.reset();this.puts('');var l=k?0:1;if(typeof WScript!=='undefined')WScript.Quit(l);if(typeof process==='object')process.exit(l);if(typeof system==='object'&&system.exit)system.exit(l);if(typeof quit=='function')quit(l)},_L:function(a){this._N(a.name()+': ',JS.Test.Unit.UI.VERBOSE)},_M:function(a){this.consoleFormat('green');if(!this._D)this._N('.',JS.Test.Unit.UI.PROGRESS_ONLY);this.reset();this._q(JS.Test.Unit.UI.VERBOSE);this._D=false},_q:function(a){this._c('',a||JS.Test.Unit.UI.NORMAL)},_c:function(a,b){if(!this._14(b||JS.Test.Unit.UI.NORMAL))return;this.puts(a)},_N:function(a,b){if(!this._14(b||JS.Test.Unit.UI.NORMAL))return;this.print(a)},_14:function(a){return a<=this._1m}})}})});JS.Test.Unit.UI.extend({Browser:new JS.Module({extend:{TestRunner:new JS.Class({extend:JS.Test.Unit.UI.TestRunnerUtilities,initialize:function(a,b){this._5=(typeof a.suite==='function')?a.suite():a;this._n=[];this._6()},_6:function(){return this._1n=this._1n||new this.klass.Display()},start:function(){this._E();this._F();return this._G()},_E:function(){this._0=this._H(this._5)},_H:function(a){return new JS.Test.Unit.UI.TestRunnerMediator(a)},_F:function(){this._0.addListener(JS.Test.Unit.TestResult.CHANGED,this.method('_1o'));this._0.addListener(JS.Test.Unit.TestResult.FAULT,this.method('_I'));this._0.addListener(JS.Test.Unit.UI.TestRunnerMediator.STARTED,this.method('_J'));this._0.addListener(JS.Test.Unit.UI.TestRunnerMediator.FINISHED,this.method('_K'));this._0.addListener(JS.Test.Unit.TestCase.STARTED,this.method('_L'));this._0.addListener(JS.Test.Unit.TestCase.FINISHED,this.method('_M'));if(!window.TestSwarm)return;TestSwarm.serialize=this.method('serialize');this._0.addListener(JS.Test.Unit.TestCase.FINISHED,TestSwarm.heartbeat);this._0.addListener(JS.Test.Unit.UI.TestRunnerMediator.FINISHED,function(){TestSwarm.submit(this._15())},this)},_15:function(){return{fail:this._2.failureCount(),error:this._2.errorCount(),total:this._2.runCount()}},_G:function(){return this._0.runSuite()},_1o:function(){this._6().setTestCount(this._2.runCount());this._6().setAssertionCount(this._2.assertionCount());this._6().setFailureCount(this._2.failureCount());this._6().setErrorCount(this._2.errorCount())},_I:function(a){this._n.push(a);this._16='failed';this._6().addFault(this._1p,a)},_J:function(a){this._2=a},_K:function(a){this._6().printSummary(a);this._17({jstest:this._15()})},_L:function(a){this._1p=a;this._16='passed';this._6().addTestCase(a)},_M:function(a){this._6().finishTestCase(a);this._17({jstest:{test:a.toString(),status:this._16}})},_17:function(a){if(window.console&&window.JSON&&!window.Components)console.log(JSON.stringify(a))},serialize:function(){var a=document.getElementsByTagName('li'),b=a.length;while(b--)JS.DOM.removeClass(a[b],'closed');var a=document.getElementsByTagName('script'),b=a.length;while(b--)a[b].parentNode.removeChild(a[b]);var c=document.getElementsByTagName('html')[0];return'<!DOCTYPE html>0});JS.Console.printTable(c,function(a,b){if(a[1]===0)return['bgred','white'];return(b%2===0)?['bold']:[]});return d}})});JS.Test.extend({Helpers:new JS.Module({$R:function(a,b){return new JS.Range(a,b)},$w:function(a){return a.split(/\s+/)},forEach:function(a,b,c){for(var d=0,f=a.length;d<f;d++){b.call(c||null,a[d],d)}},its:function(){return new JS.MethodChain()},map:function(a,b,c){return new JS.Enumerable.Collection(a).map(b,c)},repeat:function(a,b,c){while(a--)b.call(c)}})});
//@ sourceMappingURL=test.js.map