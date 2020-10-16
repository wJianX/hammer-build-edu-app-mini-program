<template>
	<view class="quePage">
		<scroll-view scroll-y="true" class="pageTop">
			<view class="relative questionCrumb u-skeleton">
				<view class="question_box f_left">
					<view class="question_list">
						<text class="question_anli" v-if="isEmptyOrNUll(questionList.backgroundText)">案例：{{ questionList.backgroundText }}</text>
						
						<dl class="question_list_dl">
							<view class="question_img_type">
								<text>{{questionList.type == 3 ? '判断题': questionList.type == 1 ? '单选题' : questionList.type == 2 ? '多选题' : '案例题'}}</text>
								<dt>{{ questionList.sort }}、{{ questionList.question }}</dt>
							</view>
							
							<view class="text_center" style="margin-bottom: 20px;">
								<image v-if="isEmptyOrNUll(questionList.imgUrl)" :src="questionList.imgUrl" ></image>
							</view>
							<dd v-for="(option, index) in questionList.container" :key="index" @click="optionClick(option.k)">
								<image :src="'/static/images/question/' + option.image + '.png'" class="myselect" v-if="isEmptyOrNUll(option.image)"></image>
								{{ option.v }}
							</dd>
						</dl>
					</view>
					<view class="question_btns text_center">
						<button class="question_prev" @click="prev" type="primary" plain="true">{{ prevText }}</button>
						<button class="question_next" @click="next" type="primary" plain="true">{{ nextText }}</button>
					</view>
					<view class="question_anylise" v-if="isAnalysise">
						<text class="question_anylise_title text_center">试题解析</text>
						<text class="question_anylise_answer color666">正确答案</text>
						<text class="question_anylise_answer">{{ questionList.rightAnswer }}</text>
						<!-- <text class="question_anylise_answer color666">试题详解</text>
						<text class="question_anylise_answer">{{ questionList.analysis }}</text> -->
					</view>
				</view>
				<view class="clear"></view>
				
				<view class="examScoreDialog" v-if="examScoreDialog">
					<view class="nl1">
						<view class="title">提示</view>
						<view class="nl1text">{{examScore}}</view>
						<view class="bt" @click="examScoreSure">确 定</view>
					</view>
				</view>
				
			</view>
			<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
		</scroll-view>
		<view class="pageBottom" :class="isIphoneX?'iphoneX-height':''">
			<view class="mask" v-show="listsActive" @click="hide"></view>
			<view :class="{questionList,'listsActive':listsActive,'listsActiveBottom':isIphoneX}">
				<view @click="questionLists" class="row" style="text-align: center;font-size: 30upx;justify-content: space-between;">
					<view class="row" style="margin-left: 40upx;">
						<image src="/static/images/question/true.png" mode="" class="quesListImg"></image><text style="color: #333333;margin-right: 40upx;">{{rightSum}}</text>
						<image src="/static/images/question/false.png" mode="" class="quesListImg"></image><text style="color: #FF5A57;">{{errorSum}}</text>
					</view>
					<view class="row questionResetBtn" style="margin-right: 40upx;">
						<!-- <button v-show="questionResetBtn" type="default" @click.stop="questionResetBtns">重置试卷</button> -->
						<image src="/static/images/question/title.png" mode="" class="quesListImg"></image><text style="color: #364354;">{{title}}</text>
					</view>
				</view>
				<view v-if="listsActive">
					<view class="question_mark">
						<text class="blueAnswer"></text><text class="blueAnswerText">蓝色正确</text>
						<text class="redError"></text><text class="redErrorText">红色错误</text>
						<text class="grayNone"></text><text style="color: #666666;line-height: 40upx;">灰色未做</text>
					</view>
					<view class="Lists">
						<scroll-view scroll-y style="height: 470upx;" class="tiHaos">
							<text :class="{isRight:item.isRight,isError:item.isError}" class="tiHao" v-for="(item,index) in itemPools" :key="index" @click="toQuestion(index)">{{item.sort}}</text>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { _request, showToast } from '@/common/js/request.js'
