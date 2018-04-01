"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}function prepPage(e,t,n,o){const s={},r=["meta","date","path","permalink","attributes","body"];return!1!==t.toc&&r.push("toc"),{create(e={}){const t=new Set(r);e.exclude&&e.exclude.split(",").forEach(e=>{t.has(e)&&t.delete(e)});let n={};return t.forEach(e=>{"attributes"===e?n=_extends$3({},this[e],n):n[e]=this[e]}),n},get meta(){const t=Object.assign({},e);return delete t.filePath,t},get path(){const{permalink:permalink}=this;if(!t.page)return permalink;if(o||!s.path){const e=t.page.match(/([^_][a-zA-z]*?)\/[^a-z_]*/);e&&"index"!==e[1]?s.path=path.join(e[1],permalink).replace(/\\|\/\//,"/"):s.path=permalink.replace(/\\|\/\//,"/")}return s.path},get permalink(){if(o||!s.permalink){const{date:date}=this,{section:section,fileName:fileName}=e,n=getSlug(fileName),{year:year,month:month,day:day}=splitDate(date),o={section:section,slug:n,date:date,year:year,month:month,day:day},r=permalinkCompiler(t.permalink);let i=path.join("/",r(o,{pretty:!0}).replace(/%2F/gi,"/"));i.length>6&&"/index"===i.substr(-6)&&(i=i.substr(0,i.length-6)),s.permalink=i.replace(/\\|\\\\/g,"/")}return s.permalink},get attributes(){return!1!==t.data&&"object"==typeof t.data?_extends$3({},this._rawData.attributes,t.data):this._rawData.attributes},get body(){if(o||!s.body){const{_rawData:_rawData}=this,{dirName:dirName,section:section,fileName:fileName}=e;if(fileName.search(/\.comp\.md$/)>-1){let e="."+path.join(dirName,section,fileName);e=e.replace(/\\/,"/"),s.body={relativePath:e}}else fileName.search(/\.md$/)>-1&&(!1!==t.toc&&(n.config.plugins.toc[1].callback=((e,t)=>parserCallbackForToc(this,e,t))),s.body=n.instance(n.config,this).render(_rawData.body))}return s.body},get date(){if(o||!s.date){const{filePath:filePath,fileName:fileName,section:section}=e;if(t.isPost){const e=fileName.match(/!?(\d{4}-\d{2}-\d{2})/);if(!e)throw Error(`Post in "${section}" does not have a date!`);s.date=e[0]}else{const e=fs.statSync(filePath);s.date=dateFns.format(e.ctime,"YYYY-MM-DD")}}return s.date},get _rawData(){if(o||!s.data){const t=fs.readFileSync(e.filePath).toString();if(e.fileName.search(/\.md$/)>-1){const{attributes:attributes,body:body}=fm(t);s.data={attributes:attributes,body:body}}else e.fileName.search(/\.(yaml|yml)$/)>-1&&(s.data={attributes:{},body:t})}return s.data},set toc(e){if(!1!==t.toc){const{permalink:permalink}=this;if(void 0===s.toc&&(s.toc={}),void 0===s.toc[permalink]&&(s.toc[permalink]={topLevel:1/0,items:{}}),void 0===s.toc[permalink].items[e.slug]){const t={level:parseInt(e.tag.substr(1)),title:e.title,link:"#"+e.slug};t.level<s.toc[permalink].topLevel&&(s.toc[permalink].topLevel=t.level),void 0===s.toc[permalink].items[e.slug]&&(s.toc[permalink].items[e.slug]=t)}}},get toc(){if(!1!==t.toc&&void 0!==s.toc){const{permalink:permalink}=this;return s.toc[permalink]}},tocParserCallback(e,t){let n=!0;void 0!==e.attrs&&Object.keys(e.attrs).forEach(t=>{const o=e.attrs[t][1];const s=e.attrs[t][0];"class"===s&&"notoc"===o&&(n=!1)}),n&&(this.toc={tag:e.tag,slug:t.slug,title:t.title})}}}function createDatabase(e,t,n,o){"number"==typeof n.toc?(void 0===n.markdown&&(n.markdown={plugins:{}}),void 0===n.markdown.plugins&&(n.markdown.plugins={}),n.markdown.plugins.toc=[require("markdown-it-anchor"),{level:n.toc,permalink:!0,permalinkClass:"nuxtent-toc",permalinkSymbol:"🔗"}]):"object"==typeof n.toc&&(n.markdown.plugins.toc=[require("markdown-it-anchor"),n.toc]);const s={config:Object.assign({},{highlight:null,use:[]},n.markdown?n.markdown:{}),instance:markdownParser},r=path.join(e,t),i=globAndApply(r,new Map,({index:index,fileName:fileName,section:section},r)=>{const i=path.join(e,t,section,fileName);const a={index:index,fileName:fileName,section:section,dirName:t,filePath:i};const c=prepPage(a,n,s,o);r.set(c.permalink,c)});if(!0===n.breadcrumbs){const e=n.page.split("/").slice(0,-1).join("/");for(const t of i.values()){const n=t.permalink.substr(e.length+1).split("/"),o=[];for(let t=0;t<n.length;t++){let s=e;for(let e=0;e<t;e++)s+="/"+n[e];s!==e&&o.push({frontMatter:i.get(s).attributes,permalink:s})}if(o.length>0){const e=_extends$2({},i.get(t.permalink).attributes,{breadcrumbs:o}),n=_extends$2({},i.get(t.permalink),{attributes:e});i.set(t.permalink,n)}}}const a=[...i.values()];return{exists(e){return i.has(e)},find(e,t){return i.get(e).create(t)},findOnly(e,t){"string"==typeof e&&(e=e.split(","));const[n,o]=e;let s=max(0,parseInt(n));const r=void 0!==o?min(parseInt(o),a.length-1):null;if(!r)return a[s].create(t);const i=[];if(r)for(;s<=r;)i.push(a[s]),s++;return i.map(e=>e.create(t))},findBetween(e,t){const{findOnly:findOnly}=this,[n,o,s]=e.split(",");if(!i.has(n))return[];const r=i.get(n).create(t),{index:index}=r.meta,c=a.length-1,l=parseInt(o||0),u=void 0!==s?parseInt(s):null;if(0===l&&0===u)return[r];let p;p=0===l?[]:[max(0,index-l),max(min(index-1,c),0)];let d;return d=0===u||!u&&0===l?[]:[min(index+1,c),min(index+(u||l),c)],[r,findOnly(p,t),findOnly(d,t)]},findAll(e){return a.map(t=>t.create(e))}}}function _objectWithoutProperties(e,t){var n={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}function ContentModule(e){const t=nuxtentConfig(this.options.rootDir)||this.options.nuxtent||{},n=mergeContentOptions(t.content,{page:null,permalink:":slug",isPost:!0,data:!1,breadcrumbs:!1,toc:!1,generate:[]}),o=path.join(this.options.srcDir,COMPONENTS_DIR),s=path.join(this.options.srcDir,CONTENT_DIR),r="~/"+CONTENT_DIR,i=process.env.PORT||process.env.npm_package_config_nuxt_port||3e3,a=this.nuxt.options.dev,c=[".vue",".js"],l={contentDir:s,content:n,isDev:a};this.addPlugin({src:path.resolve(__dirname,"plugins/requestContent.js")}),this.addServerMiddleware({path:API_SERVER_PREFIX,handler:createRouter(getAPIOptions(t.api,!1).baseURL,API_SERVER_PREFIX,l)}),this.nuxt.hook("build:before",e=>{console.log("starting build nuxtent");const n=e.isStatic;const o=getAPIOptions(t.api,n);n&&this.nuxt.hook("build:done",e=>{if(n){console.log("opening server connection");const e=express__default();e.use(API_SERVER_PREFIX,createRouter(o.baseURL,API_SERVER_PREFIX,l));const t=e.listen(i);this.nuxt.hook("generate:done",()=>{console.log("closing server connection");t.close()})}});this.requireModule(["@nuxtjs/axios",_extends({},o,{baseURL:o.baseURL+API_SERVER_PREFIX,browserBaseURL:o.browserBaseURL+(n?API_BROWSER_PREFIX:API_SERVER_PREFIX)})]);buildContent(this,BUILD_DIR,n,l)}),this.extendBuild(e=>{e.module.rules.push({test:/\.comp\.md$/,use:["vue-loader",{loader:path.resolve(__dirname,"loader"),options:{componentsDir:o,extensions:c,content:n}}]})}),this.addPlugin({src:path.resolve(__dirname,"plugins/markdownComponents.template.js"),options:{contentDirWebpackAlias:r}})}Object.defineProperty(exports,"__esModule",{value:!0});var path=require("path"),express=require("express"),express__default=_interopDefault(express),querystring=require("querystring"),chalk=_interopDefault(require("chalk")),fs=require("fs"),markdownit=_interopDefault(require("markdown-it")),fm=_interopDefault(require("front-matter")),dateFns=_interopDefault(require("date-fns")),paramCase=_interopDefault(require("param-case")),pathToRegexp=_interopDefault(require("path-to-regexp")),name="nuxtdown",version="2.0.0",description="Support for markdown content in your nuxt.js sit.",main="index.js",contributors=["Joost De Cock (@joostdecock)","Alid Castano (@alidcastano)"],repository={type:"git",url:"git+https://github.com/joostdecock/nuxtdown-module.git"},keywords=["Nuxt.js","Vue.js","Content","Blog","Posts","Collections","Navigation","Markdown","Static"],license="MIT",scripts={"#<git hooks>":"handled by husky",precommit:"lint-staged","#</git hooks>":"handled by husky",lint:'eslint --fix "**/*.js"',pretest:"npm run lint",e2e:"cross-env NODE_ENV=test jest --runInBand --forceExit",test:"npm run e2e",build:"cross-env NODE_ENV=production rollup -c rollup.config.js",watch:"npm run build -- -w",prepare:"npm run build",release:"standard-version && git push --follow-tags && npm publish"},peerDependencies={"@nuxtjs/axios":"^4.5.2"},dependencies={chalk:"^2.3.0","date-fns":"^1.28.5","front-matter":"^2.3.0","js-yaml":"^3.10.0","loader-utils":"^1.1.0","markdown-it":"^8.4.0","markdown-it-anchor":"^4.0.0","param-case":"^2.1.1","path-to-regexp":"^2.0.0",uppercamelcase:"^3.0.0"},devDependencies={"@nuxtjs/axios":"^4.5.2","babel-cli":"^6.26.0","babel-eslint":"^8.2.1","babel-plugin-external-helpers":"^6.22.0","babel-plugin-transform-async-to-generator":"^6.24.1","babel-plugin-transform-object-rest-spread":"^6.26.0","babel-plugin-transform-regenerator":"^6.26.0","babel-plugin-transform-runtime":"^6.23.0","babel-preset-env":"^1.6.1","babel-preset-stage-2":"^6.24.1",chai:"^4.1.2",codecov:"^3.0.0","cross-env":"^5.1.3",eslint:"^4.15.0","eslint-config-i-am-meticulous":"^7.0.1","eslint-config-prettier":"^2.9.0","eslint-config-prettier-standard":"^1.0.1","eslint-config-standard":"^10.2.1","eslint-plugin-babel":"^4.1.2","eslint-plugin-jest":"^21.6.1","eslint-plugin-node":"^5.1.1","eslint-plugin-prettier":"^2.4.0","eslint-plugin-promise":"^3.5.0","eslint-plugin-standard":"^3.0.1",express:"^4.15.5","git-exec-and-restage":"^1.0.1",husky:"^0.14.3",jest:"^22.0.6",jsdom:"^11.5.1","lint-staged":"^6.0.0",mocha:"^4.1.0",nuxt:"latest","prettier-standard":"^8.0.0","request-promise-native":"^1.0.5",rollup:"^0.53.4","rollup-plugin-babel":"^3.0.3","rollup-plugin-commonjs":"^8.2.6","rollup-plugin-copy":"^0.2.3","rollup-plugin-filesize":"^1.5.0","rollup-plugin-json":"^2.3.0","rollup-plugin-node-resolve":"^3.0.2","rollup-plugin-uglify-es":"0.0.1","rollup-watch":"^4.3.1","serve-static":"^1.12.6",sinon:"^4.1.4","sinon-chai":"^2.13.0","standard-version":"^4.3.0"},jest={testEnvironment:"node",testMatch:["**/?(*.)test.js"],coverageDirectory:"./coverage/",mapCoverage:!0,collectCoverage:!0},bugs={url:"https://github.com/nuxt-community/nuxtent-module/issues"},homepage="https://github.com/joostdecock/nuxtdown-module#readme",directories={doc:"docs",example:"examples",lib:"lib",test:"test"},author="Joost De Cock",_package={name:name,version:version,description:description,main:main,contributors:contributors,repository:repository,keywords:keywords,license:license,scripts:scripts,peerDependencies:peerDependencies,dependencies:dependencies,devDependencies:devDependencies,jest:jest,bugs:bugs,homepage:homepage,directories:directories,author:author,"lint-staged":{"*.js":["git-exec-and-restage eslint --fix --","git-exec-and-restage prettier-standard"]}},markdownParser=(e,t)=>{const n={preset:"default",html:!0,typographer:!0,linkify:!0};void 0!==e.extend&&e.extend(n);const o=markdownit(n);const s=e.plugins||{};Object.keys(s).forEach(e=>{Array.isArray(s[e])?o.use.apply(o,s[e]):o.use(s[e])});void 0!==e.customize&&e.customize(o);return o},_extends$3=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e};const permalinkCompiler=pathToRegexp.compile,getSlug=e=>{const t=e.replace(/(\.comp)?(\.[0-9a-z]+$)/,"").replace(/!?(\d{4}-\d{2}-\d{2}-)/,"");return paramCase(t)},splitDate=e=>{const[t,n,o]=e.split("-");return{year:t,month:n,day:o}},parserCallbackForToc=function(e,t,n){let o=!0;void 0!==t.attrs&&Object.keys(t.attrs).forEach(e=>{const n=t.attrs[e][1];const s=t.attrs[e][0];"class"===s&&"notoc"===n&&(o=!1)}),o&&(e.toc={tag:t.tag,slug:n.slug,title:n.title})};var _extends$2=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e};const{max:max,min:min}=Math,globAndApply=(e,t,n,o="/")=>{const s=fs.readdirSync(e).reverse();s.forEach((s,r)=>{const i=path.join(e,s);if(fs.statSync(i).isFile()){const e={index:r,fileName:s,section:o};n(e,t)}else globAndApply(i,t,n,path.join(o,s))});return t};var _extends$1=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e};const logRequest=(e,t)=>{console.log(`${chalk.blue(e)} ${chalk.green("GET")} ${t}`)},response=e=>({json(t){e.setHeader("Content-Type","application/json"),e.end(JSON.stringify(t),"utf-8"),console.log("\tResponse sent successfully.")},error(t){e.statusCode=500,e.statusMessage="Internal Server Error",e.end(t.stack||String(t)),console.log("\tFailed to send response.",t)},notFound(){e.statusCode=404,e.statusMessage="Not Found",e.end(),console.log("\tPage not found.")}}),curryResponseHandler=(e,t,n,o,s,r)=>{const i=createDatabase(o,n,s,r);return function(n,o){const s=response(o);let r=n.params[0];r=r.replace(/\\|\/\//g,"/");const[a,c]=n.url.match(/\?(.*)/)||[],l=querystring.parse(c),{only:only,between:between}=l,u=_objectWithoutProperties(l,["only","between"]);logRequest(t,e+r),"/"===r?between?s.json(i.findBetween(between,u)):only?s.json(i.findOnly(only,u)):s.json(i.findAll(u)):i.exists(r)?s.json(i.find(r,u)):s.notFound()}},createRouter=(e,t,n)=>{const o=express.Router();const{contentDir:contentDir,content:content,parsers:parsers,isDev:isDev}=n;content["/"]||o.use("/",(new express.Router).get("/",(e,t)=>{response(t).json({"content-endpoints":Object.keys(content)})}));Object.keys(content).forEach(n=>{const s=_extends$1({},content[n],{parsers:parsers});const r=curryResponseHandler(e,t,n,contentDir,s,isDev);o.use(n,(new express.Router).get("*",r))});return o},buildPath=(e,t,n)=>{const o=e.replace(/(?!^\/)\//g,".");return path.join(n,t,o)+".json"},routeName=e=>{return e.replace(/^\//,"").replace("/","-").replace("_","")},asset=e=>{const t=JSON.stringify(e,null,"production"===process.env.NODE_ENV?0:2);return{source:()=>t,size:()=>t.length}},interceptRoutes=(e,t)=>{e.extendRoutes(e=>{e.forEach(e=>{t.has(e.name)?e.path="/"+t.get(e.name):e.children&&e.children.forEach(e=>{if(t.has(e.name)){const n=e.path.match(/\?$/);e.path=n?t.get(e.name)+"?":t.get(e.name)}})})})},addRoutes=(e,t)=>{e.generate||(e.generate={});e.generate.routes||(e.generate.routes=[]);const{routes:routes}=e.generate;if(!Array.isArray(routes))throw new Error(`"generate.routes" must be an array`);e.generate.routes=routes.concat(t)},addAssets=(e,t)=>{e.build.plugins.push({apply(e){e.plugin("emit",(e,n)=>{t.forEach((t,n)=>{e.assets[n]=asset(t)});n()})}})},buildContent=(e,t,n,o)=>{const{contentDir:contentDir,content:content,isDev:isDev}=o;const s=[];const r=new Map;const i=new Map;Object.keys(content).forEach(e=>{const{page:page,generate:generate,permalink:permalink}=content[e];let o;page&&(o=routeName(page),r.set(o,permalink.replace(/^\//,"")));if(generate&&n){const n=createDatabase(contentDir,e,content[e],isDev);generate.forEach(o=>{const r={};if("string"==typeof o)r.method=o;else if(Array.isArray(o)){const[e,t]=o;r.method=e,r.query=t.query?t.query:{},r.args=t.args?t.args:[]}switch(r.method){case"get":if(!page)throw new Error("You must specify a page path");n.findAll(r.query).forEach(n=>{s.push(n.permalink);i.set(buildPath(n.permalink,e,t),n)});break;case"getAll":i.set(buildPath("_all",e,t),n.findAll(r.query));break;case"getOnly":i.set(buildPath("_only",e,t),n.findOnly(r.args,r.query));break;default:throw new Error(`The ${r.method} is not supported for static builds.`)}})}});interceptRoutes(e,r);addRoutes(e.options,s);addAssets(e.options,i)};var _extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e};const nuxtentConfig=e=>{const t=path.join(e,"nuxtent.config.js");try{return require(t)}catch(e){if("MODULE_NOT_FOUND"===e.code)return!1;throw new Error(`[Invalid Nuxtent configuration] ${e}`)}},mergeContentOptions=(e,t)=>{const n={};Array.isArray(e)?e.forEach(o=>{const s=Array.isArray(o);const r=s?o[0]:o;const i=s?o[1]:{};if("/"===r&&e.length>1)throw new Error("Top level files not allowed with nested registered directories");n[path.join("/",r)]=_extends({},t,i)}):n["/"]=_extends({},t,e);return n},getAPIOptions=(e={},t)=>{const n="function"==typeof e?e(t):e;const{baseURL:baseURL="",browserBaseURL:browserBaseURL,otherAPIOptions:otherAPIOptions={}}=n;return _extends({baseURL:baseURL,browserBaseURL:browserBaseURL||baseURL},otherAPIOptions)},CONTENT_DIR="content",COMPONENTS_DIR="components",BUILD_DIR="content",API_SERVER_PREFIX="/content-api",API_BROWSER_PREFIX="/_nuxt/content";exports.default=ContentModule,exports.meta=_package;
