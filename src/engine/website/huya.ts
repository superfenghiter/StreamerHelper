const axios = require("axios");

export function main(url: string) {
    return new Promise(function (resolve, reject) {
        axios
            .get(url)
            .then(function (response: any) {
                const html: string = response.data;
                const base64Reg: RegExp = /(?<=("stream":[\s]*"))(.+?)(?=("[\s]*\}))/g;      // 匹配base64编码的情况
                const jsonReg: RegExp = /(?<=(stream:[\s]*))(\{.+?[\s]*\})(?=([\s]*\}))/g;   // 匹配为编码的情况
                const base64Result: any = html.match(base64Reg);
                const jsonResult: any = html.match(jsonReg);
                let infoObj: any;
                if (base64Result && base64Result.length >= 1) {
                    infoObj = JSON.parse(
                        Buffer.from(base64Result[0], "base64").toString("ascii")
                    );
                } else if (jsonResult && jsonResult.length >= 1) {
                    infoObj = JSON.parse(jsonResult);
                }
                if (infoObj) {
                    const streamInfoList: any =
                        infoObj.data[0].gameStreamInfoList;
                    //const streamerName = infoObj["data"][0]["gameLiveInfo"]["nick"];
                    const urlInfo1: any = streamInfoList[0];
                    //const urlInfo2 = streamInfoList[1];

                    //可以得到六种链接，m3u8链接最稳定
                    const aliFLV =
                        urlInfo1["sFlvUrl"] +
                        "/" +
                        urlInfo1["sStreamName"] +
                        ".flv?" +
                        urlInfo1["sFlvAntiCode"];
                    //const aliHLS:string = urlInfo1["sHlsUrl"] + "/" + urlInfo1["sStreamName"] + ".m3u8?" + urlInfo1["sHlsAntiCode"];
                    //const aliP2P = urlInfo1["sP2pUrl"] + "/" + urlInfo1["sStreamName"] + ".slice?" + urlInfo1["newCFlvAntiCode"];
                    //const txFLV = urlInfo2["sFlvUrl"] + "/" + urlInfo2["sStreamName"] + ".flv?" + urlInfo2["sFlvAntiCode"];
                    //const txHLS = urlInfo2["sHlsUrl"] + "/" + urlInfo2["sStreamName"] + ".m3u8?" + urlInfo2["sHlsAntiCode"];
                    //const txP2P = urlInfo2["sP2pUrl"] + "/" + urlInfo2["sStreamName"] + ".slice?" + urlInfo2["newCFlvAntiCode"];
                    resolve(aliFLV.replace(/\amp\;/g, ""));
                } else {
                    reject(
                        "HUYA=>No match results:Maybe the roomid is error,or this room is not open!"
                    );
                }
            })
            .catch(function (error: any) {
                reject(error);
            });
    });
}
