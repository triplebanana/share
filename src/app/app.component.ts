// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Component, Inject, OnInit } from '@angular/core'
import { ShareLink } from './shareUrl/sharelink-url'
import { BrowserFactory } from './browser/browser-factory'
import { Navigator as ShareLinkNavigator } from './navigator/navigator'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly TRIPLE_BANANA_DEV_URL = "https://triplebanana.dev"

  readonly DEFAULT_BANNER_DESCRIPTION: string = "Safer, faster, and more stable"
  readonly ANDROID_CHROME_CLICK_DESCRIPTION = "Click to open link with Banana browser"

  bannerDescription = this.DEFAULT_BANNER_DESCRIPTION

  private shareLink: ShareLink
  private navigator = new ShareLinkNavigator(this.location)

  constructor(
    @Inject('Location') private location: Location
  ) {
    this.shareLink = this.getShareLinkUrl()
  }

  ngOnInit(): void {
    this.processShareLink()
  }

  navigate() {
    const browser = BrowserFactory.getBrowser(this.navigator)
    browser.navigate(this.shareLink)
  }

  private processShareLink() {
    if (!this.shareLink.getUrl()) {
      console.error("Failed to parse banana link : "
        + this.location.href.toString())
      this.location.href = this.TRIPLE_BANANA_DEV_URL
      return
    }

    this.navigate()

    setTimeout(() => {
      this.bannerDescription = this.ANDROID_CHROME_CLICK_DESCRIPTION
    }, 500)
  }

  private getShareLinkUrl(): ShareLink {
    return new ShareLink(this.location.href)
  }
}
