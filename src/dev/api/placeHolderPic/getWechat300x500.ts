const p9 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUp7shUgrwGxAuG6DpatqUDPEPseqLpS7x7XTMEsSP9NEZcVjBeH0R3g/640?wx_fmt=jpeg&amp;from=appmsg"
const p8 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUxUaAv8FEQCTubL7PshNQfPgS2Y3w03t92HMTfRVwVWbdTwzXS3KdGQ/640?wx_fmt=jpeg&amp;from=appmsg"
const p7 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUXOCTFKgjHlGYMK075yt7rFIUwR2iaJbkwGcia6OGgjUnL2IvMpby0icVg/640?wx_fmt=jpeg&amp;from=appmsg"
const p6 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUjkw3mDWxFAH1L2jHekAYAmxpYUCKn8xHSs1jxUpUYg66ou4wNuo7ew/640?wx_fmt=jpeg&from=appmsg"
const p5 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XU6VKjbQseu6mJbibDolUfPGS3pn36n9iaxPASMobTDjjT7Nm8EP1QmY0g/640?wx_fmt=jpeg&from=appmsg"
const p4 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUicU0ic0uI2s80T98zeeb0EL7oWiafyib1Sv2THUCBNRgRIeBFJoGF76rlg/640?wx_fmt=jpeg&from=appmsg"
const p3 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XURwicqyEic8aicvGqlo5tiakkVwjs6jfVYbhzsKWPmdCFhciaMegTZeiaAjUg/640?wx_fmt=jpeg&from=appmsg"
const p2 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUPQmtWmTOvEdDRxa2G9GImDiahmoqicaMnPj54l4iaP4rbPw7eSibWfPmLg/640?wx_fmt=jpeg&from=appmsg"
const p1 = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUqDOSaLFqwwENvzJTHvM2VXJH1j3EFVpibhSOhCpCfl1d9jlMkVIrVfA/640?wx_fmt=jpeg&from=appmsg"


const getWechat300x500 = (num: number) => {

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

export default getWechat300x500;