import api from '@/common/js/api.js';
import tools from '@/common/js/tools.js';

const app = getApp();
export default {
	data() {
		return {
			isIphoneX: app.globalData.isIphoneX,
			questionResetBtn: false, //重置试卷按钮
			examScoreDialog: false, //得分
			examScore: '',
			rightSum: 0, //对题
			errorSum: 0, //错题
			dialogVisible: false, //题号弹框
			lastQuestionDialog: false, //剩余题数弹框
			itemPools: [],
			questionAnLiLists: [],
			listsActive: false,
			questionList: {
				container: [{ k: '', v: '', image: '' }]
			}, //当前题
			prevText: '上一题',
			nextText: '下一题',
			rid: '',
			questHeight: '500px',
			isAnalysise: false, //是否显示解析
			isRight: false, //定义答对题样式
			isError: false, //定义答错题样式
			title: '',
			qid: '',
			questionJson: null,
			loading: true
		};
	},
	onLoad(opt) {
		this.qid = opt.questionId
		this.getQuestionJson(opt.questionId, opt.url)
		let myTitle = "试卷"
		if(opt.taskName != ""){
			myTitle = opt.taskName
		}
		uni.setNavigationBarTitle({
			title: myTitle
		});
	},
	watch:{
		questionList(val){
			let title = ""
			if(!tools.isEmptyOrNUll(val)){
				let type = val.type
				title = val.sort + '/' + this.itemPools.length
				this.title = title
				if(type == '1'){
					title += ' 单选题'
				}else if(type == '2'){
					title += ' 多选题'
				}else if(type == '3'){
					title += ' 判断题'
				}else{
					title += ' 案例题'
				}
			}else{
				title = '练习'
			}
			// uni.setNavigationBarTitle({
			// 	title: title
			// });
		}
	},
	methods: {
		hide() {
			this.listsActive = false;
		},
		questionLists() {
			this.listsActive = true;
		},
		isEmptyOrNUll(data) {
			return !tools.isEmptyOrNUll(data);
		},
		async getQuestionJson(qid, Url) {
			let sjUrl = await _request(api.getQuestionUrl, {url: Url})
			let data = await _request(api.uniUrl + sjUrl.resultMap, {}, "GET")  // api.uniUrl + sjUrl.resultMap
			this.questionJson = data
			this.itemPools = data.itemPools;
			if (data.questionBackgrounds) {
				this.questionAnLiLists = data.questionBackgrounds;
			}
			this.getQuestionRecord(qid)
		},
		getQuestionRecord(qid) {
			//获取进度
			this.renderBefore(uni.getStorageSync(qid) == "" ? {} : uni.getStorageSync(qid))
		},
		renderBefore(data) {
			// 根据答案对比 对错
			for (var k in data) {
				this.itemPools.forEach((item, index) => {
					if (item.id == k) {
						item.result = data[k].answer == undefined ? '' : data[k].answer;
						item.isFinish = data[k].answer.length > 0;
						if (this.answerequal(data[k].answer, item.rightAnswer)) {
							item.isRight = true;
							item.isError = false;
							this.rightSum += 1;
						} else if (item.result == '') {
							item.isRight = false;
							item.isError = false;
						} else {
							item.isRight = false;
							item.isError = true;
							this.errorSum += 1;
						}
					}
				});
			}
			this.refresh(this.itemPools[0]);
		},
		refresh(model) {
			if(!this.isEmptyOrNUll(model)){
				return
			}
			model.result = model.result == undefined ? '' : model.result;
			model.isFinish = model.result.length > 0;

			for (var i = 0; i < this.questionAnLiLists.length; i++) {
				if (this.questionAnLiLists[i].id == model.backgroundId) {
					model.backgroundText = this.questionAnLiLists[i].backGroundText;
				}
			}
			this.render(model);
		},
		render(model) {
			this.anylise(model);
			model.container.forEach((v, i) => {
				var o = v;
				for (var j in o) {
					var optionKey = o[j];
					o.image = optionKey;
					if (!model.isFinish){
						console.log(1)
						o.image = this.containValue(model.result, optionKey) ? 'right' : optionKey;
					} else if (this.containValue(model.result, optionKey) && this.containValue(model.rightAnswer, optionKey)) {
						console.log(2)
						o.image = 'right';
					} else if (this.containValue(model.result, optionKey) && !this.containValue(model.rightAnswer, optionKey)) {
						console.log(3)
						o.image = 'error';
					} else if (!this.containValue(model.result, optionKey) && this.containValue(model.rightAnswer, optionKey)) {
						console.log(4)
						o.image = optionKey + 'R';
					}
				}
			});
			if (model.isFinish == 0 && model.result.length > 0) {
				this.nextText = '确定';
			} else {
				this.nextText = '下一题';
			}
			this.questionList = {}
			this.questionList = model
			this.loading = false;
		},
		anylise(model) {
			var isOver = true;
			model.result = model.result == undefined ? "" : model.result;
			if (model.isFinish && !this.answerequal(model.rightAnswer, model.result)) {
				this.isAnalysise = true;
			} else {
				this.isAnalysise = false;
			}
			this.itemPools.forEach((v, i) => {
				if (!v.isFinish) {
					isOver = false
					return isOver;
				}
			})
			if (isOver) {
				this.questionResetBtn = true;
				this.questionResetBtns();
			}
		},
		questionResetBtns(){
			// 重置考卷
			uni.showModal({
			    title: '提示',
			    content: '是否重置试卷?',
			    success: res => {
			        if (res.confirm) {
			            this.questionSubmit();
			        } else if (res.cancel) {
			            uni.showToast({
			            	title: '已取消',
			            	icon: 'none'
			            })
			        }
			    }
			});
		},
		containValue(str1, str2) {
			if (str1 == undefined) return false;
			return str1.indexOf(str2) >= 0;
		},
		next() {
			var model = this.questionList;
			var index = parseInt(this.questionList.sort);
			if (model.sort == this.itemPools[this.itemPools.length - 1].sort && this.nextText == "下一题") {
				uni.showToast({
					title: '当前为最后一题！',
					icon: 'none'
				})
				return;
			}
			if (this.nextText == "确定") {
				model.isFinish = 1;
				this.nextText = "下一题";
				this.anylise(model);
				this.compareRightError(model);
				let my_isRight = false
				if (this.answerequal(model.rightAnswer, model.result)) {
					model.isRight = true;
					my_isRight = true
					model.isError = false;
					this.rightSum += 1;
					this.refresh(this.itemPools[index]);
				} else {
					model.isRight = false;
					model.isError = true;
					my_isRight = false
					this.refresh(model);
					this.errorSum += 1
				}
				let data = {
					isRight: my_isRight,
					answer: model.result
				}
				let state = uni.getStorageSync(this.qid) == "" ? {} : uni.getStorageSync(this.qid)
				state[model.id] = data
				uni.setStorageSync(this.qid, state);
				return;
			}
			this.refresh(this.itemPools[index]);
		},
		prev() {
			var index = this.questionList.sort - 2;
			if (index == -1) {
				uni.showToast({
					title: '当前为第一题！',
					icon: 'none'
				})
				return;
			}
			this.prevreduction()
			this.refresh(this.itemPools[index]);
		},
		prevreduction(){
			var model = this.questionList;
			if (model.hasOwnProperty("isFinish") && !model.isFinish && model.result != "") {
				model.result = ""
			}
		},
		thClose(){
			this.dialogVisible = false
		},
		toQuestion(index) {
			this.sortTi = index;
			this.dialogVisible = false;
			this.listsActive = false;
			this.refresh(this.itemPools[index])
		},
		answerequal(answer1, answer2) {
			var bl = true;
			if (answer1 == undefined || answer2 == undefined) return false;
			if (answer1.length != answer2.length) return false;
			answer1 = answer1.toUpperCase();
			answer2 = answer2.toUpperCase();
			answer1.split("").forEach((v, i) => {
				if (!this.containValue(answer2, v)) {
					bl = false;
					return false;
				}
			});
			return bl;
		},
		optionClick(optionKey) {
			var model = this.questionList;
			if (model.isFinish) {
				return;
			}
			this.resultChange(model, optionKey);
			this.render(model);
		},
		resultChange(model, optionKey) {
			if (model.result.indexOf(optionKey) >= 0) {
				model.result = model.result.replace(optionKey, "");
			} else if (model.typeName == "多选题") {
				model.result += optionKey;
			} else {
				model.result = optionKey;
			}
		},
		compareRightError(model) {
			model.container.forEach((v, i) => {
				var o = v;
				for (var j in o) {
					var optionKey = o[j];
					o.image = optionKey;
					if (!model.isFinish) o.image = this.containValue(model.result, optionKey) ? "right" : optionKey;
					else if (this.containValue(model.result, optionKey) && this.containValue(model.rightAnswer, optionKey)) {
						o.image = "right";
					} else if (this.containValue(model.result, optionKey) && !this.containValue(model.rightAnswer, optionKey)) {
						o.image = "error";
					} else if (!this.containValue(model.result, optionKey) && this.containValue(model.rightAnswer, optionKey)) {
						o.image = optionKey + "R";
					}
				}
			});
		},
		questionSubmit() {
			let state = uni.getStorageSync(this.qid) == "" ? {} : uni.getStorageSync(this.qid)
			let errData = []
			for(let key in state){
				if(!state[key].isRight){
					errData.push(key)
				}
			}
			let data = this.questionJson
			data.itemPools = this.itemPools
			_request(api.submitRecord, {
				questionId: this.qid,
				itemCount: this.questionJson.itemCount,
				questionName: this.questionJson.questionName,
				trueCount: this.rightSum,
				undoneCount: this.errorSum
			}).then(res => {
				uni.removeStorageSync(this.qid)
				uni.showToast({
					title: '当前试卷已提交，试卷已重置！',
					icon: 'none'
				})
				uni.navigateBack()
			})
		},
		examScoreSure(){
			this.examScoreDialog = false;
			uni.navigateBack()
		}
	}
};
</script>

