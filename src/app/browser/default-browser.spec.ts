// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Navigator } from '../navigator/navigator';
import { ShareLink } from '../shareUrl/sharelink-url';
import { TestCommon } from '../test/testCommon';
import { DefaultBrowser } from './default-browser';

describe('DefaultBrowser', () => {

  const fakeLocation = {
    href: ""
  }

  it('should navigate shareLink url', (() => {
    // given
    const navigator = new Navigator(fakeLocation as Location)
    const defaultBrowser = new DefaultBrowser(navigator)

    const shareLinkUrl = "https://google.com"
    const shareLink = new ShareLink(TestCommon.generateTestShareLink(shareLinkUrl))

    // when
    defaultBrowser.navigate(shareLink)

    // then
    expect(fakeLocation.href).toEqual(shareLinkUrl)
  }));
})
