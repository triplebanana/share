// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { fakeAsync, TestBed, tick } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { AppComponent } from './app.component'
import { TestCommon } from './test/testCommon'

describe('AppComponent', () => {
  // NOTE: If location.href change, can not run test any more,
  // In other hands, location.href is not configurable so that could not mock the href by spyOnProperty
  // so here use fakeLocation
  const fakeLocation = {
    href: ""
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: 'Location', useValue: fakeLocation }
      ]
    }).compileComponents()
  });

  it('should display icon and description', fakeAsync(() => {
    // given
    const shareUrl = "https://google.com"
    fakeLocation.href = TestCommon.generateTestShareLink(shareUrl)

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    tick()

    TestCommon.mockUserAgent(TestCommon.USER_AGENT_ANDROID_WEB_VIEW)

    // when
    app.ngOnInit()
    fixture.detectChanges()

    // then
    const icon = fixture.debugElement.query(By.css(".bannerIconLarge"))
    expect(icon.nativeElement).toBeDefined()
    const description = fixture.debugElement.query(By.css(".bannerDescription"))
    expect(description.nativeElement.textContent.trim()).toEqual(app.DEFAULT_BANNER_DESCRIPTION)

    tick(app.CLICK_GUIDE_WAITING_IN_MS)
  }));

  it('should display click banner if sharelink not navigated', fakeAsync(() => {
    // given
    const shareUrl = "https://google.com"
    fakeLocation.href = TestCommon.generateTestShareLink(shareUrl)

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    TestCommon.mockUserAgent(TestCommon.USER_AGENT_ANDROID_CHROME_BROWSER)

    // when
    app.ngOnInit()
    fixture.detectChanges()
    tick(app.CLICK_GUIDE_WAITING_IN_MS)
    fixture.detectChanges()

    // then
    const icon = fixture.debugElement.query(By.css(".bannerIconLarge"))
    expect(icon.nativeElement).toBeDefined()
    const description = fixture.debugElement.query(By.css(".bannerDescription"))
    expect(description.nativeElement.textContent.trim()).toEqual(app.ANDROID_CHROME_CLICK_DESCRIPTION)
  }));
})
