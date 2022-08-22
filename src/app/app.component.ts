// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Component, Inject, OnInit } from '@angular/core'
import { ShareLink } from './shareUrl/sharelink-url'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly TRIPLE_BANANA_DEV_URL = "https://triplebanana.dev"

  readonly DEFAULT_BANNER_DESCRIPTION: string = "Safer, faster, and more stable"
  readonly ANDROID_CHROME_CLICK_DESCRIPTION = "Click to open link with Banana browser"

  readonly CLICK_GUIDE_WAITING_IN_MS = 500

  bannerDescription = this.DEFAULT_BANNER_DESCRIPTION

  private shareLink: ShareLink

  constructor(
    @Inject('Location') private location: Location
  ) {
    this.shareLink = this.getShareLinkUrl()
  }

  ngOnInit(): void {
    this.processShareLink()
  }

  navigate(): void {
    // Not Implemented
  }

  private processShareLink(): void {
    if (!this.shareLink.getUrl()) {
      console.error("Failed to parse banana link : "
        + this.location.href.toString())
      this.location.href = this.TRIPLE_BANANA_DEV_URL
      return
    }

    this.navigate()

    setTimeout(() => {
      this.bannerDescription = this.ANDROID_CHROME_CLICK_DESCRIPTION
    }, this.CLICK_GUIDE_WAITING_IN_MS)
  }

  private getShareLinkUrl(): ShareLink {
    return new ShareLink(this.location.href)
  }
}
