const cheerio = require('cheerio')
const request = require('request')
const superagent = require('superagent')
const path = require('path')
const fs = require('fs')






const indexUrl = 'http://i.meituan.com/index/DealList'


/*首页猜你喜欢数据生成index.json数据 */
superagent.get(indexUrl).end((err, res) => {
	if (err) {
		throw new Error(err)
	}
	const arr = []
	const $ = cheerio.load(res.text)
	const arrLike = $('.list.bd-deal-list>dd')
	Array.from(arrLike).forEach(ele => {
		ele = $(ele).children('a').children('.dealcard')
		const des = $(ele).children('.dealcard-block-right')
		const obj = {
			id: ele.data().did,
			img: indexUrl + ele.children('.dealcard-img').data('srcHigh'),
			name: des.children('.dealcard-brand').text(),
			address: des.children('.text-block').text(),
			price: des.find('.strong').text(),
			sellCount: des.find('del').text().substr(2)
		}
		arr.push(obj)
	})
	const fileUrl = path.resolve(__dirname, './data/data.json')
	fs.writeFile(fileUrl, JSON.stringify(arr, null, 2), 'utf-8', (err, data) => {
		if (err) {
			console.log(err, '首页猜你喜欢数据写入失败')
		}
	})
})

































