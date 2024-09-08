// noinspection ES6PreferShortImport

import {XMLBuilder} from "fast-xml-parser";
import guoDT from "../../common/utils/guoDT.ts";


export class ScoreMeta {
  public left: string;
  public title: string;
  public subTitle: string;
  public right: string;
  public software: string;
  public rights: string;


  constructor(title: string, subTitle?: string,
              right?: string, left?: string) {
    this.title = title
    this.subTitle = subTitle
    this.right = right
    this.left = left
    this.software = "Music96 by Guo"
    this.rights = "©guo2018@88.com"
  }

  public get buildObj() {
    return {
      "work": {
        "work-number": this.subTitle,
        "work-title": this.title
      },
      "identification":
        {
          "creator": [
            {"#text": this.right, "@_type": "composer"},
            {"#text": this.left, "@_type": "poet"}
          ],
          "rights": this.rights
        },
      "encoding": {
        "software": this.software,
        "encoding-date": guoDT.getFormattedDayjs(guoDT.getDayjs(), "YYYY-MM-DD"),
        "supports": [
          {"@_element": "beam", "@_type": "yes", "#text": ""},
          {"@_element": "accidental", "@_type": "yes", "#text": ""}
        ]
      }
    }
  }

  public get xml() {
    const builder = new XMLBuilder({
      ignoreAttributes: false, suppressEmptyNode: true
    })
    return builder.build(this.buildObj)
  }
}