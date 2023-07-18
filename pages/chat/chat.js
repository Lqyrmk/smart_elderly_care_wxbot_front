// pages/contact/contact.js
const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;

/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';

  msgList = [{
      speaker: 'server',
      contentType: 'text',
      content: '您好 ~ 我是智慧养老聊天机器人阿杜，有什么需要我帮忙的吗？'
    },
    {
      speaker: 'customer',
      contentType: 'text',
      content: '点击语音按钮或输入文字开始聊天'
    }
  ]
  that.setData({
    msgList,
    inputVal
  })
}

/**
 * 计算msg总高度
 */
// function calScrollHeight(that, keyHeight) {
//   var query = wx.createSelectorQuery();
//   query.select('.scrollMsg').boundingClientRect(function(rect) {
//   }).exec();
// }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
		inputBottom: 0,
		msg: '',
    isRecording: false,  // 标记当前是否正在录音
    recordDuration: 0,   // 录音时长（单位：秒）
		timer: null,          // 计时器
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    initData(this);
    // this.setData({
    //   cusHeadIcon: app.globalData.userInfo.avatarUrl,
    // });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 获取聚焦
   */
  focus: function(e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function(e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

	},
	/**
   * 发送输入监听
   */
	inputChange: function(e) {
		this.setData({
			msg: e.detail.value
		});
	},
	sendMsg: function() {
		var that = this;
		// console.log("输入框的值：" + this.data.msg);
		
		msgList.push({
			speaker: 'customer',
			contentType: 'text',
			content: this.data.msg
		})
		that.setData({
			msgList
		});
		wx.request({
				// url: 'http://localhost:8090/api/v1/voice/input',  // 请求的URL
				url: 'http://43.143.247.127:8090/api/v1/voice/input',  // 请求的URL
				method: 'POST',  // 请求方法（GET、POST等）
				data: {  // 请求参数（可选）
					"my_text": this.data.msg,
				},
				header: {  // 请求头（可选）
					'content-type': 'application/json'
				},
				success: function(res) {
					console.log(res.data)
					var responseData = res.data
					console.log(responseData.my_text)
					console.log(responseData.result_text)
					// 在这里可以对上传成功后的操作进行处理
					if (responseData.my_text == 'null') {
						responseData.my_text == '...'
					}
					msgList.push({
						speaker: 'server',
						contentType: 'text',
						content: responseData.result_text
					})
					inputVal = '';
					that.setData({
						msgList,
						inputVal
					});
					that.play_wav()
				},
				fail: function(res) {
					console.log('请求失败', res);
					// 请求失败的处理逻辑
				}
		});
		// 在这里执行其他逻辑
		this.setData({
			msg: '' // 清空输入框的值
		});
	},
  /**
   * 发送点击监听
   */
  // sendClick: function(e) {
	// 	console.log(msg)
  //   msgList.push({
  //     speaker: 'customer',
  //     contentType: 'text',
  //     content: e.detail.value
	// 	})
	// 	msgList.push({
  //     speaker: 'server',
  //     contentType: 'text',
  //     content: e.detail.value
  //   })
  //   inputVal = '';
  //   this.setData({
  //     msgList,
  //     inputVal
  //   });
	// },
	

  /**
   * 退回上一页
   */
  toBackClick: function() {
    wx.navigateBack({})
	},
	play_wav: function() {
		// 创建音频上下文对象
		const innerAudioContext = wx.createInnerAudioContext();
		// 设置音频源（WAV 文件的 URL）
		innerAudioContext.src = 'http://lqyrmk.online/resources/smart_elderly_care/cv_file/wav_file/result_wav.wav' + '?t=' + Math.random();
		// innerAudioContext.src = wav_url;
		// 播放音频
		innerAudioContext.play();
		// 监听音频播放结束事件
		innerAudioContext.onEnded(function() {
		console.log('音频播放结束');
	});

	},
	startRecord: function() {
		var that = this;
    this.setData({ isRecording: true });
    wx.startRecord({
      success: function(res) {
        var tempFilePath = res.tempFilePath;  // 获取录音临时文件的路径
				// 在这里可以调用语音识别接口进行后续处理
        console.log('录音成功', tempFilePath);
				// 在这里可以将录音临时文件路径传递给其他函数进行处理
				// 比如上传到服务器或进行语音识别等操作
				wx.uploadFile({
					// url: 'http://localhost:8090/api/v1/voice/chat',  // 后端接口地址
					url: 'http://43.143.247.127:8090/api/v1/voice/chat',  // 后端接口地址
					filePath: tempFilePath,             // 录音临时文件的路径
					name: 'file',                        // 服务器接收文件的字段名
					success: function(res) {
						var responseData = JSON.parse(res.data)
						console.log(responseData.my_text)
						console.log(responseData.result_text)
						// 在这里可以对上传成功后的操作进行处理
						if (responseData.my_text == 'null') {
							responseData.my_text == '...'
						}
						msgList.push({
							speaker: 'customer',
							contentType: 'text',
							content: responseData.my_text
						})
						msgList.push({
							speaker: 'server',
							contentType: 'text',
							content: responseData.result_text
						})
						inputVal = '';
						that.setData({
							msgList,
							inputVal
						});
						that.play_wav()
					},
					fail: function(res) {
						console.log('上传失败', res);
						// 上传失败的处理逻辑
					}
				});
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
