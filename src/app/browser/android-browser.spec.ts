// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { fakeAsync, tick } from '@angular/core/testing'
import { Navigator } from '../navigator/navigator';
import { ShareLink } from '../shareUrl/sharelink-url';
import { TestCommon } from '../test/testCommon';
import { AndroidBrowser } from './android-browser';

describe('AndroidBrowser', () => {
  const fakeLocation = {
    href: ""
  }

  it('should navigate android intent including target url using shareUrl', fakeAsync(() => {
    // given
    const navigator = new Navigator(fakeLocation as Location)
    const androidBrowser = new AndroidBrowser(navigator)

    const shareLinkUrl = TestCommon.generateTestShareLink("https://google.com")

    // There is no good way to check url has been navigated by iframe, so here spy on private method
    const navigateWithIframe = spyOn<any>(androidBrowser, 'navigateWithIframe')
      .and.callFake((url: string): void => console.log("do not move for test"))

    // when
    androidBrowser.navigate(new ShareLink(shareLinkUrl))
    tick(300)

    // then
    expect(navigateWithIframe).toHaveBeenCalled()
  }));

  it('should navigate to playstore if not navigated to share link', fakeAsync(() => {
    // given
    const navigator = new Navigator(fakeLocation as Location)
    const androidBrowser = new AndroidBrowser(navigator)

    const shareLinkUrl = TestCommon.generateTestShareLink("https://google.com")

    // when
    androidBrowser.navigate(new ShareLink(shareLinkUrl))
    tick(300)

    // then
    expect(fakeLocation.href).toEqual(AndroidBrowser.generatePlayStoreLinkUrl(AndroidBrowser.PACKAGE_ID))
  }));
})
