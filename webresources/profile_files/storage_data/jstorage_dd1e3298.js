!function(){"use strict";function _init(){var data,localStorageReallyWorks=!1;if("localStorage"in window)try{window.localStorage.setItem("_tmptest","tmpval"),localStorageReallyWorks=!0,window.localStorage.removeItem("_tmptest")}catch(BogusQuotaExceededErrorOnIos5){}if(localStorageReallyWorks)try{window.localStorage&&(_storage_service=window.localStorage,_backend="localStorage",_observer_update=_storage_service.jStorage_update)}catch(E3){}else if("globalStorage"in window)try{window.globalStorage&&(_storage_service="localhost"==window.location.hostname?window.globalStorage["localhost.localdomain"]:window.globalStorage[window.location.hostname],_backend="globalStorage",_observer_update=_storage_service.jStorage_update)}catch(E4){}else{if(_storage_elm=document.createElement("link"),!_storage_elm.addBehavior)return void(_storage_elm=null);_storage_elm.style.behavior="url(#default#userData)",document.getElementsByTagName("head")[0].appendChild(_storage_elm);try{_storage_elm.load("jStorage")}catch(E){_storage_elm.setAttribute("jStorage","{}"),_storage_elm.save("jStorage"),_storage_elm.load("jStorage")}data="{}";try{data=_storage_elm.getAttribute("jStorage")}catch(E5){}try{_observer_update=_storage_elm.getAttribute("jStorage_update")}catch(E6){}_storage_service.jStorage=data,_backend="userDataBehavior"}_load_storage(),_handleTTL(),_setupObserver(),_handlePubSub(),"addEventListener"in window&&window.addEventListener("pageshow",function(event){event.persisted&&_storageObserver()},!1)}function _reloadData(){var data="{}";if("userDataBehavior"==_backend){_storage_elm.load("jStorage");try{data=_storage_elm.getAttribute("jStorage")}catch(E5){}try{_observer_update=_storage_elm.getAttribute("jStorage_update")}catch(E6){}_storage_service.jStorage=data}_load_storage(),_handleTTL(),_handlePubSub()}function _setupObserver(){"localStorage"==_backend||"globalStorage"==_backend?"addEventListener"in window?window.addEventListener("storage",_storageObserver,!1):document.attachEvent("onstorage",_storageObserver):"userDataBehavior"==_backend&&setInterval(_storageObserver,1e3)}function _storageObserver(){var updateTime;clearTimeout(_observer_timeout),_observer_timeout=setTimeout(function(){if("localStorage"==_backend||"globalStorage"==_backend)updateTime=_storage_service.jStorage_update;else if("userDataBehavior"==_backend){_storage_elm.load("jStorage");try{updateTime=_storage_elm.getAttribute("jStorage_update")}catch(E5){}}updateTime&&updateTime!=_observer_update&&(_observer_update=updateTime,_checkUpdatedKeys())},25)}function _checkUpdatedKeys(){var newCrc32List,key,updated,removed,oldCrc32List=JSON.parse(JSON.stringify(_storage.__jstorage_meta.CRC32));_reloadData(),newCrc32List=JSON.parse(JSON.stringify(_storage.__jstorage_meta.CRC32)),updated=[],removed=[];for(key in oldCrc32List)if(oldCrc32List.hasOwnProperty(key)){if(!newCrc32List[key]){removed.push(key);continue}oldCrc32List[key]!=newCrc32List[key]&&"2."==String(oldCrc32List[key]).substr(0,2)&&updated.push(key)}for(key in newCrc32List)newCrc32List.hasOwnProperty(key)&&(oldCrc32List[key]||updated.push(key));_fireObservers(updated,"updated"),_fireObservers(removed,"deleted")}function _fireObservers(keys,action){var i,j,len,jlen,key;if(keys=[].concat(keys||[]),"flushed"==action){keys=[];for(key in _observers)_observers.hasOwnProperty(key)&&keys.push(key);action="deleted"}for(i=0,len=keys.length;i<len;i++){if(_observers[keys[i]])for(j=0,jlen=_observers[keys[i]].length;j<jlen;j++)_observers[keys[i]][j](keys[i],action);if(_observers["*"])for(j=0,jlen=_observers["*"].length;j<jlen;j++)_observers["*"][j](keys[i],action)}}function _publishChange(){var updateTime=(+new Date).toString();if("localStorage"==_backend||"globalStorage"==_backend)try{_storage_service.jStorage_update=updateTime}catch(E8){_backend=!1}else"userDataBehavior"==_backend&&(_storage_elm.setAttribute("jStorage_update",updateTime),_storage_elm.save("jStorage"));_storageObserver()}function _load_storage(){if(_storage_service.jStorage)try{_storage=JSON.parse(String(_storage_service.jStorage))}catch(E6){_storage_service.jStorage="{}"}else _storage_service.jStorage="{}";_storage_size=_storage_service.jStorage?String(_storage_service.jStorage).length:0,_storage.__jstorage_meta||(_storage.__jstorage_meta={}),_storage.__jstorage_meta.CRC32||(_storage.__jstorage_meta.CRC32={})}function _save(){_dropOldEvents();try{_storage_service.jStorage=JSON.stringify(_storage),_storage_elm&&(_storage_elm.setAttribute("jStorage",_storage_service.jStorage),_storage_elm.save("jStorage")),_storage_size=_storage_service.jStorage?String(_storage_service.jStorage).length:0}catch(E7){}}function _checkKey(key){if("string"!=typeof key&&"number"!=typeof key)throw new TypeError("Key name must be string or numeric");if("__jstorage_meta"==key)throw new TypeError("Reserved key name");return!0}function _handleTTL(){var curtime,i,TTL,CRC32,nextExpire=1/0,changed=!1,deleted=[];if(clearTimeout(_ttl_timeout),_storage.__jstorage_meta&&"object"==typeof _storage.__jstorage_meta.TTL){curtime=+new Date,TTL=_storage.__jstorage_meta.TTL,CRC32=_storage.__jstorage_meta.CRC32;for(i in TTL)TTL.hasOwnProperty(i)&&(TTL[i]<=curtime?(delete TTL[i],delete CRC32[i],delete _storage[i],changed=!0,deleted.push(i)):TTL[i]<nextExpire&&(nextExpire=TTL[i]));nextExpire!=1/0&&(_ttl_timeout=setTimeout(_handleTTL,Math.min(nextExpire-curtime,2147483647))),changed&&(_save(),_publishChange(),_fireObservers(deleted,"deleted"))}}function _handlePubSub(){var i,len,pubelm,_pubsubCurrent,needFired;if(_storage.__jstorage_meta.PubSub){for(_pubsubCurrent=_pubsub_last,needFired=[],i=len=_storage.__jstorage_meta.PubSub.length-1;i>=0;i--)pubelm=_storage.__jstorage_meta.PubSub[i],pubelm[0]>_pubsub_last&&(_pubsubCurrent=pubelm[0],needFired.unshift(pubelm));for(i=needFired.length-1;i>=0;i--)_fireSubscribers(needFired[i][1],needFired[i][2]);_pubsub_last=_pubsubCurrent}}function _fireSubscribers(channel,payload){if(_pubsub_observers[channel])for(var i=0,len=_pubsub_observers[channel].length;i<len;i++)_pubsub_observers[channel][i](channel,JSON.parse(JSON.stringify(payload)))}function _dropOldEvents(){var retire,i,len;if(_storage.__jstorage_meta.PubSub){for(retire=+new Date-2e3,i=0,len=_storage.__jstorage_meta.PubSub.length;i<len;i++)if(_storage.__jstorage_meta.PubSub[i][0]<=retire){_storage.__jstorage_meta.PubSub.splice(i,_storage.__jstorage_meta.PubSub.length-i);break}_storage.__jstorage_meta.PubSub.length||delete _storage.__jstorage_meta.PubSub}}function _publish(channel,payload){_storage.__jstorage_meta||(_storage.__jstorage_meta={}),_storage.__jstorage_meta.PubSub||(_storage.__jstorage_meta.PubSub=[]),_storage.__jstorage_meta.PubSub.unshift([+new Date,channel,payload]),_save(),_publishChange()}function murmurhash2_32_gc(str,seed){for(var l=str.length,h=seed^l,i=0,k;l>=4;)k=255&str.charCodeAt(i)|(255&str.charCodeAt(++i))<<8|(255&str.charCodeAt(++i))<<16|(255&str.charCodeAt(++i))<<24,k=1540483477*(65535&k)+((1540483477*(k>>>16)&65535)<<16),k^=k>>>24,k=1540483477*(65535&k)+((1540483477*(k>>>16)&65535)<<16),h=1540483477*(65535&h)+((1540483477*(h>>>16)&65535)<<16)^k,l-=4,++i;switch(l){case 3:h^=(255&str.charCodeAt(i+2))<<16;case 2:h^=(255&str.charCodeAt(i+1))<<8;case 1:h^=255&str.charCodeAt(i),h=1540483477*(65535&h)+((1540483477*(h>>>16)&65535)<<16)}return h^=h>>>13,h=1540483477*(65535&h)+((1540483477*(h>>>16)&65535)<<16),h^=h>>>15,h>>>0}var _storage,_storage_service,_storage_elm,_storage_size,_backend,_observers,_observer_timeout,_observer_update,_pubsub_observers,_pubsub_last,_ttl_timeout,_XMLService,JSTORAGE_VERSION="0.4.12",$=window.jQuery||window.$||(window.$={}),JSON={parse:window.JSON&&(window.JSON.parse||window.JSON.decode)||String.prototype.evalJSON&&function(str){return String(str).evalJSON()}||$.parseJSON||$.evalJSON,stringify:Object.toJSON||window.JSON&&(window.JSON.stringify||window.JSON.encode)||$.toJSON};if("function"!=typeof JSON.parse||"function"!=typeof JSON.stringify)throw new Error("No JSON support found, include //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js to page");_storage={__jstorage_meta:{CRC32:{}}},_storage_service={jStorage:"{}"},_storage_elm=null,_storage_size=0,_backend=!1,_observers={},_observer_timeout=!1,_observer_update=0,_pubsub_observers={},_pubsub_last=+new Date,_XMLService={isXML:function(elm){var documentElement=(elm?elm.ownerDocument||elm:0).documentElement;return!!documentElement&&"HTML"!==documentElement.nodeName},encode:function(xmlNode){if(!this.isXML(xmlNode))return!1;try{return(new XMLSerializer).serializeToString(xmlNode)}catch(E1){try{return xmlNode.xml}catch(E2){}}return!1},decode:function(xmlString){var dom_parser="DOMParser"in window&&(new DOMParser).parseFromString||window.ActiveXObject&&function(_xmlString){var xml_doc=new ActiveXObject("Microsoft.XMLDOM");return xml_doc.async="false",xml_doc.loadXML(_xmlString),xml_doc},resultXML;return!!dom_parser&&(resultXML=dom_parser.call("DOMParser"in window&&new DOMParser||window,xmlString,"text/xml"),!!this.isXML(resultXML)&&resultXML)}},$.jStorage={version:JSTORAGE_VERSION,set:function(key,value,options){if(_checkKey(key),options=options||{},"undefined"==typeof value)return this.deleteKey(key),value;if(_XMLService.isXML(value))value={_is_xml:!0,xml:_XMLService.encode(value)};else{if("function"==typeof value)return;value&&"object"==typeof value&&(value=JSON.parse(JSON.stringify(value)))}return _storage[key]=value,_storage.__jstorage_meta.CRC32[key]="2."+murmurhash2_32_gc(JSON.stringify(value),2538058380),this.setTTL(key,options.TTL||0),_fireObservers(key,"updated"),value},get:function(key,def){return _checkKey(key),key in _storage?_storage[key]&&"object"==typeof _storage[key]&&_storage[key]._is_xml?_XMLService.decode(_storage[key].xml):_storage[key]:"undefined"==typeof def?null:def},deleteKey:function(key){return _checkKey(key),key in _storage&&(delete _storage[key],"object"==typeof _storage.__jstorage_meta.TTL&&key in _storage.__jstorage_meta.TTL&&delete _storage.__jstorage_meta.TTL[key],delete _storage.__jstorage_meta.CRC32[key],_save(),_publishChange(),_fireObservers(key,"deleted"),!0)},setTTL:function(key,ttl){var curtime=+new Date;return _checkKey(key),ttl=Number(ttl)||0,key in _storage&&(_storage.__jstorage_meta.TTL||(_storage.__jstorage_meta.TTL={}),ttl>0?_storage.__jstorage_meta.TTL[key]=curtime+ttl:delete _storage.__jstorage_meta.TTL[key],_save(),_handleTTL(),_publishChange(),!0)},getTTL:function(key){var curtime=+new Date,ttl;return _checkKey(key),key in _storage&&_storage.__jstorage_meta.TTL&&_storage.__jstorage_meta.TTL[key]?(ttl=_storage.__jstorage_meta.TTL[key]-curtime,ttl||0):0},flush:function(){return _storage={__jstorage_meta:{CRC32:{}}},_save(),_publishChange(),_fireObservers(null,"flushed"),!0},storageObj:function(){function F(){}return F.prototype=_storage,new F},index:function(){var index=[],i;for(i in _storage)_storage.hasOwnProperty(i)&&"__jstorage_meta"!=i&&index.push(i);return index},storageSize:function(){return _storage_size},currentBackend:function(){return _backend},storageAvailable:function(){return!!_backend},listenKeyChange:function(key,callback){_checkKey(key),_observers[key]||(_observers[key]=[]),_observers[key].push(callback)},stopListening:function(key,callback){if(_checkKey(key),_observers[key]){if(!callback)return void delete _observers[key];for(var i=_observers[key].length-1;i>=0;i--)_observers[key][i]==callback&&_observers[key].splice(i,1)}},subscribe:function(channel,callback){if(channel=(channel||"").toString(),!channel)throw new TypeError("Channel not defined");return _pubsub_observers[channel]||(_pubsub_observers[channel]=[]),_pubsub_observers[channel].push(callback),function(){var index=_pubsub_observers[channel].indexOf(callback);index>=0&&_pubsub_observers[channel].splice(index,1)}},publish:function(channel,payload){if(channel=(channel||"").toString(),!channel)throw new TypeError("Channel not defined");_publish(channel,payload)},reInit:function(){_reloadData()},noConflict:function(saveInGlobal){return delete window.$.jStorage,saveInGlobal&&(window.jStorage=this),this}},_init()}(),function(){function handleRequest(_event){var data,storage,d,source,origin;try{switch(data=JSON.parse(_event.data),storage=$.jStorage,data.op){case"PUBLISH":storage.publish(data.key,data.value),_event.source.postMessage(_event.data,_event.origin);break;case"SET":storage.set(data.key,data.value),_event.source.postMessage(_event.data,_event.origin);break;case"GET":d=storage.get(data.key),_event.source.postMessage(JSON.stringify({id:data.id,key:data.key,value:d,sourcename:"liepinim"}),_event.origin);break;case"SUBSCRIBE":subscribeFunc[data.key]||(subscribeFunc[data.key]=!0,source=_event.source,origin=_event.origin,storage.subscribe(data.key,function(type,args){source.postMessage(JSON.stringify({action:"SUBSCRIBE",key:data.key,value:args,sourcename:"liepinim"}),origin)})),_event.source.postMessage(_event.data,_event.origin)}}catch(e){}}var subscribeFunc={};window.addEventListener?window.addEventListener("message",handleRequest,!1):window.attachEvent&&window.attachEvent("onmessage",handleRequest)}();