# 头部固定信息

如下：

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
```

头部信息以后是类似`body`的信息，整体结构如下：

# 整体结构

```angular2html

<score-partwise version="4.0">
	<work>
		<!--标题-->
	</work>
	<identification>
		<!--作者、作曲等信息-->
	</identification>
	<part-list>
		<!--全部part的概括列表-->
	</part-list>
	<part id="P1">
		<!--具体每一part的内容-->
	</part>
</score-partwise>
```

# 标题work:

`work-number`：对应乐谱在副标题上的位置。

`work-title`：主标题。注意，`work-number`必须在`work-title`上面，否则导入MuseScore4.0版本时会报错。

# identification:

`creator type="composer"`:右下角。作曲者。

`creator type="poet"`：左下角。词作者。