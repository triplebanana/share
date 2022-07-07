// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly DEFAULT_BANNER_DESCRIPTION: string = "Safer, faster, and more stable"
  readonly ANDROID_CHROME_CLICK_DESCRIPTION = "Click to open link with Banana browser"

  readonly PACKAGE_ID = "org.triple.banana"
  readonly DEFAULT_WAIT_TIME_MS = 300

  readonly TRIPLE_BANANA_DEV_URL = "https://triplebanana.dev"
  readonly PLAYSTORE_URL = "https://play.google.com/store/apps/details"

  bannerDescription = this.DEFAULT_BANNER_DESCRIPTION

  private targetUrl: URL = new URL(this.TRIPLE_BANANA_DEV_URL)
  private targetUrlOnly: string = ""

  ngOnInit(): void {
    this.processShareLink()
  }

  onBannerClick() {
    this.gotoLinkOrStore(this.targetUrlOnly)
  }

  private processShareLink() {
    const linkTo = this.getLinkToUrl()

    if (!linkTo) {
      console.error("Failed to parse banana link : " + window.location.toString())
      this.moveToUrl(this.TRIPLE_BANANA_DEV_URL)
      return
    }
    this.targetUrl = linkTo

    this.targetUrlOnly = linkTo.toString().substring(linkTo.protocol.length + "//".length)
    this.gotoLinkOrStore(this.targetUrlOnly)
  }

  private gotoLinkOrStore(url: string) {
    const userAgent = this.getUserAgent();
    console.log(userAgent)
    if (userAgent.match(/Android/)) {
      if (userAgent.match(/Chrome/)) {
        this.handleChromium(url)
      } else {
        this.handleOtherBrowsers(url)
      }
    }
    else {
      this.moveToUrl(this.targetUrl.toString())
    }
  }

  private getLinkToUrl(): URL | null {
    const currentURL = new URL(this.getCurrentUrl())
    const bananaLink = currentURL.searchParams.get('sharelink')
    if (!bananaLink) {
      return null
    }
    return new URL(bananaLink)
  }

  private handleChromium(url: string) {
    this.bannerDescription = this.ANDROID_CHROME_CLICK_DESCRIPTION
    this.moveToUrl(this.generateAndroidChromIntent(url, this.PACKAGE_ID))
  }

  private handleOtherBrowsers(url: string) {
    setTimeout(() => {
        this.moveToUrl(this.generatePlayStoreLinkUrl(this.PACKAGE_ID))
    }, this.DEFAULT_WAIT_TIME_MS)

    this.moveToUrlWithIframe(url)
  }

  private moveToUrlWithIframe(url: string): void {
    const iframe = document.createElement('iframe')
    iframe.style.visibility = 'hidden'
    iframe.src = this.generateAndroidIntent(url, this.PACKAGE_ID)
    document.body.appendChild(iframe);
    document.body.removeChild(iframe);
  }

  private generateAndroidChromIntent(url: string, packageId: string): string {
    return `intent://${url}#Intent;scheme=http;package=${packageId};end`
  }

  private moveToUrl(url: string) {
    location.href = url
  }

  private getCurrentUrl() {
    return location.href
  }

  private getUserAgent(): string {
    return navigator.userAgent
  }

  private generateAndroidIntent(url: string, packageId: string): string {
    return `intent://${url}#Intent;scheme=http;package=${packageId};S.browser_fallback_url=${url};action=android.intent.action.VIEW;end;`
  }

  private generatePlayStoreLinkUrl(packageId: string) {
    return `${this.PLAYSTORE_URL}?id=${packageId}`
  }
}