<style scoped>
.quePage{
	display: flex;
	flex-direction: column;
	height: 100vh;
}
.pageTop{
	flex: 1;
	overflow: hidden;
}
.pageBottom{
	height: 100upx;
	background-color: #FFFFFF;
}
.iphoneX-height {
	height: 166upx;
}
.relative {
	position: relative;
}
.question_content {
	width: 100%;
	margin: 0 auto;
}

.question_box {
	width: 95%;
	margin: 20upx auto;
	padding: 40upx 20upx;
	margin-bottom: 140upx;
	background-color: #ffffff;
	color: #666666;
	min-height: 600upx;
	font-size: 30upx;
	position: relative;
	box-sizing: border-box;
}
.question_list_dl dt {
    text-indent: 100upx;
    line-height: 50upx;
    margin-bottom: 20upx;
}
.question_list .question_img_type {
	position: relative;
}
.question_img_type text{
	position: absolute;
	top: 0;
	left: 0;
	transform: translateY(15%);
	width: 96upx;
	text-align: center;
	border: 1upx solid #1890FF;
	border-radius: 6upx;
	color: #1890FF;
	font-size: 25upx;
	display: initial-block;
	padding: 3rpx;
	box-sizing: border-box;
}

.question_list .question_anli {
	margin-bottom: 60upx;
	line-height: 50upx;
}
.question_list_dl dd {
    padding-bottom: 10upx;
    padding-left: 20upx;
    cursor: pointer;
    margin-bottom: 10upx;
    line-height: 50upx;
}
.question_list_dl dd image {
    width: 60upx;
    height: 60upx;
    position: relative;
    top: 20upx;
	right: 20upx;
}
.question_btns{
	margin-top: 80upx;
	display: flex;
	justify-content: space-around;
}
.question_btns button{
	width: 40%;
}
.examScoreDialog{
	width: 100%;
	height: 100vh;
	background-color: rgba(0, 0, 0, .5);
	position: fixed;
	top: 0;
	left: 0;
}
.examScoreDialog .nl1{
	width: 90%;
	height: 80%;
	background-color: #FFFFFF;
	position: absolute;
	top: 50%;
	left: 50%;
	padding: 20upx;
	box-sizing: border-box;
	transform: translate(-50%, -50%);
	
}
.nl1 .title{
	font-size: 34upx;
	position: relative;
	margin-bottom: 30upx;
}
.scrollview{
	width: 100%;
}
.scrollview .flex{
	display: flex;
	justify-content: start;
	flex-wrap: wrap;
}
.nl .ths view.item{
	border: 1rpx solid #ccc;
	color: #ccc;
	border-radius: 50upx;
	width: 70upx;
	height: 70upx;
	text-align: center;
	line-height: 70upx;
	margin: 0 10upx 20upx;
	font-size: 28upx;
}
.nl .ths view.isError{
	border: 1px solid #ff0000;
	color: #ffffff;
	background: #ff0000;
}
.nl .ths view.isRight{
	border: 1px solid #3a89cc;
	color: #3a89cc;
}


