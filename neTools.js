/*
 * neTools
 */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        // es6 module , typescript
        var mo = factory();
        mo.__esModule = true;
        mo['default'] = mo;
        module.exports = mo;
    } else {
        // browser
        root.neTools = factory();
    }
}(this, function () {
	var root = this;
	var previousMTools = root.neTools;
	/*
	 * 基础通用方法
	 */
	var base = {
		/*tpye*/
		isArray: function (arr){
			return (Array && Array.isArray) ? Array.isArray(arr) : Object.prototype.toString.call(arr) === '[object Array]';
		},
		isFunction: function (fn){
			return Object.prototype.toString.call(fn) === '[Object Function]';
			//return (fn && typeof fn === "function") || false;
		},
		isObject: function (obj){
			var type = typeof obj;
    		return type === 'function' || type === 'object' && !!obj;
		},
		/**
		 * Object
		 */
		hasKey: function(obj, key){
			return obj !== null && hasOwnProperty.call(obj, key);
		},
		getKeys: function (obj){
			if(!base.isObject(obj)){return [];}
			var keys = [];
			for (var key in obj){
				if(base.hasKey(obj, key)){
					keys.push(key);
				}
			}
			return keys;
		},
		getSize: function(obj){
			if (obj === null) return 0;
			if(this.isArray(obj)){
				return obj.length;
			}else if(base.isObject){
				return base.getKeys(obj).length;
			}else{
				return 0;
			}
		},
		getValues: function (obj){
			if(!base.isObject(obj)){return [];}
			var values = [];
			for (var key in obj){
				if(base.hasKey(obj, key)){
					values.push(obj[key]);
				}
			}
			return values;
		},
		isEmpty: function (obj){
			if (obj === null) return true;
			if (base.isArray(obj)){
				return obj.length === 0;
			}else if(base.isObject(obj)){
				return base.getKeys(obj).length === 0;
			}else{
				return false;
			}
		},
		merge: function(root){
			for(var i = 1; i < arguments.length; i++){
				for(var key in arguments[i]){
					root[key] = arguments[i][key];
				}
			}
			return root;
		},
		/* array*/
		maxInArray: function(arr){
			return Math.max.apply(Math, arr);
		},
		minInArray: function(arr){
			return Math.min.apply(Math, arr);
		},
		/*function*/
		overload: function(object, name, fn){
			var old = object[name];
			object[name] = function(){
				if(fn.length == arguments.length){
					return fn.apply(this, arguments);
				}else if(typeof old == 'function'){
					return old.apply(this, arguments);
				}
			};
		},
		/*type Change*/
		toInt: function(value){
			// return ~~(value);
			return (value) | 0;
		},
		toBool: function(value){
			return !!(value);
		},
		each: function (obj, fn){
			var len = obj.length,i = 0;

			if(base.isArray(obj)){
				//如果是数组
				for(; i<len; i++){
			       	if ( false === fn.call(obj[i], obj[i], i) ){break;}
			    }
			}else{
				//如果是对象
			    for( i in obj ){
			    	if(base.hasKey(obj, i)){
			    		if(false === fn.call(obj[i],i+1,obj[i])){break;}
			    	}
			    }
			}
		},
		objParmasCheck: function(str, context){
			var pointIndex = str.indexOf('.');
			if(!context){context = window;}

			if(pointIndex == -1 && !(!context[str])){
				return true;
			}else{
				var paramsLeft = context[str.slice(0, pointIndex)];
				var strRight = str.substr(pointIndex + 1, str.length - pointIndex - 1);
				return !(!paramsLeft) && base.objParmasCheck(strRight, paramsLeft);
			}
		},
		noConflict: function(){
			root.neTools = previousMTools;
			return this;
		}

	};


	/*
	 * 正则相关方法
	 */
	var regCheck = {
		regMap: {
			Idcard: [
				/^\s*\d{15}\s*$/, 
				/^\s*\d{16}[\dxX]{2}\s*$/
			],
			name: [ 
				/^\s*[\u4e00-\u9fa5]{1,}[\u4e00-\u9fa5.·]{0,15}[\u4e00-\u9fa5]{1,}\s*$/ 
			],
			mobilePhone: [
				/^[1][0-9]{10}$/
			],
			number: [
				/^[0-9]*$/
			]
		},
		regFuns: {},
		isType: function(type){
			return base.hasKey(regCheck.regFuns, type) ? 
				regCheck.regFuns[type] : 
				regCheck.regFuns[type] = (function (type){
					return base.hasKey(regCheck.regMap, type) ?
						function (str){
							var res = false;
							var patrns = regCheck.regMap[type];
							base.each(patrns, function (v_p, i_p){
								if(v_p.exec(str)){
									res = true;
									return false;
								}
							});
							return res;
						} : 
						function(){
							return false;
						};
				})(type);
		},
		isIdcard: function(strId){
         	return regCheck.isType('Idcard')(strId);
        },
        isName: function(strName){
            return regCheck.isType('name')(strName.split('·').join(''));
        },
        isMobilePhone: function(strPhone){
            return regCheck.isType('mobilePhone')(strPhone);
        },
        isNumber: function(strNumber){
        	var patrn = /^[0-9]*$/;
        	if(!patrn.exec(strNumber)){return false;}
        	return true;
        },
        removeUint: function(str, unit){
        	if(unit){
        		return str.replace(unit, '') || str;
        	}else{
        		return str.replace(/[^0-9.]/gi, '') || str;
        	}
        }
	};


	/*
	 * 浏览器相关方法
	 */
	var browser = {
		browsers: {},
		isBrowser: function(browserUAName){
			return base.hasKey(browser.browsers, browserUAName)? 
			browser.browsers[browserUAName] : 
			browser.browsers[browserUAName] = (window.navigator.userAgent.toLowerCase().indexOf(browserUAName) === -1) ? false: true;
		},
		isIos: function(){return browser.isBrowser('iphone');},
		isAndroid: function(){return browser.isBrowser('android');},
		isWeiXin: function(){return browser.isBrowser('micromessenger');},
		isUC: function(){return browser.isBrowser('ucbrowser');},
		isQQ: function(){return browser.isBrowser('mqqbrowser');},
		isSafari: function(){return browser.isBrowser('safari');}
	};

	/*
	 * url
	 */
	var urlParse = {
		createLink: function (url){
			var aUrl = url;
			if(!aUrl || aUrl === ''){
				aUrl = location.href;
			}
			var a = document.createElement('a');
			a.href = aUrl;
			return {
				source: aUrl,
		        protocol: a.protocol.replace(':',''),
		        host: a.hostname,
		        port: a.port,
		        query: a.search,
		        params: (function(){
		            var ret = {},
		                seg = a.search.replace(/^\?/,'').split('&'),
		                len = seg.length, i = 0, s;
		            for (;i<len;i++) {
		                if (!seg[i]) { continue; }
		                s = seg[i].split('=');
		                ret[s[0]] = s[1];
		            }
		            return ret;
		        })(),
		        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
		        hash: a.hash.replace('#',''),
		        path: a.pathname.replace(/^([^\/])/,'/$1'),
		        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
		        segments: a.pathname.replace(/^\//,'').split('/')
			};
		}

	};

	/*
	 * cookie
	 */
	var cookie = {
		setCookie: function (key, value, expiredays){
			var exdate=new Date();
			exdate.setDate(exdate.getDate()+expiredays);
			document.cookie=key+ "=" +escape(value)+((expiredays === null) ? "" : ";expires="+exdate.toGMTString());
		},
		getCookie: function(key){
			if (document.cookie.length > 0) {
			    c_start = document.cookie.indexOf(key + "=");
			    if (c_start != -1) {
			        c_start = c_start + key.length + 1;
			        c_end = document.cookie.indexOf(";", c_start);
			        if (c_end == -1) c_end = document.cookie.length;
			        return unescape(document.cookie.substring(c_start, c_end));
			    }
			}
			return "";
		}
	};

	/*
	 * load
	 */
	var loader = {
		imgLoader: function(imgs, cb){
			setTimeout(function(){
				var imgsLen = imgs.length;
				var count = 0;
				base.each(imgs, function (v_img, i_img){
					(function (v_img, i_img){
						var imgItem = document.createElement("img");
						imgItem.setAttribute("style", "display:none;");
						imgItem.setAttribute("src", v_img);
						var imgD = document.body.appendChild(imgItem);
						imgD.onload = function(){
							count += 1;
							if(base.isFunction(cb)){
								cb({
									"count": count,
									"length": imgsLen,
									"img": v_img
								});
							}
							imgD.parentNode.removeChild(imgD); 
						};
					})(v_img, i_img);
				});
			}, 1);

		},
		loadJS: function(src, callback){
		    var script = document.createElement('script');
		    var head = document.getElementsByTagName('head')[0];
		    var loaded;
		    script.src = src;
		    if(typeof callback === 'function'){
		        script.onload = script.onreadystatechange = function(){
		            if(!loaded && (!script.readyState || /loaded|complete/.test(script.readyState))){
		                script.onload = script.onreadystatechange = null;
		                loaded = true;
		                callback();
		            }
		        }
		    }
		    head.appendChild(script);
		}
	};

	/**
	 * template
	 *
	 *
	 *
	 */
	var template =function () {
		    /**
		     * 模板 + 数据 =》 渲染后的字符串
		     *
		     * @param {string} content 模板
		     * @param {any} data 数据
		     * @returns 渲染后的字符串
		     */
		    function render(content, data) {
		        data = data || {};
		        var list = ['var tpl = "";'];
		        var codeArr = transform(content);  // 代码分割项数组

		        for (var i = 0, len = codeArr.length; i < len; i++) {
		            var item = codeArr[i]; // 当前分割项

		            if (item.type == 1) {  // js逻辑
		                list.push(item.txt);
		            }
		            else if (item.type == 2) {  // js占位
		                var txt = 'tpl+=' + item.txt + ';';
		                list.push(txt);
		            }
		            else {  //文本
		                var txt = 'tpl+="' +
		                    item.txt.replace(/"/g, '\\"') +
		                    '";';
		                list.push(txt);
		            }
		        }
		        list.push('return tpl;');

		        return new Function('data', list.join('\n'))(data);
		    }

		    /**
		     * 从原始模板中提取 文本/js 部分
		     *
		     * @param {string} content
		     * @returns {Array<{type:number,txt:string}>}
		     */
		    function transform(content) {
		        var arr = [];                 //返回的数组，用于保存匹配结果
		        var reg = /<%([\s\S]*?)%>/g;  //用于匹配js代码的正则
		        var match;   				  //当前匹配到的match
		        var nowIndex = 0;			  //当前匹配到的索引

		        while (match = reg.exec(content)) {
		            // 保存当前匹配项之前的普通文本/占位
		            appendTxt(arr, content.substring(nowIndex, match.index));
		            //保存当前匹配项
		            var item = {
		                type: 1,      // 类型  1- js逻辑 2- js 占位 null- 文本
		                txt: match[1] // 内容
		            };
		            if (match[1].substr(0,1) == '=') {  // 如果是js占位
		                item.type = 2;
		                item.txt = item.txt.substr(1);
		            }
		            arr.push(item);
		            //更新当前匹配索引
		            nowIndex = match.index + match[0].length;
		        }
		        //保存文本尾部
		        appendTxt(arr, content.substr(nowIndex));
		        return arr;
		    }

		    /**
		     * 普通文本添加到数组，对换行部分进行转义
		     *
		     * @param {Array<{type:number,txt:string}>} list
		     * @param {string} content
		     */
		    function appendTxt(list, content) {
		        content = content.replace(/\r?\n/g, "\\n");
		        list.push({ txt: content });
		    }
		    return render;
		}

	//埋点脚本
	 var CA = {
        hasInit:0,
        arrImg:[],
        maxLength:4,
        taskQueue:[],
        serverGifUrl:"", //gifsever 如 https://locahost/ca.gif
        init:function(gifUrl){
            var me=this;
            
            me.serverGifUrl=gifUrl;
            if(me.hasInit || $("body").size()==0) return;
            $("body").bind("mousedown",function(e) {
                var o = $(e.target);
                while (o.length > 0) {
                    if (o[0] == $("body")[0]) break;
                    try {
                        var name = o.attr("data-ca");
                        if (name) {
                            me.log([e.pageX,e.pageY],"click",name);
                            return true;
                        }
                    } catch(err) {}
                    o = o.parent();
                }
            });
            $("a").bind("mousedown",function(e){
                var o = $(e.target);
                var posi=[e.pageX,e.pageY];
                me.log(posi,"click",o.attr("href"));
            });

            $(window).bind("load",function(e){
                me.q("in");
            });

            $(window).bind("unload",function(e){
                me.q("out");
            });
            me.hasInit=1;
        },
        q:function(name){
            if(typeof(name)=="undefined" || name=="") return;
            var me=this,arr = [],ref,url=me.serverGifUrl+"?";
            ref = document.referrer?encodeURIComponent(document.referrer):"";
            arr.push('t='+ (new Date()).getTime());
            arr.push('r='+ref);
            arr.push('operate='+ name);
            arr.push('pageUrl='+ encodeURIComponent(window.location.href));
            me.send(url+ arr.join('&'));
        },
        log : function(posi, operate, buttom,details, serverGifUrl){
            var me=this,p, v, detailData = [], logUrl = me.serverGifUrl;
            if(details != null){
                for(p in details){
                    if(details.hasOwnProperty(p)){
                        v = details[p];
                        detailData.push(
                            ('"' + p + '":')
                            + (typeof v === "string" ? '"' + v + '"' : v)
                        );
                    }
                }
            }
            
            
            me.send(
                logUrl
                + "?t=" + (new Date().getTime())
                + "&position="  + encodeURIComponent(posi)
                + "&operate=" + encodeURIComponent(operate)
                + "&buttom=" + encodeURIComponent(buttom)
                + '&pageUrl='+ encodeURIComponent(window.location.href)
                + "&details="   + encodeURIComponent(detailData.join(','))
            );
        },

        send:function(url){
            if(typeof(url)=="undefined" || url=="") return;
            var me=this,img,imgHandler,arrImg,len=0,index=-1;
            arrImg=me.arrImg;
            len=arrImg.length;
            for(var i=0;i<len;i++){
                if(arrImg[i].f==0){
                    index=i;
                    break;
                }
            }
            if(index==-1){
                if(len==me.maxLength){
                    me.taskQueue.push(url);
                    return ;
                }
                img=$(new Image());
                arrImg.push({f:1,img:img});
                index=(len==0?0:len);
            }else{
                img=arrImg[index].img;
            }
            arrImg[index].f=1;
            img.data("vid",index);
            imgHandler = function(){
                var vid=$(this).data("vid");
                if(vid>=0){
                    arrImg[vid].f=0;
                }

                if(me.taskQueue.length>0){
                    me.send(me.taskQueue.shift());
                }
            };
            img.unbind().load(imgHandler).error(imgHandler);
            $(img).attr("src",url);
        }
	}
	/**
	 * 比较经典的Generator Function
	 * @param {*} ms 
	 */
	function delay(ms) {
		return new Promise((resolve, reject) => {
			setTimeout(resolve, ms);
		});
	}
	function* baum() {
		yield delay(300).then(() => console.log(1))
		yield console.log(2)
		yield delay(300).then(() => console.log(3))
		yield console.log(4)
	}
	function co(gen) {
		const item = gen.next()
		if (item.done) {
			return item.value
		}

		const { value, done } = item
		if (value instanceof Promise) {
			value.then((e) => co(gen))
		} else {
			co(gen)
		}
	}

//co(baum())

	/****************************************************************
	 * public
	 */
	var neTools = {
		/*base*/
		toBool: base.toBool,
		toInt: base.toInt,
		isArray: base.isArray,
		isFunction: base.isFunction,
		isObject: base.isObject,
		isEmpty: base.isEmpty,
		hasKey: base.hasKey,
		getKeys: base.getKeys,
		objParmasCheck: base.objParmasCheck,
		each: base.each,
		/*reg*/
		isIdcard: regCheck.isIdcard,
		isName: regCheck.isName,
		isMobile: regCheck.isMobilePhone,
		isNumber: regCheck.isNumber,
		removeUint: regCheck.removeUint,
		/*browser*/
		isQQ: browser.isQQ,
		isIos: browser.isIos,
		isAndroid: browser.isAndroid,
		isSafari: browser.isSafari,
		isUC: browser.isUC,
		isWeiXin: browser.isWeiXin,
		/*cookie*/
		setCookie: cookie.setCookie,
		getCookie: cookie.getCookie,
		/*load*/
		imgLoader: loader.imgLoader,
		jsLoader:loader.loadJS,
		template: template(),
		noConflict: base.noConflict

		/*埋点*/
		ca:CA
	};

	return neTools;
});