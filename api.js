const express = require('express')
const fetch = require('node-fetch')
const fs = require('fs')
const app = express()

app.get('/napcharts/:Name(\\w{5})(.png)?', function (req, res) {
  napchartid = req.params['Name'];
  let is_cached = fs.existsSync('/napcharts/' + napchartid + '.png');
  if (!is_cached) {
    getChart(napchartid, res)
  }
  else {
    res.sendFile('/napcharts/' + napchartid + '.png');
  }

})

app.get('/napcharts/:Name.json', function (req, res) {
	napchartid = req.params['Name'];

	let is_cached = fs.existsSync('/napcharts/' + napchartid + '.json');
	if (!is_cached) {
		getJson (napchartid, res)
	}
	else {
		res.sendFile('/napcharts/' + napchartid + '.json');
	}
})

app.listen(3000)

async function getChart(napchartid, res) {
  let imgurl = `http://thumb.napchart.com:1771/api/getimage?width=600&height=600&chartid=${napchartid}`;
  let jsonurl = `http://thumb.napchart.com:1771/api/get?chartid=${napchartid}`;
  let jsonres = await fetch(jsonurl);
  if (!checkStatus(jsonres)) {
    res.status(404).send("Napchart was not found")
  }
  else {
  	let imgres = await fetch(imgurl);
  	let imgdest = fs.createWriteStream('/napcharts/' + napchartid + '.png')
  	await imgres.body.pipe(imgdest)
    let jsondest = fs.createWriteStream('/napcharts/' + napchartid + '.json')
    await jsonres.body.pipe(jsondest)
  	await imgres.body.pipe(res);
  }
}

async function getJson (napchartid, res) {
  console.log("got to json part")
  let imgurl = `http://thumb.napchart.com:1771/api/getimage?width=600&height=600&chartid=${napchartid}`;
  let jsonurl = `http://thumb.napchart.com:1771/api/get?chartid=${napchartid}`;
  let jsonres = await fetch(jsonurl);
  if (!checkStatus(jsonres)) {
    res.status(404).send("Napchart was not found")
  }
  else {
    let imgres = await fetch(imgurl);
  	let imgdest = fs.createWriteStream('/napcharts/' + napchartid + '.png')
  	await imgres.body.pipe(imgdest)
    let jsondest = fs.createWriteStream('/napcharts/' + napchartid + '.json')
    await jsonres.body.pipe(jsondest)
  	await jsonres.body.pipe(res);
  }
}

function checkStatus(res) {
  if (res.ok) { // res.status >= 200 && res.status < 300
    return true;
  }
  return false;
}