// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Navigator } from '../navigator/navigator';
import { TestCommon } from '../test/testCommon';
import { BrowserFactory } from './browser-factory';

describe('BrowserFactory', () => {

  it('should return android chrome browser types', (() => {
    TestCommon.mockUserAgent(TestCommon.USER_AGENT_ANDROID_CHROME_BROWSER)

    const browser = BrowserFactory.getBrowser(new Navigator(location))

    expect(browser.constructor.name).toEqual('AndroidChromeBrowser')
  }));

  it('should return android browser types', (() => {
    TestCommon.mockUserAgent(TestCommon.USER_AGENT_ANDROID_WEB_VIEW)

    const browser = BrowserFactory.getBrowser(new Navigator(location))

    expect(browser.constructor.name).toEqual('AndroidBrowser')
  }));

  it('should return default browser types', (() => {
    TestCommon.mockUserAgent(TestCommon.USER_AGENT_LINUX_CHROME)

    const browser = BrowserFactory.getBrowser(new Navigator(location))

    expect(browser.constructor.name).toEqual('DefaultBrowser')
  }));
})
