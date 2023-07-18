// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    isRecording: false,  // 标记当前是否正在录音
    recordDuration: 0,   // 录音时长（单位：秒）
    timer: null          // 计时器
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {

	},
	startRecord: function() {
    this.setData({ isRecording: true });
    wx.startRecord({
      success: function(res) {
        var tempFilePath = res.tempFilePath;  // 获取录音临时文件的路径
				// 在这里可以调用语音识别接口进行后续处理
        console.log('录音成功', tempFilePath);
				// 在这里可以将录音临时文件路径传递给其他函数进行处理
				// 比如上传到服务器或进行语音识别等操作
				wx.uploadFile({
					url: 'http://43.143.247.127:8090/voice/chat',  // 后端接口地址
					filePath: tempFilePath,             // 录音临时文件的路径
					name: 'file',                        // 服务器接收文件的字段名
					success: function(res) {
						console.log('返回：', res);
						var data = res.data;  // 服务器返回的数据
						console.log('上传成功', data);
						// 在这里可以对上传成功后的操作进行处理
					},
					fail: function(res) {
						console.log('上传失败', res);
						// 上传失败的处理逻辑
					}
				});
				// wx.request({
				// 	url: 'http://43.143.247.127:8090/voice/pilk',  // 请求的URL
				// 	method: 'POST',  // 请求方法（GET、POST等）
				// 	data: {  // 请求参数（可选）
				// 		"input_file": tempFilePath,
				// 	},
				// 	header: {  // 请求头（可选）
				// 		'content-type': 'application/json'
				// 	},
				// 	success: function(res) {
				// 		console.log(res.data);  // 请求成功后的处理逻辑
				// 	},
				// 	fail: function(err) {
				// 		console.log('error');  // 请求成功后的处理逻辑
				// 		console.error(err);  // 请求失败后的处理逻辑
				// 	}
				// });
				
      },
      fail: function(res) {
        // 录音失败的处理逻辑
        console.log('录音失败', res);
      }
		});
		// 开始计时
		var that = this;
		this.data.timer = setInterval(function() {
			var duration = that.data.recordDuration + 1;
			that.setData({ recordDuration: duration });
		}, 1000);
	},
	stopRecord: function() {
    this.setData({ isRecording: false });
    wx.stopRecord();
    clearInterval(this.data.timer);
    // 在这里可以进行录音结束后的处理逻辑
  }
})
