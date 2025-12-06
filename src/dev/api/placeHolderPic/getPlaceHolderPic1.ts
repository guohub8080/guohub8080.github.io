// <img src="https://fakeimg.pl/300/">
// <img src="https://fakeimg.pl/250x100/">
// <img src="https://fakeimg.pl/250x100/ff0000/">
// <img src="https://fakeimg.pl/350x200/ff0000/000">
// <img src="https://fakeimg.pl/350x200/ff0000,128/000,255">
// <img src="https://fakeimg.pl/350x200/?text=Hello">
// <img src="https://fakeimg.pl/200x100/?retina=1&text=こんにちは&font=noto">
// <img src="https://fakeimg.pl/350x200/?text=World&font=lobster">
// There are three bonus fonts you can choose
// by passing font=lobster, font=bebas, or font=museo in the URL.
// Also please note that the font=noto is available for chinese/japanese/korean texts.
const getPlaceHolderPic1 = (w: number = 350, h: number = 200, bgColor: string = "777777",
                            textColor: string = "EFEFEF",
                            transparency = 255) => {
  return `https://fakeimg.pl/${w}x${h}/${bgColor},${transparency}/${textColor},${transparency}/?&font=bebas`
}
export default getPlaceHolderPic1