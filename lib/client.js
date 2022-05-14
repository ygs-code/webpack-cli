/*
 * @Date: 2022-05-12 17:59:30
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-14 14:26:30
 * @FilePath: /webpack-cli/@webpack-cli-cjs/client/definePlugin/browser-reload-error-overlay-wepback-plugin/lib/client.js
 * @Description: 
 */
(function () {
	if (window.__browserReloadPlugin) {
		return;
	}

	const getStyle = (ele, attr) => {
        var style = null;
        if (window.getComputedStyle) {
          style = window.getComputedStyle(ele, null);
        } else {
          style = ele.currentStyle;
        }
        return attr ? style[attr] : style;
      };

      function getParentNode(el, callback = () => {}) {
        while (el && el.tagName !== "HTML") {
          callback(el);
          el = el.parentNode;
        }
      }

      function getElOffset(el) {
        var left = 0;
        var top = 0;
        var marginTop = 0;
        var marginLeft = 0;
        var paddingLeft = 0;
        var paddingTop = 0;
        getParentNode(el, ($el) => {
          left +=
            getStyle($el, "left") === "auto"
              ? 0
              : parseInt(getStyle($el, "left"));

          top +=
            getStyle($el, "top") === "auto"
              ? 0
              : parseInt(getStyle($el, "top"));
          marginTop +=
            getStyle($el, "marginTop") === "auto"
              ? 0
              : parseInt(getStyle($el, "marginTop"));
          marginLeft +=
            getStyle($el, "marginLeft") === "auto"
              ? 0
              : parseInt(getStyle($el, "marginLeft"));
          paddingLeft +=
            getStyle($el, "paddingLeft") === "auto"
              ? 0
              : parseInt(getStyle($el, "paddingLeft"));
          paddingTop +=
            getStyle($el, "paddingTop") === "auto"
              ? 0
              : parseInt(getStyle($el, "paddingTop"));
        });

        return {
          left,
          top,
          marginTop,
          marginLeft,
          paddingLeft,
          paddingTop,
        };
      }
      
      
      
	function guid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
	let id = guid()

	var config = window.__browserReloadPlugin = {
		enabled: true,
		retryWait: /*retryWait*/,
		wsServer: 'ws://localhost:/*port*/',
		delay: /*delay*/
	};

	function log(message) {
		console.info('%c browser-reload-error-overlay-wepback-plugin ' + (config.enabled ? '' : '(Disabled) '), 'background:#CB5C0D; padding:2px; border-radius:3px; color:#fff', message);
	}

	(function connect() {
		var socket = new WebSocket(config.wsServer);

		socket.addEventListener('open', function () {
			log('Connected. Waiting for changes.');
		});

		socket.addEventListener('error', function () {
			socket.close();
		});

		socket.addEventListener('close', function () {
			log('Connection closed. Retrying in ' + Math.ceil(config.retryWait / 1000) + 's');

			if (config.retryWait) {
				setTimeout(connect, config.retryWait);
			}
		});

		socket.addEventListener('message', function ({data}) {
			// console.log('data=',data)
			const {cmd,message}  =  JSON.parse(data)
			if (cmd === 'cmd:reload') {
				if (config.enabled) {
					log('Build completed. Reloading...');
					setTimeout(()=>{
						window.location.reload();
					},config.delay)
				} else {
					//   log('Build completed.');
				}
			}

			if(cmd ==="cmd:buildError"){
				log('buildError...');
			//    console.log('message===',message.split('\n'))
                console.error(message)
				let bodyOffset = getElOffset(document.querySelector("body"));
				let $left =bodyOffset.left+bodyOffset.marginLeft+ bodyOffset.paddingLeft
				let $top =bodyOffset.top+bodyOffset.marginTop+ bodyOffset.paddingTop
                let hasIframe =  document.getElementById(id)
                let filter = new ansiToHtml();
                let iframe=hasIframe?hasIframe: document.createElement("iframe");
                iframe.id = id;
                title = "buildError...";
			    iframe.style.cssText = `
						width:calc(100vw + ${$left}px);
						height:calc(100vh + ${$top}px);
						z-Index : 999999999;
						position:fixed;
						border:medium none;
						padding:0px;
						margin :0px;
						top :-${$top}px;
						left :-${$left}px;
				`;


                let html = message.split('\n').reduce((acc, item) => {
                    return (acc += `<div >${filter.toHtml(item)}<div>`);
                }, "");
				html=html.replace(/color\:\#FFF/ig,'')
				iframe.srcdoc = `
							<style>
								* {
											margin: 0;
											padding: 0;
									}
									.ansi-html-box {
										    background: #fff;
											width:calc(100%);
											height:auto;
											min-height: calc(100vh);
											padding-top:${$top+40}px;
											padding-left:${$left+40}px;
											box-sizing: border-box;
											overflow-y: auto;
									}
									.failed-to-compile{
											color:rgb(200, 15, 47);
											font-size: 20px;
									}
							</style>
							<div  class="ansi-html-box">
								<div  class="failed-to-compile">Failed to compile :</div>
								${html}
							<div>;
			             	`;

                if(!hasIframe){
                    document.body.appendChild(iframe);
                }
			}

			if (cmd === 'cmd:rebuilding') {
				log('Rebuilding...');
			}
		});
	})();
})();