.question_anylise_title{
	display: block;
	font-size: 40upx;
	color: #3a89cc;
	margin: 40upx 0;
}
.question_anylise_answer{
	display: block;
	font-size: 30upx;
	color: #3a89cc;
	margin: 20upx;
}
.color666{
	color: #666666;
}
.examScoreDialog .nl1{
	height: 30%;
}
.nl1 .nl1text{
	padding: 20upx 20upx 0;
	font-size: 32upx;
}
.nl1 .bt{
	position: absolute;
	bottom: 0;
	left: 0;
	border-top: 1upx solid #e5e5e5;
	width: 100%;
	text-align: center;
	font-size: 32upx;
	padding: 20upx 0;
}


.mask {
	position: fixed;
	z-index: 998;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, .3);
}
.questionList {
	width: 100%;
	border-top: 1px solid #ccc;
	height: 100upx;
	line-height: 100upx;
	background: #fff;
	bottom: 0;
	position: fixed;
}
.listsActive {
	position: fixed;
	bottom: 0;
	height: 660upx;
	z-index: 999;
	transition: height 0.5s ease;
}
.listsActiveBottom {
	bottom: 66upx
}
.quesListImg {
	width: 48upx;
	height: 48upx;
	line-height: 48upx;
	position: relative;
	margin-right: 20upx;
	top: 28upx;
}
.question_mark {
	text-align: center;
	height: 80upx;
	line-height: 80upx;
	background: #f5f5f5;
	font-size: 24upx;
}
.blueAnswer {
	width: 14upx;
	height: 14upx;
	background: #3A89CC;
	display: inline-block;
	margin-right: 20upx;
}

.blueAnswerText {
	color: #3A89CC;
	line-height: 40upx;
	margin-right: 50upx;
}
.redError {
	width: 14upx;
	height: 14upx;
	background: #FF0000;
	display: inline-block;
	margin-right: 20upx;
}

.redErrorText {
	color: #FF0000;
	line-height: 40upx;
	margin-right: 50upx;
}
.grayNone {
	width: 14upx;
	height: 14upx;
	background: #666666;
	display: inline-block;
	margin-right: 20upx;
}
.Lists {
	padding: 0;
}

.tiHao {
	width: 60upx;
	height: 60upx;
	display: inline-block;
	line-height: 60upx;
	border: 1px solid rgb(189, 189, 189);
	color: #666666;
	font-size: 26upx;
	border-radius: 50%;
	margin: 14upx;
	text-align: center;
	font-weight: bold;
}
.isRight {
	border: 1px solid #3a89cc;
	color: #FFFFFF;
	background: #3a89cc;
}

.isError {
	border: 1px solid #ff0000;
	color: #FFFFFF;
	background: #ff0000;
}
</style>
