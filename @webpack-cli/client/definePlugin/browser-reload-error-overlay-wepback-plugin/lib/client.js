/*
 * @Date: 2022-05-12 17:59:30
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-13 15:55:10
 * @FilePath: /webpack-cli/@webpack-cli/client/definePlugin/browser-reload-error-overlay-wepback-plugin/client.js
 * @Description: 
 */
(function () {
	if (window.__browserReloadPlugin) {
		return;
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
					window.location.reload();
				} else {
					//   log('Build completed.');
				}
			}

			if(cmd ==="cmd:buildError"){
				log('buildError...');
			//    console.log('message===',message.split('\n'))
               console.error(message)
                let hasIframe =  document.getElementById(id)
                let filter = new ansiToHtml();
                let iframe=hasIframe?hasIframe: document.createElement("iframe");
                iframe.id = id;
                title = "buildError...";
				iframe.style.cssText=`
						width:calc(100% + 20px);
						height:calc(100% + 20px);
						z-Index : 999999999;
						position:fixed;
						border:medium none;
						padding:0px;
						margin :0px;
						top :-20px;
						left :-20px;
				`
                let html = message.split('\n').reduce((acc, item) => {
                    return (acc += `<div >${filter.toHtml(item)}<div>`);
                }, "");
				iframe.srcdoc = `
							<style>
								* {
									margin: 0;
									padding: 0;
								}
								.ansi-html-box {
									background: rgba(0, 0, 0, 0.55);
									width: 100%;
									min-height: calc(100vh + 20px);
									padding: 60px;
									box-sizing: border-box;
									transition: 0.5s;
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
