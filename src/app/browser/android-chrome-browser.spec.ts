// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Navigator } from '../navigator/navigator';
import { ShareLink } from '../shareUrl/sharelink-url';
import { TestCommon } from '../test/testCommon';
import { AndroidBrowser } from './android-browser';
import { AndroidChromeBrowser } from './android-chrome-browser';

describe('AndroidChromeBrowser', () => {

  const fakeLocation = {
    href: ""
  }

  it('should navigate android intent including target url using shareUrl', (() => {
    // given
    const navigator = new Navigator(fakeLocation as Location)
    const androidBrowser = new AndroidChromeBrowser(navigator)

    const shareLinkUrl = "https://google.com"
    const shareLink = new ShareLink(TestCommon.generateTestShareLink(shareLinkUrl))

    // when
    androidBrowser.navigate(shareLink)

    // then
    const calledIntent = fakeLocation.href
    const splittedIntent = calledIntent.split(';')
    expect(splittedIntent[0]).toEqual(`intent://${new URL(shareLinkUrl).host}#Intent`)
    expect(splittedIntent[1]).toEqual(`scheme=https`)
    expect(splittedIntent[2]).toEqual(`package=${AndroidBrowser.PACKAGE_ID}`)
    expect(splittedIntent[3]).toEqual(`S.browser_fallback_url=${new URL(shareLinkUrl).host}`)
    expect(splittedIntent[4]).toEqual(`action=android.intent.action.VIEW`)
    expect(splittedIntent[5]).toEqual(`end`)
  }));
})
