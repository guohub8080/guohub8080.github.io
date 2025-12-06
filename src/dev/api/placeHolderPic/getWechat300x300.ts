const p9 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XULEul18SYZl7mkBv7dhicIH6MYib5OLfgeLSfkJspaiaq1LLUL2zMkgSicA/640?wx_fmt=jpeg&amp;from=appmsg"
const p8 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUnAnPNe36jsvuoS6Fx6MNliabMOSaib66wLqVWbw3jqU3uh7JGPtZaY1w/640?wx_fmt=jpeg&amp;from=appmsg"
const p7 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUO2mX2rR3BSGbN6vfSnx8HAal1pzQbb8DoGnhy3LPLN0wcEibrepydqw/640?wx_fmt=jpeg&amp;from=appmsg"
const p6 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUDJ4W93XNH7y3RP0faRWQpnQvLmKYjFZ5aGZsDuqx5Q44sca7AsZBQw/640?wx_fmt=jpeg&amp;from=appmsg"
const p5 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUSfx4GslwAribxIxUpTScaOjUVrvgnC5WfSBLicSXiaWGqM7dlAOvibIXuA/640?wx_fmt=jpeg&amp;from=appmsg"
const p4 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUicTfJGxeXIEu6C9CgQdCiaAz4J8yfsPiaI7ic63xTDiasQPhNNHRNBRBgFw/640?wx_fmt=jpeg&amp;from=appmsg"
const p3 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUX47H8nicTSEibTV9OQlmciaQ6ttKbIsDWx9jKKyS5X6czmuNfoLKCKKHg/640?wx_fmt=jpeg&amp;from=appmsg"
const p2 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUruO548vmbQichfRYD84WTMo7B4ckB2m8M9Z6I2gu2L3K0K1OZ74ibhMQ/640?wx_fmt=jpeg&amp;from=appmsg"
const p1 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUiarW633vqYP1raLZ5SsDzib2lGCPKUR5nEjEaZyhYD7tgdaibDr9bRZAw/640?wx_fmt=jpeg&amp;from=appmsg"


const getWechat300x300 = (num: number) => {

    if (num < 0) throw new Error("num must be greater than 0");
    if (num > 9) throw new Error("num must be less than 9");
    switch (num) {
        case 9:
            return p9;
        case 8:
            return p8;
        case 7:
            return p7;
        case 6:
            return p6;
        case 5:
            return p5;
        case 4:
            return p4;
        case 3:
            return p3;
        case 2:
            return p2;
        case 1:
            return p1;
        default:
            throw new Error("num must be between 1 and 9");
    }

}

export default getWechat300x300;